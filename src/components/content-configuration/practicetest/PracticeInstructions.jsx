import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopup from "../assessments/CustomPopup";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import { Link } from "react-router-dom";

import SpeakerOn from "../../../assets/SpeakerOn.gif"
import SpeakerOff from "../../../assets/SpeakerOff.png"

import LevelOnePractice from "./LevelOnePractice";
import LevelTwoPractice from "./LevelTwoPractice";
import LevelThreePractice from "./LevelThreePractice";
import LevelFourPractice from "./LevelFourPractice";

const instructions = [
  "MCQ's based test with no negative marking.",
  "Do not press any buttons on your keyboard.",
  "Do not try to copy questions and search for answers on the Internet.",
  "Do not take screenshots.",
  "Do not ask someone else to pass your test for you. Patterns will be captured If you break these rules, THE TEST WILL BE ABORTED.",
  "Before you click on the take test button , please make sure you have the below:\n\u00a0\u00a0\u00a0\u00a0A. Good internet connectivity\n\u00a0\u00a0\u00a0\u00a0B. Lock yourself into a room to avoid distractions."

]

const level1_assessment_questions = [
  {
    id: "mathsp1",
    question: "1. Perform the following operation : 5+√16",
    correctAnswer: "9",
    options: ["11", "9", "8", "7"]
  },
  {
    id: "mathsp2",
    question: "2. Find the decimal representation of the following fraction : 1/2",
    correctAnswer: "0.5",
    options: ["0.5", "0.1", "0.2", "0.3"]
  },
  {
    id: "mathsp3",
    question: "3. Identify the irrational number.",
    correctAnswer: "pi",
    options: ["0.1", "0.4", ".7", "pi"]
  }
]

const level2_assessment_questions = [
  {
    id: "mathsl2p1",
    text: "1. Identify the positive numbers.",
    correctAnswers: ["5", "4"],
    options: ["-3", "5", "-7", "4"]
  },
  {
    id: "mathsl2p2",
    text: "2. Identify the prime numbers.",
    correctAnswers: ["7", "11"],
    options: ["7", "8", "11", "4"]
  },
  {
    id: "mathsl2p3",
    text: "3.Identify the odd numbers",
    correctAnswers: ["11", "15"],
    options: ["11", "16", "15", "10"]
  }
]

const level3_assessment_questions = [
  {
    question: "1. Arrange the following numbers in Ascending Order.",
    correctSequence: ["1", "2", "4", "5"]
  },
  {
    question: "2. Arrange the following numbers in Descending Order.",
    correctSequence: ["7", "5", "2", "1"]
  },
  {
    question: "3. Arrange the vowels in order.",
    correctSequence: ["a", "e", "i", "o", "u"]
  }
]

const level4_assessment_questions = [
  {
    id: "mathsl4p1",
    text: "1. Select all the integers from the given set:",
    correctAnswers: ["0", "-1"],
    options: ["-3.5", "0", "2/1", "-1"]
  },
  {
    id: "mathsl4p2",
    text: "2. Choose all the prime numbers from the list:",
    correctAnswers: ["7", "11", "13"],
    options: ["7", "4", "11", "13"]
  },
  {
    id: "mathsl4p3",
    text: "3. Choose all the  composite numbers from the list:",
    correctAnswers: ["4", "6", "10", "12"],
    options: ["4", "6", "10", "12"]
  }
]

const PracticeInstructions = () => {
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const { level } = subjectcontext
  const navigate = useNavigate()
  const [isStartClicked, setIsStartClicked] = useState(false);
  const [isSpeakOut, setIsSpeakOut] = useState(false)

  const handleStartClick = () => {
    setIsStartClicked(true)
  }

  const speakout = () => {
    const synth = window.speechSynthesis;
    if (!isSpeakOut) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = instructions.join(' ');
      synth.speak(utterance);
    } else {
      synth.cancel(); // Stop speaking
    }
    setIsSpeakOut(!isSpeakOut);
  };

  const handleGoBack = () => {
    navigate("/practice-test")
  }

  useEffect(() => {
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("submitCount");
    localStorage.removeItem("completed");
    localStorage.removeItem("answers");
    localStorage.removeItem("correctlyAnswered");
    localStorage.removeItem("totalSubmissions")
    localStorage.removeItem("userSequences")
    localStorage.removeItem("attempts")
    localStorage.removeItem("results")

  }, []);

  return (
    <>
      {
        isStartClicked ? (
          <>
            {
              level === "Level 1" && (<LevelOnePractice assessment_questions={level1_assessment_questions} />)
            }
            {
              level === "Level 2" && (<LevelTwoPractice assessment_questions={level2_assessment_questions} />)
            }
            {
              level === "Level 3" && (<LevelThreePractice assessment_questions={level3_assessment_questions} />)
            }
            {
              level === "Level 4" && (<LevelFourPractice assessment_questions={level4_assessment_questions} />)
            }
          </>
        ) : (

          <>
            <div className="StickyHeader">
              <div className="BraneLogo">
                <img src={branelogo} alt="Brane Logo" />
              </div>
              <div className="Assessment_Header" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="GoBackButton">
                  <div className="GoBackButton__Div"
                    onClick={() => handleGoBack()}
                  >
                    <div>
                      <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                      Go Back
                    </div>
                  </div>
                </div>
                <div className="Assessment_Titles">
                  <div className="AssessmentTitle">{subjectcontext?.topic}</div>
                  <div className="LevelTitle">{level}</div>
                </div>
                <div className="Timer" style={{ visibility: "hidden" }}>
                  <div className="TimerIcon">
                    <img src={timericon} alt="timer" />
                  </div>

                  <div className="TimerText">
                    <div className="TimerValue"></div>

                    <div className="TimeElapsed">Time Elapsed</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Instructions__AssessmentScreen">

              <div className="Instructions__Container">
                <div className="Instructions__Container__InstructionsBox">
                  <div className="Instructions__Container__InstructionsBox__InstructionsTitle">
                    {/* <h2>Test your Listening Skills</h2> */}
                    <div style={{ visibility: "hidden" }}>lorem</div>
                    <h3>Assessment Instuctions</h3>
                    <div className="Instructions__Container__InstructionsBox__InstructionsTitle__icon"
                      onClick={speakout}
                    >
                      {
                        isSpeakOut ? (
                          <img src={SpeakerOn} alt="Speaker On" srcset="" />
                        ) : (
                          <img src={SpeakerOff} alt="Speaker Off" srcset="" />
                        )
                      }
                    </div>
                  </div>

                  <div className="Instructions__Container__InstructionsBox__InstructionPoints"
                    style={{ whiteSpace: 'pre-line', tabSize: "4" }}
                  >
                    <ol>
                      {
                        instructions.map((ele, index) => (
                          <li key={index}>{ele}</li>
                        ))
                      }
                    </ol>

                  </div>
                  <div className="Instructions__Container__StartButton">
                    <div className="Instructions__Container__StartButton_btn" onClick={() => handleStartClick()}>
                      Start
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </>
        )
      }
    </>
  );
};

export default PracticeInstructions;
