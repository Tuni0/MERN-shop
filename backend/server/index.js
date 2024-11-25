import express from "express";
import { createConnection } from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import cookie from "cookie-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3006", "http://localhost:5173"],
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

const db = createConnection({
  host: "localhost",
  user: "newuser",
  password: "",
  database: "shop",
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
          console.log("Session:", req.session.user);
          return res.json({ Login: true });
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

app.listen(3006, () => {
  console.log("Server running on port 3006");
});
