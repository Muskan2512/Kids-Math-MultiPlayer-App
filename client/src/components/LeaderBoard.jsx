import React, { useEffect, useState } from "react";
import axios from "axios";

const gameTypes = {
  fruits: "Fruits Game",
  "roman-number": "Roman Number Game",
  "word-spelling": "Number Spelling Game",
};

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState("fruits");
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async (game) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/scores/leaderboard/${game}`);
      console.log("Leaderboard data:", res.data);
      setLeaders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setLeaders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedGame);
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-image11 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        🏆 Game Leaderboard
      </h1>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {Object.entries(gameTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedGame(key)}
            className={`px-6 py-3 rounded-full font-semibold shadow ${
              selectedGame === key
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 hover:bg-blue-200"
            } transition`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading leaderboard...</p>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
            {gameTypes[selectedGame]} Top Performers
          </h2>
          {leaders.length === 0 ? (
            <p className="text-center text-gray-600">No scores yet.</p>
          ) : (
            <ul className="space-y-3">
              {leaders.map((player, index) => (
                <li
                  key={index}
                  className="flex justify-between p-3 bg-blue-100 rounded-lg shadow-sm"
                >
                  <span className="font-medium">
                    {index + 1}. {player?.userId?.username}
                  </span>
                  <span className="font-bold text-blue-800">{player.score}</span>
                  {/* <span className="font-bold text-blue-800">{new Date(player.updatedAt).toLocaleTimeString()}</span> */}
                  <span className="font-light text-blue-800">{new Date(player.updatedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long", // use "2-digit" if you want numeric month
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  })}</span>

                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
