import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./components/HomePage";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Room";
import CreateRoom from "./components/CreateRoom";
import Game from "./components/Game";
import "./App.css";
import RomanNumberGame from "./components/RomanNumberGame";
import FruitCountingGame from "./components/FruitCountingGame";
import NumberSpellingGame from "./components/NumberSpellingGame";
import AllGames from "./components/AllGames";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import {ContextStore} from "../store/ContextStore";
import SimpleMathWithCanvas from "./components/SimpleMathsWithCanvas";
import LeaderBoard from "./components/LeaderBoard";

function App() {

  const [id,setId]=useState(localStorage.getItem("id"));
  const [username,setUsername]=useState(localStorage.getItem("username"));

  return (
    <div className="overflow-x-hidden">
    <ContextStore.Provider value={{
     id:id,
     setId:setId,
     username:username,
     setUsername:setUsername
    }}>
    <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-room" element={<CreateRoom/>} />
        <Route path="/join-room" element={<JoinRoom/>} />
        <Route path="/room/:roomName" element={<Room />} />
        <Route path="/room/:roomName/game" element={<Game />} />
        <Route path="/all-games" element={<AllGames />} />
        <Route path="/fruit-counting-game" element={<FruitCountingGame />} />
        <Route path="/roman-number-game" element={<RomanNumberGame />} />
        <Route path="/number-spelling-game" element={<NumberSpellingGame />} />
        <Route path="/math-canvas" element={<SimpleMathWithCanvas />} />
        <Route path="/LeaderBoard" element={<LeaderBoard />} />

        {/* <Route path="/lessons" element={<Lessons />} /> */}
      </Routes>

    </ContextStore.Provider>    
    </div>
    
  );
}

export default App;
