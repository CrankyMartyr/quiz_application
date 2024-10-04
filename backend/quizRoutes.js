const { db } = require("./firebaseConfig");
const express = require("express");
const { authenticateUser, checkAdminRole } = require("./auth");
const router = express.Router();

// Get all quizzes
router.get("/quizzes", authenticateUser, async (req, res) => {
  try {
    const quizzes = [];
    const snapshot = await db.collection("quizzes").get();
    snapshot.forEach((doc) => quizzes({ id: doc.id, ...doc.data() }));
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create new quiz
router.post("/quizzes", authenticateUser, checkAdminRole, async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newQuiz = await db.collection("quizzes").add({
      title,
      questions,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ message: "Quiz created", quizId: newQuiz.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update quiz
router.put(
  "/quizzes/:id",
  authenticateUser,
  checkAdminRole,
  async (req, res) => {
    const quizId = req.params.id;
    const updatedData = req.body;

    try {
      await db.collection("quizzes").doc(quizId).update(updatedData);
      res.status(200).json({ message: "Quiz updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Admin: Delete quiz
router.delete(
  "/quizzes/:id",
  authenticateUser,
  checkAdminRole,
  async (req, res) => {
    const quizId = req.params.id;

    try {
      await db.collection("quizzes").doc(quizId).delete();
      res.status(200).json({ message: "Quiz deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Take quiz: Submit answers and calculate score
router.post("/take-quiz/:id", authenticateUser, async (req, res) => {
  const quizId = req.params.id;
  const { answers } = req.body;

  try {
    const quiz = await db.collection("quizzes").doc(quizId).get();
    if (!quiz.exists) return res.status(404).json({ error: "Quiz not found" });

    const quizData = quiz.data();
    let score = 0;

    quizData.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) score++;
    });

    const userScore = {
      quizId,
      score,
      totalQuestions: quizData.questions.length,
      takenAt: new Date().toISOString(),
    };

    await db
      .collection("userScores")
      .doc(req.user.uid)
      .collection("scores")
      .add(userScore);

    res.status(200).json({ message: "Quiz submitted", score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user scores
router.get("/user-scores", authenticateUser, async (req, res) => {
  try {
    const scores = [];
    const snapshot = await db
      .collection("userScores")
      .doc(req.user.uid)
      .collection("scores")
      .get();
    snapshot.forEach((doc) => scores(doc.data()));
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all user scores
router.get(
  "/admin/user-scores",
  authenticateUser,
  checkAdminRole,
  async (req, res) => {
    try {
      const users = [];
      const snapshot = await db.collection("userScores").get();
      snapshot.forEach((doc) => users({ userId: doc.id, scores: doc.data() }));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
