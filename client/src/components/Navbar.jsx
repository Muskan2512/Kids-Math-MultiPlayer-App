import React,{useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ContextStore } from "../../store/ContextStore";

const Navbar = () => {
  const navigate = useNavigate();
  const {id,username,setId,setUsername}=useContext(ContextStore);

  const handleLogin = () => {    
    navigate("/login");
  };

  const handleSignup = () => {
    // Navigate to your signup page
    navigate("/signup");
  };

  return (
    <nav className="bg-[#1352a0] shadow-md py-4 px-6 flex justify-between items-center">
      <div className="lg:text-2xl  text-xl font-bold hover:cursor-pointer text-yellow-500 flex items-center gap-2" onClick={()=>{navigate('/')}}>
        <span>🎲</span> <span>Math Mania</span> <span>🎉</span>
      </div>
      {

        !username ? (
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogin}
          className="bg-purple-500 hover:bg-purple-400 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200"
        >
          🧠 Login
        </button>
        <button
          onClick={handleSignup}
          className="bg-pink-500 hover:bg-pink-400 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200"
        >
          ✍️ Signup
        </button>
      </div>):
      <div className="flex items-center gap-4">
      <button
          onClick={()=>{navigate("/all-games")}}
          className="bg-pink-500 hover:bg-pink-400 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200"
        >
          All Games
        </button>
      <button
          onClick={()=>{navigate("/leaderboard")}}
          className="bg-pink-500 hover:bg-pink-400 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200"
        >
          LeaderBoard
        </button>
      <button
          onClick={()=>{localStorage.clear();setId(null);setUsername(null);navigate("/login");toast.success("Logged out successfully")}}
          className="bg-pink-500 hover:bg-pink-400 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200"
        >
          ✍️ Logout
        </button>
      </div>
      }
    </nav>
  );
};

export default Navbar;
