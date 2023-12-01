import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopup from "../assessments/CustomPopup";
import MultipleChoiceQuestion from "../assessments/MultipleChoiceQuestion";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import "../assessments/Questions.css";
import PracticeCertificateTemplate from "./PracticeCertificateTemplate";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
// import ObjectDectection from "./Object";
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
    } else {
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


function LevelOnePractice({assessment_questions}) {
    const { student } = StudentDetailsCustomHook();
    const { subjectcontext } = useContext(Subject_Chapter_Topic)

    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = currentDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    const [questions, setQuestions] = useState(() => {
        const storedQuestions = window.localStorage.getItem("questions");
        return storedQuestions ? JSON.parse(storedQuestions) : assessment_questions;
    });

    const [answers, setAnswers] = useState(() => {
        const storedAnswers = window.localStorage.getItem("answers");
        return storedAnswers ? JSON.parse(storedAnswers) : {};
    });

    const [showWrongAnswers, setShowWrongAnswers] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [isAllAnswered, setIsAllAnswered] = useState(false);
    const [submitClickCount, setSubmitClickCount] = useState(0);

    const clearLocalStorageData = () => {
        localStorage.removeItem("elapsedTime")
        localStorage.removeItem("submitCount")
        localStorage.removeItem("completed")
        localStorage.removeItem("timer")
        localStorage.removeItem("correctlyAnswered")
    }

    const [timer, setTimer] = useState(() => {
        const storedTimer = window.localStorage.getItem("timer");
        if (storedTimer) {
            return JSON.parse(storedTimer);
        }
        return {
            startTime: Date.now(),
            elapsedTime: 0,
            isRunning: true,
        };
    });

    const [showCustomPopup, setShowCustomPopup] = useState(false);

    useEffect(() => {
        const isAllAnswered = questions.every(
            (question) => answers[question.id] !== undefined
        );
        setIsAllAnswered(isAllAnswered);

        if (isAllAnswered && !showCongratulations) {
            // Add a check for showCongratulations
            const isSubmitted = localStorage.getItem("isSubmitted");
            if (isSubmitted === "true") {
                setShowCongratulations(true);
                stopTimer();
            }
        }

        // Save the timer state in local storage
        window.localStorage.setItem("timer", JSON.stringify(timer));
    }, [answers, questions, timer, showCongratulations]); // Include showCongratulations in the dependency array

    useEffect(() => {
        if (timer.isRunning) {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    elapsedTime: prevTimer.elapsedTime + 1,
                }));
            }, 1000);

            return () => {
                clearInterval(timerInterval);
            };
        }
    }, [timer.isRunning]);

    const startTimer = () => {
        setTimer({
            ...timer,
            startTime: Date.now(),
            isRunning: true,
        });
    };

    const stopTimer = () => {
        setTimer({
            ...timer,
            isRunning: false,
        });

        // Save the total time to local storage
        window.localStorage.setItem("totalTime", timer.elapsedTime);
    };

    useEffect(() => {
        if (!timer.isRunning) {
            startTimer(); // Start the timer when the component mounts
        }
    }, []);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: option,
        }));
    };
    const navigate = useNavigate();

    const goBack = () => {
        setShowCustomPopup(true);
    };

    const handleConfirmPopup = () => {
        // Check if each item exists in local storage before removing it
        if (localStorage.getItem("timer")) {
            localStorage.removeItem("timer");
        }
        if (localStorage.getItem("questions")) {
            localStorage.removeItem("questions");
        }
        if (localStorage.getItem("answers")) {
            localStorage.removeItem("answers");
        }
        if (localStorage.getItem("isSubmitted")) {
            localStorage.removeItem("isSubmitted");
        }
        navigate("/takelesson");
    };

    const handleCancelPopup = () => {
        setShowCustomPopup(false);
    };

    const handleSubmit = async () => {
        const wrong = questions.filter(
            (question) => answers[question.id] !== question.correctAnswer
        );

        if (wrong.length === 0) {
            setShowCongratulations(true);
            stopTimer();
            clearLocalStorageData()

        } else {
            setShowWrongAnswers(wrong);
            window.localStorage.setItem("questions", JSON.stringify(wrong));
            window.localStorage.setItem("answers", JSON.stringify(answers));
        }

        setSubmitClickCount(submitClickCount + 1);
    };

    return (
        <div>
            <div className="StickyHeader">
                <div className="BraneLogo">
                    <img src={branelogo} alt="Brane Logo" />
                </div>
                {!showCongratulations && (
                    <div className="Assessment_Header">
                        <div className="GoBackButton" onClick={goBack}>
                            <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                            Go Back
                        </div>
                        <div className="Assessment_Titles">
                            <div className="AssessmentTitle">{subjectcontext?.topic}</div>
                            <div className="LevelTitle">{subjectcontext?.level}</div>
                        </div>
                        <div className="Timer">
                            <div className="TimerIcon">
                                <img src={timericon} alt="timer" />
                            </div>

                            <div className="TimerText">
                                <div className="TimerValue">
                                    {formatTime(timer.elapsedTime)}
                                </div>

                                <div className="TimeElapsed">Time Elapsed</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="AssessmentScreen"
            // style={{
            //   height: showCongratulations ? "90vh" : "82.7vh"
            // }}
            >
                {showCongratulations ? (
                    <>
                        <PracticeCertificateTemplate
                            studentName={student?.student_name}
                            courseName={student?.schooling}
                            chapterName={subjectcontext?.chapter}
                            subjectName={subjectcontext?.subject}
                            topicName={subjectcontext?.topic}
                            completionDate={formattedDate}
                            grade={submitClickCount}
                            mobileno={student?.mobileno}
                            childIndex={student?.childIndex}
                            level={"Level 1"}
                        />
                    </>
                ) : showWrongAnswers ? (
                    <>
                        <div className="QuestionsContainer">
                            <ul>
                                {showWrongAnswers.map((question) => (
                                    <MultipleChoiceQuestion
                                        key={question.id}
                                        question={question.question}
                                        options={question.options}
                                        selectedOption={answers[question.id]}
                                        onOptionChange={(option) =>
                                            handleOptionChange(question.id, option)
                                        }
                                    />
                                ))}
                            </ul>
                            <div className="SubmitButton-2-Div">
                                <button className="SubmitButton-2" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="QuestionsContainer">
                            <ul>
                                {questions.map((question) => (
                                    <MultipleChoiceQuestion
                                        key={question.id}
                                        question={question.question}
                                        options={question.options}
                                        selectedOption={answers[question.id]}
                                        onOptionChange={(option) =>
                                            handleOptionChange(question.id, option)
                                        }
                                    />
                                ))}
                            </ul>
                            <div className="ButtonArea">
                                <button
                                    className="SubmitButton"
                                    onClick={handleSubmit}
                                    disabled={!isAllAnswered}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                    </>
                )}

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

export default LevelOnePractice;
