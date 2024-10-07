import { useEffect, useState } from "react";

const QuizTakerDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Fetch the list of quizzes from the backend
    const fetchQuizzes = async () => {
      const response = await fetch("/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  const handleAnswerChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  return (
    <div>
      <h1>Quiz Taker Dashboard</h1>
      <h2>Select a Quiz</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <button onClick={() => setSelectedQuiz(quiz)}>{quiz.title}</button>
          </li>
        ))}
      </ul>

      {selectedQuiz && (
        <div>
          <h2>{selectedQuiz.title}</h2>
          {selectedQuiz.questions.map((question, qIndex) => (
            <div key={qIndex} style={{ marginBottom: "20px" }}>
              <p>{question.question}</p>
              {question.options.map((option, oIndex) => (
                <div key={oIndex}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option}
                      onChange={() => handleAnswerChange(qIndex, option)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizTakerDashboard;
