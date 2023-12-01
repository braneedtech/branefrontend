import React, { useState, useContext } from 'react';
import axios from 'axios';
import StudentDetailsCustomHook from '../../context-api/StudentDetailsCustomHook';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import { end_point } from '../../../constants/urls';
import { useNavigate } from 'react-router-dom';

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hr' : 'hrs'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'min' : 'mins'}`);
  }

  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'sec' : 'secs'}`);
  }

  return parts.join(' ');
}

const Questions = ({ questions }) => {
  const navigate = useNavigate()
  const { student } = StudentDetailsCustomHook();
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onOptionChange = (questionIndex, optionIndex, value) => {
    // Update the selectedOptions state based on the question and option index
    const updatedOptions = [...selectedOptions];
    updatedOptions[questionIndex] = { optionIndex, value };
    setSelectedOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    // Sample correct answers (replace with actual correct answers)
    const correctAnswers = questions.map((q, questionIndex) => ({
      questionIndex,
      correctOption: q.correct_option,
    }));

    // Counters for correct, incorrect, and total questions
    let correctCount = 0;
    let incorrectCount = 0;

    // Compare selected options with correct answers
    correctAnswers.forEach((correctAnswer) => {
      const selectedOption = selectedOptions[correctAnswer.questionIndex];
      if (selectedOption && selectedOption.value === correctAnswer.correctOption) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    // Calculate the percentage score
    const totalQuestions = correctAnswers.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    // // Print the results
    // console.log('Correct Answers:', correctCount);
    // console.log('Incorrect Answers:', incorrectCount);
    // console.log('Score Percentage:', scorePercentage.toFixed(2) + '%');
    // console.log(`Total Score: ${correctCount}/${totalQuestions}`);

    // Update state to indicate submission
    try {
      // Perform the API call to send data to the server
      const response = await axios.post(`${end_point}/store-results`, {
        "mobileno": student?.mobileno,
        "childIndex": student?.childIndex,
        "name": student?.student_name,
        "schooling": student?.schooling,
        "moi": student?.medium_of_instruction,
        "specialskill": "Special Skills",
        "skillname": subjectcontext?.specialskill,
        "level": subjectcontext?.level,
        "corrected": correctCount,
        "wrong": incorrectCount,
        "time": formatDuration(localStorage.getItem("elapsedTime")),
        "percentage": scorePercentage.toFixed(2)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response) {
        if (response && response?.data.success) {
          localStorage.removeItem("elapsedTime")
          setIsSubmitted(true);

        }
      }
      // Handle the response from the server (if needed)
    } catch (error) {
      // Handle errors from the API call
      console.error('API Error:', error.message);
    }
    navigate("/display-level-results")
  };

  const renderQuestions = () => {
    return questions.map((q, questionIndex) => (
      <div key={questionIndex} className="Questions">
        <h2>{q.question}</h2>
        <hr className="question-divider" />
        <ul style={{ listStyle: "none" }}>
          {q.options.map((option, optionIndex) => (
            <li key={optionIndex}>
              <label>
                <input
                  type="radio"
                  className="purple-radio"
                  value={option}
                  checked={
                    selectedOptions[questionIndex] &&
                    selectedOptions[questionIndex].value === option
                  }
                  onChange={() => onOptionChange(questionIndex, optionIndex, option)}
                  disabled={isSubmitted} // Disable radio buttons after submission
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="QuestionsContainer">
      {renderQuestions()}
      <div style={{ textAlign: 'right' }}>
        <button
          style={{
            backgroundColor: "#7C7BE2",
            padding: "0.5rem 2rem",
            borderRadius: "1rem",
            color: "white",
            border: "none"
          }}
          onClick={handleSubmit}
          disabled={isSubmitted} // Disable submit button after submission
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Questions;
