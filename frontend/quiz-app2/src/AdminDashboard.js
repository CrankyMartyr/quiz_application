import { useEffect, useState } from "react";

const AdminDashboard = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", ""], marks: 1 },
  ]); // Initial question structure
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch the list of quizzes from the backend
    const fetchQuizzes = async () => {
      const response = await fetch("/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    };

    fetchQuizzes();
  }, []);

  // Handle quiz creation
  const handleCreateQuiz = async () => {
    const newQuiz = {
      title: quizTitle,
      questions,
    };

    const response = await fetch("/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuiz),
    });

    if (response.ok) {
      const createdQuiz = await response.json();
      setQuizzes([...quizzes, createdQuiz]);
      setQuizTitle("");
      setQuestions([{ question: "", options: ["", ""], marks: 1 }]); // Reset after creation
    }
  };

  // Handle quiz editing
  const handleEditQuiz = async () => {
    const updatedQuiz = {
      title: quizTitle,
      questions,
    };

    const response = await fetch(`/api/quizzes/${editingQuizId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuiz),
    });

    if (response.ok) {
      const editedQuiz = await response.json();
      setQuizzes(
        quizzes.map((quiz) => (quiz.id === editingQuizId ? editedQuiz : quiz))
      );
      setQuizTitle("");
      setQuestions([{ question: "", options: ["", ""], marks: 1 }]); // Reset after editing
      setIsEditing(false);
      setEditingQuizId(null);
    }
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", ""], marks: 1 }]);
  };

  // Handle question/option input
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle option input
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add new option for a question
  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  // Select a quiz for editing
  const handleSelectQuizForEdit = (quiz) => {
    setEditingQuizId(quiz.id);
    setQuizTitle(quiz.title);
    setQuestions(quiz.questions);
    setIsEditing(true);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={onLogout}>Logout</button>

      <h2>{isEditing ? "Edit Quiz" : "Create Quiz"}</h2>
      <input
        type="text"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        placeholder="Quiz Title"
      />

      <h3>Questions</h3>
      {questions.map((question, qIndex) => (
        <div key={qIndex} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Question Text"
            value={question.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, "question", e.target.value)
            }
            style={{ width: "60%" }}
          />
          <span style={{ marginLeft: "10px" }}>
            Marks:
            <input
              type="number"
              value={question.marks}
              onChange={(e) =>
                handleQuestionChange(qIndex, "marks", e.target.value)
              }
              style={{ width: "50px", marginLeft: "5px" }}
            />
          </span>

          <div style={{ marginTop: "10px" }}>
            <h4>Options</h4>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} style={{ marginBottom: "5px" }}>
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  style={{ width: "50%" }}
                />
              </div>
            ))}
            <button onClick={() => addOption(qIndex)}>Add Option</button>
          </div>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>

      <button onClick={isEditing ? handleEditQuiz : handleCreateQuiz}>
        {isEditing ? "Save Changes" : "Create Quiz"}
      </button>

      <h2>Existing Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title}
            <button onClick={() => handleSelectQuizForEdit(quiz)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
