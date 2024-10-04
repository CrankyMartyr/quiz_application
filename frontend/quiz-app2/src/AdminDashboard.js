import { useEffect, useState } from "react";

const AdminDashboard = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState("");

  useEffect(() => {
    // Fetch the list of quizzes from the backend
    const fetchQuizzes = async () => {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    if (newQuiz.trim() !== "") {
      // Send request to add a new quiz
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newQuiz }),
      });

      if (response.ok) {
        const addedQuiz = await response.json();
        setQuizzes([...quizzes, addedQuiz]);
        setNewQuiz("");
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const response = await fetch(
      `http://localhost:5000/api/quizzes/${quizId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={onLogout}>Logout</button>

      <h2>Manage Quizzes</h2>
      <input
        type="text"
        value={newQuiz}
        onChange={(e) => setNewQuiz(e.target.value)}
        placeholder="New Quiz Title"
      />
      <button onClick={handleAddQuiz}>Add Quiz</button>

      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title}{" "}
            <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
