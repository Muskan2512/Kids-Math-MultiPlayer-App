import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const fruits = [
  { name: "Apple", emoji: "🍎" },
  { name: "Banana", emoji: "🍌" },
  { name: "Strawberry", emoji: "🍓" },
  { name: "Pineapple", emoji: "🍍" },
  { name: "Orange", emoji: "🍊" },
  { name: "Pear", emoji: "🍐" },
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = () => {
  const fruit = fruits[getRandomInt(0, fruits.length - 1)];
  const count1 = getRandomInt(1, 5);
  const count2 = getRandomInt(1, 5);
  return { fruit, count1, count2 };
};

const FruitGame = () => {
  const navigate=useNavigate();
  const [score, setScore] = useState(0);


  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback("");
    setQuestionCount(1);
  };

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
          game: "fruits",
          score,
        }),
      });
  
      const data = await response.json();
      console.log("Score submitted: ", data);
    } catch (err) {
      console.error("Error submitting score: ", err);
    }
  };
  

  const checkAnswer = () => {
    const correctAnswer = question.count1 + question.count2;
    const isCorrect = parseInt(answer || "0") === correctAnswer;

    const sound = new Audio(isCorrect ? "/correct.mp3" : "/wrong.mp3");
    sound.play();

    setFeedback(isCorrect ? "🎉 Correct!" : "❌ Oops! Try again");

    // if (isCorrect) {
    //   setTimeout(() => {
    //     if (questionCount < 10) {
    //       nextQuestion();
    //     } else {
    //       setGameOver(true);
    //     }
    //   }, 1000);
    // } else {
    //   setAnswer("");
    // }
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (questionCount < 10) {
          nextQuestion();
        } else {
          submitScore(); // submit score when done
          setGameOver(true);
        }
      }, 1000);
    }else {
      setAnswer("");
      // nextQuestion();
    }
    
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback("");
    setQuestionCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen w-screen bg-image-fruit flex flex-col items-center justify-center text-white">
      {!started ? (
        <div className="p-6 max-w-md mx-auto mt-5 bg-yellow-50 border-4 border-pink-200 rounded-2xl shadow-lg space-y-6 text-center">
          <h2 className="text-3xl font-extrabold text-pink-600">🍇 Welcome to Fruit Counting Fun 🍎</h2>
          <p className="text-lg text-pink-800">
            You will see two groups of fruits. Count them and enter the total number!<br />
            The game has 10 questions. Try to get them all right! 🍌🍓🍊
          </p>
          <button
            onClick={startGame}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
          >
            🚀 Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div className="p-6 max-w-md mx-auto mt-5 bg-yellow-50 border-4 border-pink-200 rounded-2xl shadow-lg space-y-6 text-center">
          <h2 className="text-3xl font-extrabold text-pink-600">🎉 Game Over! 🎉</h2>
          <p className="text-xl text-pink-800">You've completed all 10 questions!</p>
          <div className="flex flex-col items-center justify-center space-y-2">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            🔁 Play Again
          </button>
          <button
            onClick={()=>{navigate("/all-games")}}
            className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            All Games
          </button>
          </div>
          
        </div>
      ) : (
        <div className="p-6 max-w-md mx-auto mt-5 bg-yellow-50 border-4 border-pink-200 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-3xl text-center font-extrabold text-pink-600">
            🍎 Fruit Counting Fun Game 🍇
          </h2>

          <p className="text-center text-pink-700">Question {questionCount} of 10</p>

          <div className="text-5xl text-center">
            <span>{question.fruit.emoji.repeat(question.count1)}</span>
            <span className="mx-4 text-4xl font-bold text-pink-500">+</span>
            <span>{question.fruit.emoji.repeat(question.count2)}</span>
          </div>

          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="How many fruits?"
            className="w-full p-3 text-lg rounded-xl border-2 text-pink-700 border-pink-300 outline-none"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={checkAnswer}
              className="px-6 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105"
            >
              ✅ Submit
            </button>
           
          </div>

          {feedback && (
            <div
              className={`text-center text-2xl font-bold ${
                feedback.includes("Correct") ? "text-green-600" : "text-red-500"
              }`}
            >
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FruitGame;
