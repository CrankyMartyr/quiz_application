const db = require("../firebaseConfig.js");

// Store a quiz attempt (Quiz taker only)
const storeQuizAttempt = async (req, res) => {
  const { quizId, userId, answers } = req.body;

  try {
    const newAttemptRef = db.ref("quizAttempts").push();
    await newAttemptRef.set({
      quizId,
      userId,
      answers,
      attemptedAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Quiz attempt stored successfully",
      attemptId: newAttemptRef.key,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error storing quiz attempt", error: error.message });
  }
};

// Get all quiz attempts (Admin only)
const getQuizAttempts = async (req, res) => {
  try {
    const attemptsRef = db.ref("quizAttempts");
    attemptsRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        const attempts = snapshot.val();
        res.status(200).json(attempts);
      } else {
        res.status(404).json({ message: "No quiz attempts found" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving quiz attempts",
      error: error.message,
    });
  }
};

module.exports = { storeQuizAttempt, getQuizAttempts };
