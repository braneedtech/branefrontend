import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SpecialSkillsVideoComponent from "./SpecialSkillsVideoComponent";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import gobackicon from "../../../assets/gobackicon.png";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls";
import loader from "../../../assets/loading/loader.gif";
import branelogo from "../../../assets/Branenewlogo.png";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import CustomPopup from "../assessments/CustomPopup";
import SpeakerOff from "../../../assets/SpeakerOff.png"
import SpeakerOn from "../../../assets/SpeakerOn.gif"

const InstructionsScreen = () => {
  const { subjectcontext } = useContext(Subject_Chapter_Topic);
  const { specialskill, level } = subjectcontext;
  const [startTest, setStartTest] = useState(false);
  const { student } = StudentDetailsCustomHook();
  const [isSpeakOut, setIsSpeakOut] = useState(false);

  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(() => {
    const storedTime = window.localStorage.getItem("elapsedTime");
    return storedTime ? JSON.parse(storedTime) : 0;
  });

  useEffect(() => {
    let timerInterval;
    if (!startTest) {
      timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [startTest]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${padZero(minutes)}:${padZero(remainingSeconds)} ${
      minutes < 1 ? "Secs" : "Mins"
    }`;
  }

  function padZero(value) {
    return value.toString().padStart(2, "0");
  }
  const handleStartTest = () => {
    // Set the state to indicate that the test has started
    setStartTest(true);
    window.localStorage.removeItem("elapsedTime");
    setStartTest(true);
  };
  let specialskills_content_data = {};

  useEffect(() => {
    if (startTest) {
      // Start the timer only if the test hasn't started
      const timerInterval = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          window.localStorage.setItem("elapsedTime", JSON.stringify(newTime));
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [startTest]);

  //   const goBack = () => {
  //     setShowCustomPopup(true);
  //   };

  //   const handleConfirmPopup = () => {
  //     // Clear local storage and navigate to the desired route
  //     localStorage.clear();
  //     navigate("/");
  //   };

  //   const handleCancelPopup = () => {
  //     setShowCustomPopup(false);
  //   };

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    }

    if (remainingSeconds > 0) {
      parts.push(
        `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`
      );
    }

    return parts.join(" ");
  }
  const { data, error, isLoading } = useQuery(
    [
      "specialskills_content_data",
      `${end_point}/specialskills-content?skillname=${specialskill}&level=${level}`,
    ],
    brane_get_service
  );

  if (!isLoading && error == null) {
    const { data: alias } = data;
    specialskills_content_data = alias;
  }

  const getInitials = (name) => {
    // Extract the first letter of each word in the name
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return initials.toUpperCase();
  };

  const renderProfileImage = () => {
    // If there is a profile image, display it
    if (student?.profile_img) {
      return (
        <img
          src={student?.profile_img}
          // className="landing__leftbox__portfolio__profile__userimage"
          alt="Profile"
        />
      );
    }

    // If there is no profile image, display the first letter with a background color
    const initials = getInitials(student?.student_name);
    return (
      <div
        className="landing__leftbox__portfolio__profile__initials"
        style={{ width: "3.25vw", height: "7vh" }}
      >
        {initials}
      </div>
    );
  };

  const speakout = (instructions) => {
    const synth = window.speechSynthesis;
    if (!isSpeakOut) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = instructions.join(" ");
      synth.speak(utterance);
    } else {
      synth.cancel(); // Stop speaking
    }
    setIsSpeakOut(!isSpeakOut);
  };

  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <div className="landing__Instructions">
            <div className="landing__Instructions__Container__nav">
              <div className="landing__Instructions__Container__nav__logo">
                <img src={branelogo} alt="Logo" />
              </div>
              <div className="landing__Instructions__Container__nav__profileimg">
                {renderProfileImage()}{" "}
              </div>
            </div>
            <div
              className="landing__Instructions__Container"
              style={{ padding: "1rem .5rem" }}
            >
              <div className="landing__Instructions__Container__TopPart">
                <Link to={`/levels`} style={{ textDecoration: "none" }}>
                  <div className="landing__Container__SportsScreen__control-button__back-button">
                    <i
                      className="bi bi-arrow-left-circle"
                      style={{ fontSize: "1.5rem" }}
                    ></i>{" "}
                    Go Back
                  </div>
                </Link>
                <div>
                  <h2>{subjectcontext?.specialskill}</h2>
                </div>
                {startTest ? (
                  <div className="timer-display">{formatTime(elapsedTime)}</div>
                ) : (
                  <div style={{ visibility: "hidden" }}>00:00 Mins</div>
                )}
              </div>
              {!startTest ? (
                <div className="landing__specialskills-Instructions">
                  <div className="landing__specialskills-Instructions__heading">
                    <div style={{ visibility: "hidden" }}>lorem</div>
                    <h2>Assessment Instructions</h2>
                    <div
                      className="Instructions__Container__InstructionsBox__InstructionsTitle__icon"
                      onClick={() =>
                        speakout(
                          specialskills_content_data[
                            `specialskills_${specialskill}_${level}`
                          ]?.instructions
                        )
                      }
                    >
                      {isSpeakOut ? (
                        <img src={SpeakerOn} alt="Speaker On" srcset="" />
                      ) : (
                        <img src={SpeakerOff} alt="Speaker Off" srcset="" />
                      )}
                    </div>
                  </div>
                  <p>
                    Welcome to the assessment! Follow the instructions below to
                    complete the test.
                  </p>

                  <ol>
                    {specialskills_content_data &&
                      specialskills_content_data[
                        `specialskills_${specialskill}_${level}`
                      ] &&
                      specialskills_content_data[
                        `specialskills_${specialskill}_${level}`
                      ]?.instructions.map((ele, index) => (
                        <li key={index}>{ele}</li>
                      ))}
                  </ol>

                  {!startTest && (
                    <button
                      className="landing__specialskills-Instructions__startbtn"
                      onClick={handleStartTest}
                    >
                      Start Test
                    </button>
                  )}
                </div>
              ) : (
                <SpecialSkillsVideoComponent
                  video={
                    specialskills_content_data[
                      `specialskills_${specialskill}_${level}`
                    ]?.content
                  }
                  questions={
                    specialskills_content_data[
                      `specialskills_${specialskill}_${level}`
                    ].questions
                  }
                />
              )}
            </div>
          </div>
        )
      ) : (
        <>
          <img
            src={loader}
            className="loader"
            alt="Error"
            width={200}
            height={200}
          ></img>
        </>
      )}
    </>
  );
};

export default InstructionsScreen;
