// // src/QuizQuestion.js
// import React from 'react';

// function QuizQuestion({ question, selectedAnswers, onAnswerChange, showAlert }) {
//   return (
//     <div className='Questions'>
//       <h2>{question.text}</h2>
//       <hr className="question-divider" />
//       {showAlert && <div className="alert">You can select only 2 options.</div>}
//       {question.options.map((option, index) => (
//         <label key={index}>
//           <input
//             type="checkbox"
//             value={option}
//             checked={selectedAnswers.includes(option)}
//             onChange={(e) => onAnswerChange(question.id, option, e.target.checked)}
//           />
//           {option}
//         </label>
//       ))}
//     </div>
//   );
// }

// export default QuizQuestion;




import React from 'react';

function QuizQuestion({ question, selectedAnswers, onAnswerChange, showAlert }) {
  return (
    <div className="Questions">
      <h2>{question.text}</h2>
      <hr className="question-divider" />
      <ul style={{ listStyle: "none" }}>
      {showAlert && <div className="alert">You can select only 2 options.</div>}
        {question.options.map((option, index) => (
          <li key={index} className={selectedAnswers.includes(option) ? "selected-list-item" : ""}>
            <label>
              <input
                type="checkbox"
                className="purple-checkbox" // Assuming you have similar styling for checkboxes
                value={option}
                checked={selectedAnswers.includes(option)}
                onChange={(e) => onAnswerChange(question.id, option, e.target.checked)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizQuestion;
