const express = require("express");
const {
  storeQuizAttempt,
  getQuizAttempts,
} = require("../controllers/attemptController");
const router = express.Router();

// Store a quiz attempt (Quiz taker only)
router.post("/quizzes/attempt", storeQuizAttempt);

// View all quiz attempts (Admin only)
router.get("/quizzes/attempts", getQuizAttempts);

module.exports = router;
