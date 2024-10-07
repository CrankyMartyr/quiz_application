const express = require("express");
const router = express.Router();

let quizzes = []; // Temporary in-memory storage

// Get all quizzes
router.get("/api/quizzes", (req, res) => {
  res.json(quizzes);
});

// Create a new quiz
router.post("/api/quizzes", (req, res) => {
  const { title, questions } = req.body;
  const newQuiz = {
    id: quizzes.length + 1,
    title,
    questions,
  };
  quizzes.push(newQuiz);
  res.status(201).json(newQuiz);
});

// Edit an existing quiz
router.put("/api/quizzes/:id", (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const { title, questions } = req.body;

  const quizIndex = quizzes.findIndex((quiz) => quiz.id === quizId);
  if (quizIndex !== -1) {
    quizzes[quizIndex].title = title;
    quizzes[quizIndex].questions = questions;
    res.json(quizzes[quizIndex]);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

module.exports = router;
