import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const numberToRoman = (num) => {
  const lookup = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let roman = "";
  for (let key in lookup) {
    while (num >= lookup[key]) {
      roman += key;
      num -= lookup[key];
    }
  }
  return roman;
};

const modes = {
  questions: {
    label: "10 Questions",
    maxQuestions: 10,
    timeLimit: null
  },
  score: {
    label: "First to 5 Points",
    maxScore: 5,
    timeLimit: null
  },
  timer: {
    label: "1 Minute Challenge",
    maxQuestions: null,
    maxScore: null,
    timeLimit: 60
  }
};

const getRandomNumber = () => Math.floor(Math.random() * 50) + 1;

const RomanNumberGame = () => {
  const navigate = useNavigate();
  const [number, setNumber] = useState(getRandomNumber());
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const generateOptions = (num) => {
    const correct = numberToRoman(num);
    const decoys = new Set();
    while (decoys.size < 3) {
      const wrong = numberToRoman(getRandomNumber());
      if (wrong !== correct) decoys.add(wrong);
    }
    const allOptions = [...decoys, correct].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const nextQuestion = () => {
    const newNumber = getRandomNumber();
    setNumber(newNumber);
    generateOptions(newNumber);
    setQuestions((q) => q + 1);
  };

  const handleAnswer = (selected) => {
    if (gameOver) return;
    if (selected === numberToRoman(number)) {
      setScore((s) => s + 1);
    }
    nextQuestion();
  };

  const startGameWithMode = (modeKey) => {
    setSelectedMode(modeKey);
    setScore(0);
    setQuestions(0);
    setGameOver(false);
    setGameStarted(true);
    setNumber(getRandomNumber());
    setTimeLeft(modes[modeKey].timeLimit || 60);
  };
  const exitGame = () => {
    setGameStarted(false);
    setSelectedMode(null);
    setScore(0);
    setQuestions(0);
    setGameOver(false);
    setTimeLeft(60);
  };


  useEffect(() => {
    generateOptions(number);
  }, [number]);

  useEffect(() => {
    if (!gameStarted || !selectedMode || !modes[selectedMode].timeLimit) return;
    if (timeLeft <= 0) {
      setGameOver(true);
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (!selectedMode) return;
    const mode = modes[selectedMode];
    if (
      (mode.maxQuestions && questions >= mode.maxQuestions) ||
      (mode.maxScore && score >= mode.maxScore)
    ) {
      setGameOver(true);
    }
  }, [questions, score, selectedMode]);



  useEffect(() => {
    const submitScore = async () => {
      const userId = localStorage.getItem("id");
    
      try {
        const response = await fetch("http://localhost:5000/api/scores/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            game: "roman-number",
            score,
          }),
        });
    
        const data = await response.json();
        console.log("Score submitted: ", data);
      } catch (err) {
        console.error("Error submitting score: ", err);
      }
    };
    if (gameOver) {
      submitScore();
    }
  }, [gameOver]);





  return (
    <div className="min-h-screen overflow-hidden bg-image-roman bg-gradient-to-b from-blue-300 to-blue-500 p-6 text-center">
  

      <h1 className="text-4xl font-bold text-pink-700 mb-6 animate-bounce">
        🏛️ Roman Number Challenge!
      </h1>

      {!gameStarted ? (
        <div className="space-y-4 ">
          <p className="text-xl font-semibold text-white">Choose a Game Mode:</p>
          <div className="flex justify-center gap-4 flex-col w-fit mx-auto">
            {Object.entries(modes).map(([key, mode]) => (
             
              <motion.button
               key={key}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => startGameWithMode(key)}
        >
          {mode.label}
        </motion.button>
            ))}
          </div>
          <motion.button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-2xl text-lg shadow-lg transition transform hover:scale-105 w-fit text-center p-16"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/all-games")}
        >
           Go   to   All   Games     
        </motion.button>
        </div>
      ) : gameOver ? (
        <div className="space-y-4">
          <h2 className="text-2xl text-green-700 font-bold">
            🎉 Game Over! Your Score: {score}
          </h2>
          <button
            onClick={() => setGameStarted(false)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg text-xl shadow hover:bg-green-600"
          >
            Play Again 🔁
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-xl inline-block"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            What is the Roman numeral for:
          </h2>
          <p className="text-5xl font-bold text-pink-600 mb-4">{number}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="bg-blue-200 hover:bg-blue-300 p-3 rounded-lg text-xl font-semibold"
              >
                {opt}
              </button>
            ))}
          </div>
          <p className="text-gray-600">Score: {score}</p>
          {selectedMode && modes[selectedMode].timeLimit && (
            <p className="text-red-500">⏱️ Time Left: {timeLeft}s</p>
          )}

          <div className="mt-4">
            <button
              onClick={exitGame}
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Exit to Modes
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RomanNumberGame;
