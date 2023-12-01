import React, { useState, useEffect, useContext } from "react";
import QuizQuestion from "../assessments/Level2Ques";
import { useNavigate } from "react-router-dom";
import CustomPopup from "../assessments/CustomPopup";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import PracticeCertificateTemplate from "./PracticeCertificateTemplate";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";

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

function LevelTwoPractice({assessment_questions}) {
  const QUESTIONS = assessment_questions;
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const { student } = StudentDetailsCustomHook();
  const navigate = useNavigate()


  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertQuestionId, setAlertQuestionId] = useState(null);

  const clearLocalStorageData = () => {
    localStorage.removeItem("elapsedTime")
    localStorage.removeItem("submitCount")
    localStorage.removeItem("completed")
    localStorage.removeItem("answers")
    localStorage.removeItem("correctlyAnswered")
  }

  const [answers, setAnswers] = useState(() => {
    const storedAnswers = window.localStorage.getItem("answers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [correctlyAnswered, setCorrectlyAnswered] = useState(() => {
    const storedCorrectlyAnswered = window.localStorage.getItem(
      "correctlyAnswered"
    );
    return storedCorrectlyAnswered
      ? JSON.parse(storedCorrectlyAnswered)
      : [];
  });

  const [completed, setCompleted] = useState(() => {
    const storedCompleted = window.localStorage.getItem("completed");
    return storedCompleted ? JSON.parse(storedCompleted) : false;
  });

  const [submitCount, setSubmitCount] = useState(() => {
    const storedSubmitCount = window.localStorage.getItem("submitCount");
    return storedSubmitCount ? JSON.parse(storedSubmitCount) : 0;
  });

  const [score, setScore] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(() => {
    const storedTime = window.localStorage.getItem("elapsedTime");
    return storedTime ? JSON.parse(storedTime) : 0;
  });

  const handleAnswerChange = (questionId, option, isChecked) => {
    const updatedAnswers = { ...answers };
    if (!updatedAnswers[questionId]) updatedAnswers[questionId] = [];

    if (isChecked) {
      if (updatedAnswers[questionId].length < 2) {
        updatedAnswers[questionId].push(option);
      } else {
        setAlertQuestionId(questionId);
        setTimeout(() => setAlertQuestionId(null), 2000); // Hide the alert after 2 seconds
      }
    } else {
      updatedAnswers[questionId] = updatedAnswers[questionId].filter(
        (ans) => ans !== option
      );
    }
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    let newScore = 0;
    let newCorrectlyAnswered = [...correctlyAnswered];
    let wrongAnswers = [];

    QUESTIONS.forEach((question) => {
      if (
        JSON.stringify(question.correctAnswers.sort()) ===
        JSON.stringify(answers[question.id]?.sort())
      ) {
        newScore++;
        if (!newCorrectlyAnswered.includes(question.id)) {
          newCorrectlyAnswered.push(question.id);
        }
      } else {
        wrongAnswers.push(question);
      }
    });


    if (newScore === QUESTIONS.length) {
        setShowCertificate(true); // Display the certificate
        setCompleted(true);
        clearLocalStorageData();

    } else {
    }
    if(completed){
      clearLocalStorageData()
    }

    setScore(newScore);
    setCorrectlyAnswered(newCorrectlyAnswered);
    setSubmitCount((prevCount) => prevCount + 1);
  };

  const goBack = () => {
    setShowCustomPopup(true);
  };

  const handleConfirmPopup = () => {
    // Clear local storage and navigate to the desired route
    localStorage.clear();
    navigate("/takelesson");
  };

  const handleCancelPopup = () => {
    setShowCustomPopup(false);
  };

  useEffect(() => {
    window.localStorage.setItem("answers", JSON.stringify(answers));
    window.localStorage.setItem("submitCount", JSON.stringify(submitCount));
    window.localStorage.setItem("elapsedTime", JSON.stringify(elapsedTime));
    window.localStorage.setItem(
      "correctlyAnswered",
      JSON.stringify(correctlyAnswered)
    );
    window.localStorage.setItem("completed", JSON.stringify(completed));
  }, [answers, submitCount, elapsedTime, correctlyAnswered, completed]);

  useEffect(() => {
    if (!completed) {
      const timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          window.localStorage.setItem(
            "elapsedTime",
            JSON.stringify(newTime)
          );
          return newTime;
        });
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [completed]);

  const allQuestionsAnswered =
    Object.keys(answers).length === QUESTIONS.length;

  return (
    <div>
      <div className="StickyHeader">
        <div className="BraneLogo">
          <img src={branelogo} alt="Brane Logo" />
        </div>
        {
          !showCertificate && (
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
                <div className="LevelTitle">Level 2</div>
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
        {!showCertificate && (
          <>
            {showAlert && (
              <div className="alert">You can select only 2 options.</div>
            )}
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
                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                  className="SubmitButton"
                >
                  Submit
                </button>
              </div>
            </div>

          </>
        )}

        {showCertificate && (
          <PracticeCertificateTemplate
            studentName={student?.student_name}
            courseName={student?.schooling}
            chapterName={subjectcontext?.chapter}
            subjectName={subjectcontext?.subject}
            topicName={subjectcontext?.topic}
            completionDate={formattedDate}
            grade={submitCount}
            mobileno={student?.mobileno}
            childIndex={student?.childIndex}
            level={"Level 2"}
          />
        )}
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

// Rest of the code (formatTime, padZero, export default Level2)...


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

export default LevelTwoPractice;
