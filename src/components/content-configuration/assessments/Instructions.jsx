import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomPopup from "./CustomPopup";
import "./Questions.css";
import branelogo from "../../../assets/Branenewlogo.png";
import timericon from "../../../assets/timericon.svg";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import Questions from "./Questions";
import { Link } from "react-router-dom";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";

import SpeakerOff from "../../../assets/SpeakerOff.png"
import SpeakerOn from "../../../assets/SpeakerOn.gif"

const instructions = [
  "MCQ's based test with no negative marking.",
  "Do not press any buttons on your keyboard.",
  "Do not try to copy questions and search for answers on the Internet.",
  "Do not take screenshots.",
  "Do not ask someone else to pass your test for you. Patterns will be captured If you break these rules, THE TEST WILL BE ABORTED.",
  "Before you click on the take test button , please make sure you have the below:\n\u00a0\u00a0\u00a0\u00a0A. Good internet connectivity\n\u00a0\u00a0\u00a0\u00a0B. Lock yourself into a room to avoid distractions."

]

const Instructions = ({ assessment_questions }) => {
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const { level } = subjectcontext
  const navigate = useNavigate()
  const [isStartClicked, setIsStartClicked] = useState(false);
  const [isSpeakOut, setIsSpeakOut] = useState(false)


  const handleStartClick = () => {
    setIsStartClicked(true)
  }

  const handleGoBack = () => {
    navigate("/assessments")
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

  useEffect(() => {
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("submitCount");
    localStorage.removeItem("completed");
    localStorage.removeItem("answers");
    localStorage.removeItem("correctlyAnswered");
    localStorage.removeItem("totalSubmissions")

  }, []);

  return (
    <>
      {
        isStartClicked ? (
          <>
            {
              level === "Level 1" && (<Questions assessment_questions={assessment_questions} />)
            }
            {
              level === "Level 2" && (<Level2 assessment_questions={assessment_questions} />)
            }
            {
              level === "Level 3" && (<Level3 assessment_questions={assessment_questions} />)
            }
            {
              level === "Level 4" && (<Level4 assessment_questions={assessment_questions} />)
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
                      {/* <li>
                        Lorem ipsum dolor sit amet. Est consectetur consequatur ut deserunt minima utpraesentium iste eos galisum sint.
                      </li>
                      <li>
                        Lorem ipsum dolor sit amet. Est consectetur consequatur ut deserunt minima utpraesentium iste eos galisum sint.
                      </li>
                      <li>
                        Lorem ipsum dolor sit amet. Est consectetur consequatur ut deserunt minima utpraesentium iste eos galisum sint.
                      </li>
                      <li>
                        Lorem ipsum dolor sit amet. Est consectetur consequatur ut deserunt minima utpraesentium iste eos galisum sint.
                      </li> */}

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

export default Instructions;
