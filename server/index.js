const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
app.use(cors());

const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const ScoreRoutes = require("./routes/ScoreRoutes"); // Import score routes

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the public directory

// Routes
app.use("/api", authRoutes);
app.use("/api/scores", ScoreRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mathgame").then(() => {
  console.log("MongoDB connected");
}).catch(err => console.log(err));


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const rooms = {}; // Store players and their scores
const latestQuestions = {}; // Store latest question per room

// Generate a simple math question
const generateRandomQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1-10
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "×", "÷"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question, answer;

    switch (operator) {
        case "+":
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case "-":
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
        case "×":
            question = `${num1} × ${num2}`;
            answer = num1 * num2;
            break;
        case "÷":
            question = `${num1 * num2} ÷ ${num2}`; // Ensures division has a whole number result
            answer = num1;
            break;
    }

    return { question, answer };
};

const answeredUsers = {}; // Track users who have answered for each room

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a user joins a room
  // socket.on("join_room", (room) => {
  //   if (!rooms[room]) {
  //     rooms[room] = {};
  //   }
  //   rooms[room][socket.id] = 0; // Initialize score
  //   socket.join(room);
  //   io.to(room).emit("room_users", Object.keys(rooms[room])); // Update users list
  // });
  socket.on("join_room", ({ room, playerName }) => {
  if (!rooms[room]) {
    rooms[room] = {};
  }

  // Store name and initial score
  rooms[room][socket.id] = { name: playerName, score: 0 };
  socket.join(room);

  // Send updated users list with names
  const usersInRoom = Object.entries(rooms[room]).map(([id, info]) => ({
    id,
    name: info.name,
  }));
  io.to(room).emit("room_users", usersInRoom);
});

  

socket.on("start_game", (room) => {
    let timeLeft = 60;

    io.to(room).emit("game_started"); // Notify all users that game started

    // Send the first question immediately
    const firstQuestion = generateRandomQuestion();
    latestQuestions[room] = firstQuestion;
    answeredUsers[room] = new Set(); // Reset answered users
    io.to(room).emit("new_question", firstQuestion);

    // Then start the interval for subsequent questions
    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);

            let winnerEntry = Object.entries(rooms[room])?.reduce((a, b) =>
              a[1].score > b[1].score ? a : b
            );
            io.to(room).emit("game_over", { winnerId: winnerEntry[0], winnerName: winnerEntry[1].name });

            // let winner = Object.entries(rooms[room]).reduce((a, b) =>
            //     a[1] > b[1] ? a : b
            // );
            // io.to(room).emit("game_over", { winner: winner[0] });
            return;
        }

        const newQuestion = generateRandomQuestion();
        latestQuestions[room] = newQuestion;
        answeredUsers[room] = new Set(); // Reset answered users for the new question
        io.to(room).emit("new_question", newQuestion);

        timeLeft -= 5;
    }, 5000);
});

socket.on("submit_answer", ({ room, answer }) => {
    const currentQuestion = latestQuestions[room];

    // Check if the user has already answered
    if (answeredUsers[room].has(socket.id)) {
        return; // Ignore duplicate submissions
    }
    if (currentQuestion && currentQuestion.answer == answer.value) {
      rooms[room][socket.id].score += 10; // Increase score
    }

    // if (currentQuestion && currentQuestion.answer == answer.value) {
    //     rooms[room][socket.id] += 10; // Increase score for correct answer
    // }

    answeredUsers[room].add(socket.id); // Mark this user as answered
    const updatedScores = Object.entries(rooms[room]).map(([id, info]) => ({
      id,
      name: info.name,
      score: info.score,
    }));
    io.to(room).emit("update_scores", updatedScores);


    // io.to(room).emit("update_scores", rooms[room]); // Broadcast updated scores
});



  // Handle user disconnect

  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const room in rooms) {
  delete rooms[room][socket.id];
  const usersInRoom = Object.entries(rooms[room]).map(([id, info]) => ({
    id,
    name: info.name,
  }));
  io.to(room).emit("room_users", usersInRoom);
}

    // for (const room in rooms) {
    //   delete rooms[room][socket.id];
    //   io.to(room).emit("room_users", Object.keys(rooms[room]));
    // }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
