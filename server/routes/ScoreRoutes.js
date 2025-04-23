const express = require('express');
const { submitScore, getLeaderboard } = require('../controllers/ScoreController'); // Import score controller functions

const router = express.Router();

router.post("/submit", submitScore);
router.get("/leaderboard/:game", getLeaderboard);

module.exports = router; 
