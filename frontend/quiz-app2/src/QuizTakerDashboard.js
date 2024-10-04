import { useEffect, useState } from "react";

const QuizTakerDashboard = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch the list of quizzes for the quiz taker
    const fetchQuizzes = async () => {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h1>Quiz Taker Dashboard</h1>
      <button onClick={onLogout}>Logout</button>

      <h2>Available Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title} <button>Take Quiz</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizTakerDashboard;
