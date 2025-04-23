import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import socket from "../socket";

const Room = () => {
  const location = useLocation();
  const playerName = location.state?.playerName;

  const { roomName } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // socket.emit("join_room", roomName);
   
    
    socket.emit("join_room", {
      room: roomName,
      playerName: playerName,
    });
    

    socket.on("room_users", (usersList) => {
      console.log( "Users in room:", usersList);
      setUsers(usersList);
    });

    return () => {
      socket.off("room_users");
    };
  }, [roomName]);

  const startGame = () => {
    navigate(`/room/${roomName}/game`); // Navigate to Game Page (to be created)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-image2 text-white p-6">
      <div className="bg-white rounded-2xl  p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Room: {roomName}</h2>

        <h3 className="text-lg font-medium text-gray-800">Users in Room:</h3>
        {users.length > 0 ? (
          <ul className="mt-2 text-gray-700">
            {users.map((user, index) => (
              <li key={index} className="text-sm bg-blue-500 text-white p-2 rounded-md my-1">
                {user.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-2">No users in this room yet.</p>
        )}

        {users.length < 2 ? (
          <p className="text-gray-600 mt-4">Waiting for other users to join...</p>
        ) : (
          <button
            onClick={startGame}
            className="mt-4 w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Room;
