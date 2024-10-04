import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const sampleQuestions = [
  { question: "What is 2 + 2?", options: ["2", "3", "4"], answer: "4" },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Paris", "Madrid"],
    answer: "Paris",
  },
];

const Quiz = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const history = useNavigate();

  const handleOptionChange = (question, option) => {
    setAnswers({ ...answers, [question]: option });
  };

  const handleSubmit = () => {
    history("/result", { answers });
  };

  return (
    <div>
      <h1>Quiz {id}</h1>
      {sampleQuestions.map((q, index) => (
        <div key={index}>
          <h3>{q.question}</h3>
          {q.options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name={q.question}
                  value={option}
                  onChange={() => handleOptionChange(q.question, option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default Quiz;
