const db = require("../firebaseConfig");

// Add a quiz (Admin only)
const addQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const newQuizRef = db.ref("quizzes").push(); // Create a new quiz entry
    await newQuizRef.set({
      title,
      questions,
      createdAt: new Date().toISOString(),
    });

    res
      .status(201)
      .json({ message: "Quiz added successfully", quizId: newQuizRef.key });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding quiz", error: error.message });
  }
};

// Edit a quiz (Admin only)
const editQuiz = async (req, res) => {
  const quizId = req.params.id;
  const { title, questions } = req.body;

  try {
    const quizRef = db.ref(`quizzes/${quizId}`);
    await quizRef.update({
      title,
      questions,
    });

    res.status(200).json({ message: "Quiz updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quiz", error: error.message });
  }
};

// Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzesRef = db.ref("quizzes");
    quizzesRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        const quizzes = snapshot.val();
        res.status(200).json(quizzes);
      } else {
        res.status(404).json({ message: "No quizzes found" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving quizzes", error: error.message });
  }
};

// Get a specific quiz by ID
const getQuiz = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quizRef = db.ref(`quizzes/${quizId}`);
    quizRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        res.status(200).json(snapshot.val());
      } else {
        res.status(404).json({ message: "Quiz not found" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving quiz", error: error.message });
  }
};

module.exports = { addQuiz, editQuiz, getQuizzes, getQuiz };
