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
import Contact from "./components/Contact.jsx";
import ItemPage from "./components/ItemPage.jsx";
import Basket from "./components/Basket.jsx";
import SwaggerDocs from "./components/SwaggerDocs.jsx";
import Payment from "./components/Payment.jsx";
import { API_URL } from "./settings";
import PaymentCancel from "./components/PaymentCancel.jsx";
import Favourites from "./components/Favourites.jsx";

export const ThemeContext = createContext();
export const UserLoginContext = createContext({
  user: null,
  setUser: () => {},
});
export const BasketContext = createContext();

axios.defaults.withCredentials = true;

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);
  const [isBasket, setIsBasket] = useState(false);
  const navigate = useNavigate(); // Move useNavigate inside the App component

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme; // Apply theme to the body
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    axios;
    axios
      .get(`${API_URL}/session`, { withCredentials: true })

      .then((res) => {
        if (res.data.validUser && res.data.userId) {
          setUser({
            id: res.data.userId,
            email: res.data.email, // jeśli backend to zwraca
          });

          if (
            window.location.pathname === "/signin" ||
            window.location.pathname === "/signup"
          ) {
            navigate("/");
          }
        } else {
          setUser(null); // brak sesji
        }
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
      });
  }, [navigate]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserLoginContext.Provider value={{ user, setUser }}>
        <BasketContext.Provider value={{ isBasket, setIsBasket }}>
          <div className="w-full mx-0 px-0">
            <Routes>
              <Route
                path="/signin"
                exact
                element={
                  <>
                    <Navbar />
                    <SignInForm />
                  </>
                }
              />
              <Route
                path="/signup"
                exact
                element={
                  <>
                    <Navbar />
                    <SignUpForm />
                  </>
                }
              />
              <Route
                path="/products/*"
                exact
                element={
                  <>
                    <Navbar />
                    <ItemPage />
                  </>
                }
              />
              <Route
                path="/basket"
                exact
                element={
                  <>
                    <Navbar />
                    <Basket />
                  </>
                }
              />
              <Route
                path="/payment"
                exact
                element={
                  <>
                    <Navbar />
                    <Payment />
                  </>
                }
              />

              <Route
                path="/"
                exact
                element={
                  <>
                    <Navbar />
                    <RouteGuard user={user}>
                      <Skills />
                    </RouteGuard>

                    <Products />

                    <Contact />
                  </>
                }
              />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route
                path="/favourites"
                element={
                  <>
                    <Navbar />
                    <Favourites />
                  </>
                }
              />
            </Routes>
            {/*  <SwaggerDocs /> */}
          </div>
        </BasketContext.Provider>
      </UserLoginContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
