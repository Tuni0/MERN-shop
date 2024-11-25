import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignInForm from "./components/SignInForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import Skills from "./components/Products.jsx";
import "./App.css";
import axios from "axios";
import RouteGuard from "./components/RouteGuard.jsx";
import Products from "./components/Products.jsx";

export const ThemeContext = createContext();
export const UserLoginContext = createContext();

axios.defaults.withCredentials = true;

function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState("");
  const navigate = useNavigate(); // Move useNavigate inside the App component

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme; // Apply theme to the body
  }, [theme]);

  useEffect(() => {
    axios
      .get("http://localhost:3006/")
      .then((res) => {
        if (res.data.validUser) {
          setUser(res.data.username);
          navigate("/");
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserLoginContext.Provider value={{ user }}>
        <div className="w-full mx-0 px-0">
          <Routes>
            <Route path="/signin" exact element={<SignInForm />} />
            <Route path="/signup" exact element={<SignUpForm />} />
            <Route path="/products" exact element={<Products />} />
            <Route
              path="/"
              exact
              element={
                <>
                  <Navbar />
                  <RouteGuard user={user}>
                    <Skills />
                  </RouteGuard>
                </>
              }
            />
          </Routes>
        </div>
      </UserLoginContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
