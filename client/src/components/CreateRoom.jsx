import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";

const CreateRoom = () => {
  const copyRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [roomName,setRoomName]=useState(nanoid(6));

  const handleCopy = () => {
    navigator.clipboard.writeText(copyRef.current.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen w-screen bg-image-allGames flex flex-col items-center justify-center text-white">
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold">
          Your room number is:{" "}
          <span ref={copyRef} className="font-mono text-blue-600">
          {roomName}
          </span>
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
          >
            Copy
          </button>
          <Link className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-md transition" to={"/join-room"}>
            Join
          </Link>
        </div>

        {copied && <p className="text-green-500 mt-2">Copied!</p>}
      </div>
    </div>
  );
};

export default CreateRoom;
