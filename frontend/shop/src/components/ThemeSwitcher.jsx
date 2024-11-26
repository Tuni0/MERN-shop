import React, { useContext } from "react";
import { ThemeContext } from "../App.jsx";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { BsSunFill } from "react-icons/bs";
import { motion } from "framer-motion";

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="theme-switcher">
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="-m-2 rounded-md p-2 text-gray-700"
      >
        {theme === "light" ? (
          <BsFillMoonStarsFill aria-hidden="true" className="size-6" />
        ) : (
          <BsSunFill aria-hidden="true" className="size-6 text-yellow-100" />
        )}
      </motion.button>
    </div>
  );
}

export default ThemeSwitcher;
