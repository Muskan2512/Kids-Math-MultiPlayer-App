import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
const Game = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  // const [scores, setScores] = useState({});
  const [scores, setScores] = useState([]);

  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);



  useEffect(() => {
    socket.emit("join_room", roomName);

    socket.on("room_users", (users) => {
      console.log("Users in room:", users);
    });

    socket.on("game_started", () => {
      setGameStarted(true);
      setTimer(60);
      setIsAnswered(false); // Ensure answering is allowed
    });
    
  
    socket.on("new_question", (data) => {
      setQuestion(data);
      setAnswer("");
      setIsAnswered(false); // Allow new answer submissions
    });
    
    socket.on("update_scores", (data) => {
      console.log("Update scores data is:",data);
      setScores(data);
    });

    socket.on("game_over", (data) => {
      console.log("Game over data is:",data);
      setWinner(data.winnerName);
    });

    return () => {
      socket.off("game_started");
      socket.off("new_question");
      socket.off("update_scores");
      socket.off("game_over");
    };
  }, [roomName]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  const startGame = () => {
    socket.emit("start_game", roomName);
  };

  const submitAnswer = () => {
    if (isAnswered) return; // Prevent multiple submissions
  
    socket.emit("submit_answer", {
      room: roomName,
      answer: { question: question.question, value: parseInt(answer) },
    });
  
    setIsAnswered(true); // Disable answering until the next question
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-image2 items-center justify-center  text-white p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Math Quiz</h2>

        {!gameStarted ? (
          <button
            onClick={startGame}
            className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Start Game
          </button>
        ) : winner ? (
          <h2 className="text-2xl font-bold text-green-500 mt-4">
            Game Over! Winner: {winner}
          </h2>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-800">Time Left: {timer}s</h3>
            {question && <p className="text-xl font-medium text-gray-700 mt-4">{question.question}</p>}
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700 mt-2"
            />
            <button
              onClick={submitAnswer}
              className="mt-4 w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Submit Answer
            </button>
          </>
        )}

        {/* <h3 className="text-lg font-medium text-gray-800 mt-4">Scores:</h3>
        <ul className="mt-2 text-gray-700">
          {Object.entries(scores).map(([user, score]) => (
            <li key={user} className="text-sm bg-gray-100 p-2 rounded-md my-1">
              {user.name}: {score} points
            </li>
          ))}
        </ul> */}
        <h3 className="text-lg font-medium text-gray-800 mt-4">Scores:</h3>
<ul className="mt-2 text-gray-700">
  {scores.map((player, index) => (
    <li
      key={player.id}
      className="text-sm bg-gray-100 p-2 rounded-md my-1 flex justify-between"
    >
      <span>{index + 1}. {player.name}</span>
      <span>{player.score} pts</span>
    </li>
  ))}
</ul>


        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-md"
        >
          Leave Game
        </button>
      </div>
    </div>
  );
};

export default Game;
