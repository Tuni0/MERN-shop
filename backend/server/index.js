import express from "express";
import { createConnection } from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import { Connector } from "@google-cloud/cloud-sql-connector";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3006",
      "http://localhost:5173",
      "https://mern-shop-khaki.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(bodyParser.json());

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: "shop-442823:europe-north1:shop",
  ipType: "PUBLIC",
});
const pool = await mysql.createPool({
  ...clientOpts,
  user: "tunio",
  password: "U|k`&J`I_%d6.2.#",
  database: "shop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const db = await pool.getConnection((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to Google Cloud SQL!");
});

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
app.get("/protected-route", isAuthenticated, (req, res) => {
  res.json({ message: "This is a protected route!" });
});

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.json({ validUser: true, username: req.session.user });
  } else {
    return res.json({ validUser: false });
  }
});

app.get("/users", (req, res) => {
  const sqlSelect = "SELECT * FROM users";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_name = req.body.userName;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sqlInsert =
    "INSERT INTO users (user_name,email, password) VALUES (?,?, ?)";
  db.query(sqlInsert, [user_name, email, hashedPassword], (err, result) => {
    if (err) {
      console.log(err);
      console.log(result);
      if (err.sqlMessage.includes("Duplicate entry")) {
        return res
          .status(409)
          .send("User already exists with this email! Please log in!");
      } else {
        return res.status(500).send("Error inserting values"); // Ensure only one response is sent
      }
    } else {
      res.send("Values inserted");
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sqlSelect = "SELECT * FROM users WHERE email = ?";
  db.query(sqlSelect, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching user");
    } else {
      if (result.length > 0) {
        const user = result[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) {
          req.session.user = user.user_name;
          req.session.userId = user.idusers; // Store user ID in session
          console.log("Session:", req.session.user);
          console.log("UserId:", req.session.userId);

          return res.json({ Login: true, username: user.user_name });
        } else {
          return res.send("Incorrect password");
        }
      } else {
        return res.send("User not found");
      }
    }
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    } else {
      return res.json({ Logout: true });
    }
  });
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching products");
  }
});

app.get("/products/:number", (req, res) => {
  const number = req.params.number;
  const sqlSelect = `SELECT * FROM products WHERE idproducts = ? `;
  db.query(sqlSelect, [number], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching product");
    } else {
      return res.json(result);
    }
  });
});

app.post("/products/:number/basket", (req, res) => {
  const number = req.params.number;
  const selectedColor = req.body.selectedColor.name;
  const selectedSize = req.body.selectedSize.name;

  const sqlSelect = `SELECT * FROM products WHERE idproducts = ${number}`;
  console.log("user:", req);
  db.query(sqlSelect, [number], (err, result) => {
    if (err) {
      console.log(err);
      console.log(result);

      return res.status(500).send("Error fetching product");
    } else {
      const sqlInsert = `INSERT INTO basket (user_id, product_id, quantity, date_add, color, size) VALUES (?, ?, ?, NOW(), ?, ?)`;
      db.query(
        sqlInsert,
        [req.session.userId, number, 1, selectedColor, selectedSize],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error inserting values");
          } else {
            return res.json(result);
          }
        }
      );
    }
  });
});

app.get("/basketItems", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }
  const sqlSelect = `SELECT COUNT(*) as num FROM basket WHERE user_id = ${req.session.userId}`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching basket items");
    } else {
      return res.json(result);
    }
  });
});

app.get("/checkout", isAuthenticated, (req, res) => {
  const UserId = req.session.userId;
  const sqlSelect = `SELECT 
    basket.product_id, 
    basket.user_id,
    basket.color,
    basket.size,
    SUM(basket.quantity) as quantity, 
    products.price, 
    products.description, 
    products.img_src
FROM 
    basket
INNER JOIN 
    products 
ON 
    products.idproducts = basket.product_id
WHERE 
    basket.user_id = ${UserId}
GROUP BY 
    basket.product_id, 
    basket.user_id,
    basket.color,
    basket.size,
    products.price, 
    products.description, 
    products.img_src;
`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching basket items");
    } else {
      console.log("Session:", req.session.user);
      console.log("UserId:", req.session.userId);
      return res.json(result);
    }
  });
});

app.listen(3006, () => {
  console.log("Server running on port 3006");
});
