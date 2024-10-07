const express = require("express");
const {
  addQuiz,
  editQuiz,
  getQuizzes,
  getQuiz,
} = require("../controllers/quizController");
const router = express.Router();

// Add a quiz (Admin only)
router.post("/quizzes", addQuiz);

// Edit a quiz (Admin only)
router.put("/quizzes/:id", editQuiz);

// Get all quizzes (Admin and Quiz taker)
router.get("/quizzes", getQuizzes);

// Get a specific quiz by ID (Admin and Quiz taker)
router.get("/quizzes/:id", getQuiz);

module.exports = router;
