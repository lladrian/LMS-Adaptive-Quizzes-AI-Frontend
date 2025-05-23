import React, { useState } from "react";
import IDE from "./IDE";

const QuizComponent = () => {
  const [code, setCode] = useState("// Write your code here");

  const handleSubmit = () => {
    // Send code to backend/AI for grading
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Programming Quiz</h2>
      <IDE code={code} setCode={setCode} />
      <button onClick={handleSubmit} className="btn mt-4">
        Submit
      </button>
    </div>
  );
};

export default QuizComponent;
