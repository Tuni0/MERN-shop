import { BsGithub } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { easeIn, motion } from "framer-motion";

function Contact() {
  function handleGithub() {
    window.open("https://github.com/Tuni0");
  }

  function handleLinkedIn() {
    window.open("https://www.linkedin.com/in/wiktor-mazepa-812199338/");
  }
  return (
    <div id="contact" className="flex-col pt-24">
      <div className="mb-12">
        <motion.h1
          className="text-4xl text-violet-500 dark:text-violet-600 mb-4 font-abeezee font-semibold"
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            ease: "easeInOut",
            repeat: Infinity,
            duration: 3,
          }}
        >
          Get in touch
        </motion.h1>
      </div>
      {/*
        <div className="mb-8">
          <p className="text-1xl text-gray-900 dark:text-white ">+48 881 451 000</p>
        </div>
        */}

      <div className="mb-8">
        <a
          href="mailto:wiktor.mazepa@gmail.com "
          className="text-1xl text-gray-900 dark:text-white "
        >
          wiktor.mazepa@gmail.com
        </a>
      </div>
      <div>
        <button
          type="button"
          onClick={() => handleGithub()}
          className="-m-2.5  p-2.5 text-gray-700 mr-4 "
        >
          <BsGithub className="text-4xl text-gray-900 dark:text-white" />
        </button>
        <button
          type="button"
          onClick={() => handleLinkedIn()}
          className="-m-2.5  p-2.5 text-gray-700 "
        >
          <BsLinkedin className="text-4xl text-gray-900 dark:text-white" />
        </button>
      </div>
    </div>
  );
}

export default Contact;
