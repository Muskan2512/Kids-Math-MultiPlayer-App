// controllers/scoreController.js
import Score from "../model/ScoreModel.js"

export const submitScore = async (req, res) => {
  const { userId, game, score } = req.body;

  if (!userId || !game || score === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const existingScore = await Score.findOne({ userId, game });

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.updatedAt = new Date();
        await existingScore.save();
      }
      return res.status(200).json({ message: "Score updated (if higher)" });
    }

    const newScore = new Score({ userId, game, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// controllers/scoreController.js
export const getLeaderboard = async (req, res) => {
  const { game } = req.params;

  try {
    const leaderboard = await Score.find({ game })
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "username"); // Assuming User model has a `username` field

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch leaderboard" });
  }
};
