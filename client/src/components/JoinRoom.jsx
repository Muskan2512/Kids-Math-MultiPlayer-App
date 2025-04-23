import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import socket from "../socket";

const JoinRoom = () => {
  const [roomName, setRoom] = useState("");
  const [playerNameInputValue, setPlayerNameInputValue] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomName.trim() !== "") {
      socket.emit("join_room", {room:roomName, playerName: playerNameInputValue});
      navigate(`/room/${roomName}`, { state: { playerName: playerNameInputValue } });

      // navigate(`/room/${roomName}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-image2 text-white p-6">
      <div className="bg-white rounded-2xl  p-8 w-full max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Join a Room</h2>

        <div className="flex flex-col justify-center items-center gap-4">

        <input
          type="text"
          placeholder="Enter name"
          value={playerNameInputValue}
          onChange={(e) => setPlayerNameInputValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        </div>

        <button
          onClick={joinRoom}
          className="mt-4 w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
