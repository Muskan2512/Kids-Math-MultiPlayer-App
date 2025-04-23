import React, { useRef, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
const generateSimpleQuestion = () => {
  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  const operator = Math.random() > 0.5 ? "+" : "-";
  const result = operator === "+" ? num1 + num2 : num1 - num2;
  return { num1, num2, operator, result };
};

const SimpleMathWithCanvas = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [question, setQuestion] = useState(generateSimpleQuestion());

  const startDrawing = ({ nativeEvent }) => {
    const ctx = canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const checkAnswer = () => {
    const correct = parseInt(answer || "0") === question.result;
    const sound = new Audio(correct ? "/correct.mp3" : "/wrong.mp3");
    sound.play();
    setFeedback(correct ? "✅ Correct!" : "❌ Try Again!");
    if(correct)nextQuestion();
  };

  const nextQuestion = () => {
    setQuestion(generateSimpleQuestion());
    setAnswer("");
    setFeedback("");
    clearCanvas();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 380;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000000";
    ctx.lineCap = "round";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full space-y-4 border-2 border-pink-300">
        <h2 className="text-2xl font-bold text-center text-pink-600">
          🧮 Simple Math Game with Drawing Board ✏️
        </h2>

        <div className="text-center text-xl text-pink-800">
          <span>{question.num1}</span> <b>{question.operator}</b>{" "}
          <span>{question.num2}</span> = ?
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-pink-400 rounded-md bg-white"
        />

        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="w-full p-3 text-lg rounded-xl border-2 text-pink-700 border-pink-300 outline-none"
        />

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            ✅ Submit
          </button>
          <button
            onClick={()=>{navigate("/all-games")}}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Exit
          </button>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
          >
            🧹 Clear Board
          </button>
        </div>

        {feedback && (
          <div
            className={`text-center text-xl font-bold ${
              feedback.includes("Correct") ? "text-green-600" : "text-red-500"
            }`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMathWithCanvas;
