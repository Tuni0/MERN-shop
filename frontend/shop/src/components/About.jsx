import React, {
  useEffect,
  useContext,
  useState,
  createContext,
  useRef,
} from "react";
import { ThemeContext } from "../App";
import { motion } from "framer-motion";

function About() {
  const { theme } = useContext(ThemeContext);
  const fullName = "Wiktor Mazepa.";
  const [name, setName] = useState(fullName);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setName((prevName) => {
        //deleting
        if (change == false) {
          if (prevName.length !== 2) {
            return prevName.substring(0, prevName.length - 2) + "|";
          } else {
            setChange(true);
            return prevName.substring(0, prevName.length - 1) + "|";
          }
        }
        //adding
        else {
          if (prevName.length !== fullName.length) {
            return fullName.substring(0, prevName.length) + "_";
          } else {
            setTimeout(() => {
              setChange(false);
            }, 3000);
            return fullName.substring(0, prevName.length + 1);
          }
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [change]);

  return (
    <div id="about" className={`z-0 mt-48 ${theme === "dark" ? "dark" : ""} `}>
      <div className="flex flex-wrap justify-center lg:justify-between">
        <div className="lg:max-w-[60%]">
          <p className="text-5xl  flex justify-start font-abeezee text-violet-500 dark:text-violet-600 h-20 mb-8">
            {name}
          </p>

          <motion.p
            className="text-black dark:text-white text-justify mb-8"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            I am studing at Wrocław University of Science and Technology. My
            major is Intelligence Electronics. I started learning front-end
            technologies like HTML, CSS, JavaScript, React, and Tailwind CSS. I
            am looking for an internship to gain experience in the field of web
            development. My goal is to become a full-stack developer. While
            studing I learn a bit of Python, VHDL, Verilog, C#. In one of my
            projects, I was a participiant in building .NET WebAssembly
            application with Razor Pages and MudBlazor components.
          </motion.p>
        </div>
        <div className="w-fit h-fit lg:pl-10  ">
          <motion.img
            className="max-w-80 rounded-full"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            src="https://raw.githubusercontent.com/Tuni0/Portofolio/refs/heads/main/portfolio/src/assets/face.jpg"
            alt="Wiktor Mazepa"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
