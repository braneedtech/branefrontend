import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomPopup from "./CustomPopup";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import "./Questions.css";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import { end_point } from "../../../constants/urls";
import CertificateTemplate from "./CertificateTemplate";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import axios from "axios";


const getGrade = (grade) => {

  if (grade === 1) {
    return "A";
  } else if (grade === 2) {
    return "B"
  }
  else if (grade === 3) {
    return "C"
  } else if (grade > 3) {
    return "D"
  } else if (grade === 0) {
    return "A"
  }

  else {
    return ""
  }
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`);
  }

  return parts.join(' ');
}

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
                className="purple-checkbox"
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

function Level4({ assessment_questions }) {

  const QUESTIONS = assessment_questions
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [correctlyAnswered, setCorrectlyAnswered] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertQuestionId, setAlertQuestionId] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    const storedAnswers = window.localStorage.getItem("answers");
    const storedSubmitCount = window.localStorage.getItem("submitCount");
    const storedElapsedTime = window.localStorage.getItem("elapsedTime");
    const storedCorrectlyAnswered = window.localStorage.getItem("correctlyAnswered");
    const storedCompleted = window.localStorage.getItem("completed");

    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    if (storedSubmitCount) setSubmitCount(JSON.parse(storedSubmitCount));
    if (storedElapsedTime) setElapsedTime(JSON.parse(storedElapsedTime));
    if (storedCorrectlyAnswered) setCorrectlyAnswered(JSON.parse(storedCorrectlyAnswered));
    if (storedCompleted) setCompleted(JSON.parse(storedCompleted));
  }, []);

  const handleAnswerChange = (questionId, option, isChecked) => {
    const updatedAnswers = { ...answers };
    if (!updatedAnswers[questionId]) updatedAnswers[questionId] = [];

    if (isChecked) {
      if (option === "None of the Options are correct") {
        updatedAnswers[questionId] = [option];
      } else {
        updatedAnswers[questionId] = updatedAnswers[questionId].filter(ans => ans !== "None of the Options are correct");
        if (updatedAnswers[questionId].length < 4) {
          updatedAnswers[questionId].push(option);
        }
      }
    } else {
      updatedAnswers[questionId] = updatedAnswers[questionId].filter((ans) => ans !== option);
    }
    setAnswers(updatedAnswers);
  };

  const navigate = useNavigate();
  const { student } = StudentDetailsCustomHook()
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const [showCustomPopup, setShowCustomPopup] = useState(false);

  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  const clearLocalStorageData = () => {
    localStorage.removeItem("answers")
    localStorage.removeItem("completed")
    localStorage.removeItem("correctlyAnswered")
    localStorage.removeItem("elapsedTime")
    localStorage.removeItem("submitCount")
  }

  const goBack = () => {
    setShowCustomPopup(true);
  };

  const handleConfirmPopup = () => {
    // Clear local storage and navigate back
    window.localStorage.removeItem("answers");
    window.localStorage.removeItem("submitCount");
    window.localStorage.removeItem("elapsedTime");
    window.localStorage.removeItem("correctlyAnswered");
    window.localStorage.removeItem("completed");
    navigate("/takelesson");
  };

  const handleCancelPopup = () => {
    setShowCustomPopup(false);
  };


  const handleSubmit = async () => {
    let newScore = 0;
    let newCorrectlyAnswered = [...correctlyAnswered];

    QUESTIONS.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correctAnswers;

      if (userAnswers.includes("None of the Options are correct") && correctAnswers.length === 0) {
        newScore += 1;
        newCorrectlyAnswered.push(question.id);
      } else if (
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((answer) => correctAnswers.includes(answer))
      ) {
        newScore += 1;
        newCorrectlyAnswered.push(question.id);
      }
    });
    if (newScore === QUESTIONS.length) {
      try {
        // Perform the API call to send data to the server
        const response = await axios.post(`${end_point}/assessment-submit`, {
          "mobileno": student?.mobileno,
          "childIndex": student?.childIndex,
          "name": student?.student_name,
          "schooling": student?.schooling,
          "moi": student?.medium_of_instruction,
          "academy": "Academics",
          "subject": subjectcontext?.subject,
          "level": "Level4",
          "chapter": subjectcontext?.chapter,
          "topic": subjectcontext?.topic,
          "iterations": submitCount+1,
          "grade": getGrade(submitCount+1),
          "time": formatDuration(localStorage.getItem("elapsedTime"))
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response && response.data) {
          if (response.data?.success) {
            setCompleted(true);
            clearLocalStorageData();
          }
        }
      } catch (error) {
        // Handle errors from the API call
        console.error('API Error:', error.message);
      }
      // Stop the timer
    } else {
      // Handle incorrect answers logic if needed
    }
    setScore(newScore);
    setCorrectlyAnswered(newCorrectlyAnswered);
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (!completed) {
      const timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [completed]);

  useEffect(() => {
    window.localStorage.setItem("answers", JSON.stringify(answers));
    window.localStorage.setItem("submitCount", JSON.stringify(submitCount));
    window.localStorage.setItem("elapsedTime", JSON.stringify(elapsedTime));
    window.localStorage.setItem("correctlyAnswered", JSON.stringify(correctlyAnswered));
    window.localStorage.setItem("completed", JSON.stringify(completed));
  }, [answers, submitCount, elapsedTime, correctlyAnswered, completed]);

  const allQuestionsAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div>
      <div className="StickyHeader">
        <div className="BraneLogo">
          <img src={branelogo} alt="Brane Logo" />
        </div>
        {
          !completed && (
            <div className="Assessment_Header">
              <div className="GoBackButton" onClick={goBack}>
                <div>
                  <div>
                    <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                    Go Back
                  </div>
                </div>
              </div>
              <div className="Assessment_Titles">
                <div className="AssessmentTitle">{subjectcontext?.topic}</div>
                <div className="LevelTitle">Level 4</div>
              </div>
              <div className="Timer">
                <div className="TimerIcon">
                  <img src={timericon} alt="timer" />
                </div>
                <div className="TimerText">
                  <div className="TimerValue">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="TimeElapsed">Time Elapsed</div>
                </div>
              </div>
            </div>
          )
        }
      </div>

      <div className="AssessmentScreen">
        {
          !completed && (
            <>
              {showAlert && <div className="alert">You can select only 2 options.</div>}
              <div className="QuestionsContainer">
                {QUESTIONS.map(
                  (question) =>
                    !correctlyAnswered.includes(question.id) && (
                      <QuizQuestion
                        key={question.id}
                        question={question}
                        selectedAnswers={answers[question.id] || []}
                        onAnswerChange={handleAnswerChange}
                        showAlert={alertQuestionId === question.id}
                      />
                    )
                )}
                <div className="ButtonArea">
                  <button onClick={handleSubmit} disabled={!allQuestionsAnswered} className="SubmitButton">
                    Submit
                  </button>
                </div>
              </div>
            </>
          )
        }

        {completed &&
          (
            <CertificateTemplate
              studentName={student?.student_name}
              courseName={student?.schooling}
              chapterName={subjectcontext?.chapter}
              subjectName={subjectcontext?.subject}
              topicName={subjectcontext?.topic}
              completionDate={formattedDate}
              grade={submitCount}
              mobileno={student?.mobileno}
              childIndex={student?.childIndex}
              level={"Level 4"}
            />)
        }
      </div>

      {showCustomPopup && (
        <CustomPopup
          message="Are you sure you want to leave the assessment session?"
          confirmText="Yes, leave"
          cancelText="No, stay"
          onConfirm={handleConfirmPopup}
          onCancel={handleCancelPopup}
        />
      )}
    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${padZero(minutes)}:${padZero(remainingSeconds)} Secs`;
  } else if (minutes === 1) {
    return `${padZero(minutes)}:${padZero(remainingSeconds)} Min`;
  } else {
    return `${padZero(minutes)}:${padZero(remainingSeconds)} Mins`;
  }
}

function padZero(value) {
  return value.toString().padStart(2, "0");
}

export default Level4;