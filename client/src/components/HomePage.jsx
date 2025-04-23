import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "./styles.css"
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[90vh] w-screen bg-image-home flex flex-col items-center justify-center text-white">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Game Title */}
      <motion.h1
        className="text-5xl font-bold mb-6 text-yellow-300 drop-shadow-lg"
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ duration: 0.6 }}
      >
        🎲 Fun Math Quiz 🎉
      </motion.h1>

      {/* Game Description
      <p className="text-lg text-center px-6 max-w-md mb-8">
        Play exciting math challenges with friends! Solve fun problems, earn points, and become the math champion! 🏆
      </p> */}

      {/* Buttons */}
      <div className="flex gap-6">
        <motion.button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/create-room")}
        >
          🎮 Play Now
        </motion.button>

        <motion.button
          className="bg-green-400 hover:bg-green-500 text-black font-bold py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/join-room")}
        >
          🏠 Join Game
        </motion.button>
      </div>

      {/* Floating Math Icons */}
      {/* <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        ➕
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-6xl"
        animate={{ rotate: [0, -360] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        ✖️
      </motion.div>

      <motion.div
        className="absolute bottom-5 left-20 text-6xl"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        ➗
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 text-6xl"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        ➗
      </motion.div> */}
    </div>
  );
}
