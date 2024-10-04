import React from "react";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const { answers } = location.state || { answers: {} };

  return (
    <div>
      <h1>Quiz Results</h1>
      <ul>
        {Object.entries(answers).map(([question, answer], index) => (
          <li key={index}>
            {question}: Your answer was {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultPage;
