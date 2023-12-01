import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";
import { useQuery } from "react-query";
import VideoPlayer from "./Videoplayer.jsx";
import { end_point } from "../../../constants/urls";
import brane_get_service from "../../../services/brane_get_service";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import assessmenticon from "../../../assets/assessmenticon.svg";
import gobackicon from "../../../assets/gobackicon.png";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./learning.css";
import "./videowithPoll.css";
import PollQuestion from "./PollQuestion.jsx";
import correct from "../../../assets/correct.gif";
import wrong from "../../../assets/wrong.gif";
import GobackComponent from "./GobackComponent.jsx";
import icon from "../../../assets/i-icon.svg";

function VideoWithPoll({ videoRef }) {
  // State, refs, and context
  const [currentPoll, setCurrentPoll] = useState(null);
  const [shownPollIndices, setShownPollIndices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  // const videoRef = useRef(null);
  const navigate = useNavigate();
  const { student, updateStudent } = StudentDetailsCustomHook();
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  const { isOffcanvasOpen } = useOutletContext();

  let content_types = {};
  let videourl;
  let pollQuestions = [];
  let videothumbnail;

  const resetResults = () => {
    setCurrentPoll(null);
    setShownPollIndices([]);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setFeedback(null);
    setVideoEnded(false);
  };

  // Data fetching
  const { data, error, isLoading } = useQuery(
    [
      "portfolio_page",
      `${end_point}/content_configuration?curriculum=${student?.curriculum}&medium_of_instruction=${student?.medium_of_instruction}&schooling=${student.schooling}&subject=${subjectcontext.subject}&chapter=${subjectcontext.chapter}&topic=${subjectcontext.topic}`,
    ],
    brane_get_service
  );

  if (!isLoading && error == null) {
    const { data: alias } = data;
    const { content } = alias;
    content_types = content;
    videourl = content_types[0]?.Lecture;
    videothumbnail = content_types[0]?.thumbnail;
    pollQuestions = content_types[0]?.poll;
  }

  useEffect(() => {
    const handleTimeUpdate = () => {
      const currentTime = videoRef.current.currentTime;

      if (currentTime === 0) {
        resetResults();
      }

      pollQuestions.forEach((poll, index) => {
        if (currentTime > poll.time && !shownPollIndices.includes(index)) {
          setCurrentPoll(poll);
          setShownPollIndices((prevIndices) => [...prevIndices, index]);
          videoRef.current.pause();
          videoRef.current.controls = false;
        }
      });
    };
    // Attach event listener if videoRef.current is not null
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    // Return a cleanup function
    return () => {
      // Remove event listener if videoRef.current is not null
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [shownPollIndices, pollQuestions]);

  const [isTeacherPopupOpen, setIsTeacherPopupOpen] = useState(false);

  const toggleTeacherPopup = () => {
    setIsTeacherPopupOpen(!isTeacherPopupOpen);
  };

  const handleAnswer = (answer) => {
    let isCorrect = answer === currentPoll.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers((prevCount) => prevCount + 1);
      setFeedback(<img src={correct} alt="Correct" />);
    } else {
      setWrongAnswers((prevCount) => prevCount + 1);
      setFeedback(<img src={wrong} alt="Wrong" />);
    }

    // Use setTimeout to hide feedback and resume the video after 1 second
    setTimeout(() => {
      setFeedback(null);
      setCurrentPoll(null); // This will hide the question as well
      if (videoRef.current) {
        videoRef.current.controls = true;
        videoRef.current.play();
      }
    }, 1000); // Timeout set to 1 second
  };

  const start_assessment = () => {
    navigate("/assessments");
  };

  const piedata = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        data: [correctAnswers, wrongAnswers],
        backgroundColor: ["#7ce495", "#e73c35"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const handleVideoEnd = async () => {
    setVideoEnded(true);

    const results = {
      correctAnswers,
      wrongAnswers,
      totalQuestions: pollQuestions.length,
      percentage: (
        (correctAnswers / (correctAnswers + wrongAnswers)) *
        100
      ).toFixed(2),
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/saveResults",
        results
      );
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  // Style for the poll container
  const pollContainerStyle = {
    position: "absolute",
    left: isOffcanvasOpen ? "48%" : "38%", // Adjust based on your offcanvas width
    width: isOffcanvasOpen ? "50%" : "55%",
    right: 0,
    top: "57%",
    zIndex: 1000, // Ensure it's above the video player
    pointerEvents: "none",
    transition: "left 0.3s ease-in-out",

    // Ensure clicks go through to the video if not clicking on poll
  };

  // Apply pointerEvents style only where needed
  const pollQuestionStyle = {
    pointerEvents: "auto", // Enable pointer events for the poll question itself
  };

  return (
    <>
      <GobackComponent />
      {/* <div className="landing__videoClassScreenContainer__TopPart">
        <Link
          to={`/portfolio/chapters/${subjectcontext.subject}`}
          style={{ textDecoration: "none" }}
        >
          <div className="landing__videoClassScreenContainer__control-button__back-button">
            <i
              className="bi bi-arrow-left-circle"
              style={{ fontSize: "1.5rem" }}
            ></i>{" "}
            Go Back
          </div>
        </Link>
        <Link
          to={`/practice-test`}
          style={{ textDecoration: "none" }}
          className="landing__videoClassScreenContainer__practisetest-btn btn-glow"
        >
          Practice Test
        </Link>
        <div
          className="landing__videoClassScreenContainer__assessment-button"
          onClick={start_assessment}
        >
          Take Test{" "}
          <img
            src={assessmenticon}
            className="landing__videoClassScreenContainer__assessmenticon"
            alt="arrow"
          />
        </div>
      </div> */}
      <div className="landing__videoClassScreenContainer__Midpart">
        <div className="video-container">
          <VideoPlayer
            src={videourl}
            ref={videoRef}
            poster={videothumbnail}
            onEnded={handleVideoEnd}
          />
          <div className="poll-container" style={pollContainerStyle}>
            {currentPoll && !feedback && (
              <div style={pollQuestionStyle}>
                <PollQuestion
                  question={currentPoll.question}
                  options={currentPoll.options}
                  onAnswer={handleAnswer}
                />
              </div>
            )}
            {feedback && <div className="feedback-message">{feedback}</div>}
          </div>
        </div>

        {/* <div className="results">
          <p>Total Questions: {pollQuestions.length}</p>
          <p>Correct Answers: {correctAnswers}</p>
          <p>Wrong Answers: {wrongAnswers}</p>
          <p>
            Percentage:{" "}
            {correctAnswers + wrongAnswers > 0
              ? (
                  (correctAnswers / (correctAnswers + wrongAnswers)) *
                  100
                ).toFixed(2)
              : 0}
            %
          </p>
        </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="teacher-icon-container">
            <img src={icon}></img>
            <div className="tooltip">
              <p>Know about your Teacher</p>
              <p>Teacher Name: Mahaboob Basha</p>
              <p>Qualification: MTech,MSc,BEd</p>
              <p>Experience: 16 Years</p>
              <p>Subject: Math</p>
              {/* ... other information */}
            </div>
          </div>
          {videoEnded && (
            <div className="pie-chart">
              <Pie data={piedata} />
            </div>
          )}
        </div>
      </div>
      {/* <div className="landing__videoClassScreenContainer__PrevNextControls">
        <div className="landing__videoClassScreenContainer__bottom-left-button__previous-topic">
          <div className="prev-icon">{"<"}</div>
          <div className="prev-title">Previous Topic</div>
        </div>
        <div className="landing__videoClassScreenContainer__bottom-right-button__next-topic">
          <div className="next-title">Next Topic</div>
          <div className="next-icon">{">"}</div>
        </div>
      </div> */}
    </>
  );
}

export default VideoWithPoll;
