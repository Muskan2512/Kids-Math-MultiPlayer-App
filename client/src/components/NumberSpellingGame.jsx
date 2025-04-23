import React, { useState, useEffect } from "react";
import { toWords } from "number-to-words";
import { useNavigate } from "react-router-dom";

import axios from "axios";


const getRandomNumber = () => Math.floor(Math.random() * 90) + 10;

const NumberSpellingGame = () => {
  const navigate=useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const q = Array.from({ length: 3 }, () => getRandomNumber());
    setQuestions(q);
    setUserAnswers(Array(3).fill(null));
  }, []);

  useEffect(() => {
    if (gameOver) {
      const score = userAnswers.filter((ans) => ans?.isCorrect).length;
  
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
              game: "word-spelling",
              score,
            }),
          });
      
          const data = await response.json();
          console.log("Score submitted: ", data);
        } catch (err) {
          console.error("Error submitting score: ", err);
        }
      };
  
      submitScore();
    }
  }, [gameOver]);
  


  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleSubmit = () => {
    const correct = toWords(questions[currentIndex]).toLowerCase();
    const input = userInput.trim().toLowerCase();

    if (input === correct) {
      const sound = new Audio("/correct.mp3");
      sound.play();
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentIndex] = {
        input: userInput,
        isCorrect: true,
        correctAnswer: correct,
      };
      setUserAnswers(updatedAnswers);
      setFeedback("✅ Correct!");

      if (currentIndex === questions.length - 1) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setUserInput("");
          setFeedback("");
        }, 1000);
      }
    } else {
      const sound = new Audio("/wrong.mp3");
      sound.play();
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentIndex] = {
        input: userInput,
        isCorrect: false,
        correctAnswer: correct,
      };
      setUserAnswers(updatedAnswers);
      setFeedback(`❌ Correct Answer: ${correct}`);

      if (currentIndex === questions.length - 1) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setUserInput("");
          setFeedback("");
        }, 1000);
      }
    }
  };

  const handlePlayAgain = () => {
    const q = Array.from({ length: 3 }, () => getRandomNumber());
    setQuestions(q);
    setUserAnswers(Array(3).fill(null));
    setCurrentIndex(0);
    setUserInput("");
    setFeedback("");
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen relative bg-image-number p-6 text-center">
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Show Rules Screen */}
      {!gameStarted && !gameOver && (
        <div className="bg-[#ffffffe6] rounded-xl shadow-lg p-6 max-w-lg mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-purple-500 mb-4">
            🔤 Number Spelling Game
          </h1>
          <ul className="text-left text-gray-800 mb-6 list-disc pl-5">
            <li>You will be shown 3 random two-digit numbers.</li>
            <li>Type the correct spelling for each number.</li>
            <li>If your answer is correct, you move to the next question.</li>
            <li>If wrong, you stay on the same question with the correct answer shown.</li>
            <li>Try to answer all correctly!</li>
          </ul>
          <button
            onClick={handleStartGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg text-lg"
          >
            Start Game 🚀
          </button>
        </div>
      )}

      {/* Game Screen */}
      {gameStarted && !gameOver && (
        <div className="bg-[#ffffffe6] rounded-xl shadow-lg p-6 max-w-lg mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-purple-500 mb-6">
            🔤 Number Spelling Game
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Spell the Number:
          </h2>
          <p className="text-5xl font-bold text-blue-600 mb-6">
            {questions[currentIndex]}
          </p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type spelling here..."
            className="border border-gray-800 rounded-lg px-4 py-2 text-lg w-full mb-4"
            disabled={userAnswers[currentIndex]?.isCorrect}
          />

          {feedback && (
            <p className={`font-semibold ${feedback.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {feedback}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg text-lg"
            disabled={userAnswers[currentIndex]?.isCorrect}
          >
            Submit
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10 relative z-10">
          <h2 className="text-2xl text-green-700 font-bold mb-4">🎉 Game Over!</h2>
          <p className="text-lg text-gray-700 mb-4">
            You answered {userAnswers.filter((ans) => ans?.isCorrect).length} out of 3 correctly.
          </p>
          <button
            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-lg mr-4"
            onClick={handlePlayAgain}
          >
            Play Again 🔁
          </button>
          <button
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-lg"
            onClick={() => navigate("/all-games")}
          >
            Go to All Games 🕹️
          </button>
        </div>
      )}
    </div>
  );
};

export default NumberSpellingGame;
