import React, { useState, useEffect, useContext } from "react";
import shuffle from "../assessments/Level3shuffle";
import { useNavigate, Link } from "react-router-dom";
import CustomPopup from "../assessments/CustomPopup";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import "../assessments/Level3Styling.css";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import PracticeCertificateTemplate from "./PracticeCertificateTemplate";


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


const clearLocalStorageData = () => {
  localStorage.removeItem("attempts")
  localStorage.removeItem("elapsedTime")
  localStorage.removeItem("totalSubmissions")
  localStorage.removeItem("results")
  localStorage.removeItem("userSequences")
  localStorage.removeItem("totalSubmissions")
  localStorage.removeItem("correctlyAnswered")
  localStorage.removeItem("completed")
  localStorage.removeItem("submitCount")
}


const Question = ({ question, correctSequence, userSequence, onUserSequenceChange, isDisabled, isQuizSubmitted }) => {
  const [localUserSequence, setLocalUserSequence] = useState(userSequence);
  const [dragSrc, setDragSrc] = useState(null);

  useEffect(() => {
    setLocalUserSequence(userSequence);
  }, [userSequence]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
    setDragSrc(index);
    e.target.style.opacity = '.4';
  };

  const handleDragEnter = (e) => {
    e.target.classList.add('over');
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove('over');
  };

  const handleDrop = (e, index) => {
    e.stopPropagation();
    e.target.classList.remove('over'); // Remove the 'over' class after dropping
    const draggedIndex = parseInt(e.dataTransfer.getData('index'));
    if (draggedIndex !== index) {
      const newUserSequence = [...localUserSequence];
      newUserSequence.splice(index, 0, newUserSequence.splice(draggedIndex, 1)[0]);
      setLocalUserSequence(newUserSequence);

      // Update global state after change in local sequence
      const sequenceIsCorrect = JSON.stringify(newUserSequence) === JSON.stringify(correctSequence);
      onUserSequenceChange(newUserSequence, sequenceIsCorrect);
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const handleDragEnd = (e) => {
    e.target.classList.remove('over');
    e.target.style.opacity = '1';
    setDragSrc(null);
  };

  const isCorrect = JSON.stringify(localUserSequence) === JSON.stringify(correctSequence);

  return (
    <div className="Questions">
      <h2>{question}</h2>
      <hr className="question-divider" />
      <ul style={{ listStyle: "none" }}>
        {correctSequence.map((answer, index) => (
          <li
            key={index}
            draggable={!isDisabled}
            style={{ viewTransitionName: `card-${index + 1}` }}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
          // className={localUserSequence[index] === answer}
          >
            {localUserSequence[index]}
          </li>

        ))}
      </ul>
    </div>
  );
};

const LevelThreePractice = ({ assessment_questions }) => {
  const questions = assessment_questions
  const { student } = StudentDetailsCustomHook();
  const navigate = useNavigate()
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const initialUserSequences = questions.map((question) => shuffle([...question.correctSequence]));
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [userSequences, setUserSequences] = useState(() => {
    const storedSequences = window.localStorage.getItem("userSequences");
    return storedSequences ? JSON.parse(storedSequences) : initialUserSequences;
  });

  const [results, setResults] = useState(() => {
    const storedResults = window.localStorage.getItem("results");
    return storedResults ? JSON.parse(storedResults) : Array(questions.length).fill(null);
  });

  const [attempts, setAttempts] = useState(() => {
    const storedAttempts = window.localStorage.getItem("attempts");
    return storedAttempts ? JSON.parse(storedAttempts) : Array(questions.length).fill(0);
  });

  const [elapsedTime, setElapsedTime] = useState(() => {
    const storedTime = window.localStorage.getItem("elapsedTime");
    return storedTime ? JSON.parse(storedTime) : 0;
  });

  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("userSequences", JSON.stringify(userSequences));
    window.localStorage.setItem("results", JSON.stringify(results));
    window.localStorage.setItem("attempts", JSON.stringify(attempts));
    window.localStorage.setItem("elapsedTime", JSON.stringify(elapsedTime));
  }, [userSequences, results, attempts, elapsedTime]);

  useEffect(() => {
    if (!isQuizSubmitted) {
      const timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [isQuizSubmitted]);

  const handleUserSequenceChange = (index, newUserSequence) => {
    const newUserSequences = [...userSequences];
    newUserSequences[index] = newUserSequence;
    setUserSequences(newUserSequences);
  };

  const [totalSubmissions, setTotalSubmissions] = useState(() => {
    const storedSubmissions = window.localStorage.getItem("totalSubmissions");
    return storedSubmissions ? JSON.parse(storedSubmissions) : 0;
  });

  useEffect(() => {
    window.localStorage.setItem("totalSubmissions", JSON.stringify(totalSubmissions));
  }, [totalSubmissions]);

  const handleSubmitAll = async () => {
    let allCorrect = true;
    const newAttempts = [...attempts];
    const newResults = [...results];

    questions.forEach((question, index) => {
      const isCorrect = JSON.stringify(userSequences[index]) === JSON.stringify(question.correctSequence);
      if (!isCorrect) {
        newAttempts[index] += 1;
      } else if (results[index] === null) {
        newResults[index] = true;
      }
      if (!isCorrect) allCorrect = false;
    });

    setAttempts(newAttempts);
    setResults(newResults);

    if (allCorrect) {
        setIsQuizSubmitted(true);
        clearLocalStorageData()
    }

    setTotalSubmissions(prev => prev + 1);
  };

  const goBack = () => {
    setShowCustomPopup(true);
  };
  const handleConfirmPopup = () => {

    if (localStorage.getItem("userSequences")) {
      localStorage.removeItem("userSequences");
    }
    if (localStorage.getItem("results")) {
      localStorage.removeItem("results");
    }
    if (localStorage.getItem("totalSubmissions")) {
      localStorage.removeItem("totalSubmissions");
    }
    if (localStorage.getItem("elapsedTime")) {
      localStorage.removeItem("elapsedTime");
    }
    if (localStorage.getItem("attempts")) {
      localStorage.removeItem("attempts");
    }
    navigate("/practice-test");
  };

  const handleCancelPopup = () => {
    setShowCustomPopup(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  

  return (
    <div>
      <div className="StickyHeader">
        <div className="BraneLogo">
          <img src={branelogo} alt="Brane Logo" />
        </div>
        {
          !isQuizSubmitted && (
            <div className="Assessment_Header">
              <div className="GoBackButton" onClick={goBack}>
                    <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                    Go Back
              </div>
              <div className="Assessment_Titles">
                <div className="AssessmentTitle">{subjectcontext?.topic}</div>
                <div className="LevelTitle">Level 3</div>
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
          !isQuizSubmitted ? (
            <div className="QuestionsContainer">
              {questions.map((question, index) => (
                results[index] === null && (
                  <Question
                    key={index}
                    question={question.question}
                    correctSequence={question.correctSequence}
                    userSequence={userSequences[index]}
                    onUserSequenceChange={(newUserSequence) =>
                      handleUserSequenceChange(index, newUserSequence)
                    }
                    isDisabled={isQuizSubmitted}
                    isQuizSubmitted={isQuizSubmitted}
                  />
                )
              ))}
              <div className="ButtonArea">
                <button onClick={handleSubmitAll} className="SubmitButton">
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <PracticeCertificateTemplate
              studentName={student?.student_name}
              courseName={student?.schooling}
              chapterName={subjectcontext?.chapter}
              subjectName={subjectcontext?.subject}
              topicName={subjectcontext?.topic}
              completionDate={formattedDate}
              grade={totalSubmissions}
              mobileno={student?.mobileno}
              childIndex={student?.childIndex}
              level={"Level 3"}
            />
          )
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
};

export default LevelThreePractice;