import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  { name: "Fruit Counting Game", route: "/fruit-counting-game" },
  { name: "Number Spelling Game", route: "/number-spelling-game" },
  { name: "Roman Number game", route: "/roman-number-game" },
  { name: "Learn Maths", route: "/math-canvas" },
  // { name: "Puzzle Challenge", route: "/puzzle-challenge" },
  // Add more games here as needed
];

const AllGames = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-image-allGames  py-10 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        🎮 All Games
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:w-full w-fit max-w-5xl">
        {games.map((game, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-between transition hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 ">
              {game.name}
            </h2>
            <button
              onClick={() => navigate(game.route)}
              className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-300 transition cursor-pointer shadow-md transform hover:scale-105"
            >
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGames;
