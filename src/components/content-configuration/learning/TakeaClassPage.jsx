// import React, { useState, useRef, useContext, useEffect } from "react";
// import {
//   Link,
//   useNavigate,
//   useParams,
//   useOutletContext,
// } from "react-router-dom";
// import { useQuery } from "react-query";
// import VideoPlayer from "./Videoplayer.jsx";
// import { end_point } from "../../../constants/urls";
// import brane_get_service from "../../../services/brane_get_service";
// import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
// import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
// import assessmenticon from "../../../assets/assessmenticon.png";
// import gobackicon from "../../../assets/gobackicon.png";
// import { Pie } from "react-chartjs-2";
// import "chart.js/auto";
// import "./learning.css";
// import "./videowithPoll.css";
// import PollQuestion from "./PollQuestion.jsx";
// import correct from "../../../assets/correct.gif"
// import wrong from "../../../assets/wrong.gif"

// function VideoWithPoll() {
//   // State, refs, and context
//   const [currentPoll, setCurrentPoll] = useState(null);
//   const [shownPollIndices, setShownPollIndices] = useState([]);
//   const [feedback, setFeedback] = useState(null);
//   const videoRef = useRef(null);
//   const navigate = useNavigate();
//   const { student, updateStudent } = StudentDetailsCustomHook();
//   const { subjectcontext, updateSubjectContext } = useContext(
//     Subject_Chapter_Topic
//   );
//   const { url } = useParams();
//   const decodedUrl = decodeURIComponent(url);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [wrongAnswers, setWrongAnswers] = useState(0);
//   const [videoEnded, setVideoEnded] = useState(false);
//   const outletContext = useOutletContext();
// const { isOffcanvasOpen } = outletContext || {};
//   // const { isOffcanvasOpen } = useOutletContext();

//   let content_types = {};
//   let videourl;
//   let pollQuestions = [];
//   let videothumbnail;

//   const resetResults = () => {
//     setCurrentPoll(null);
//     setShownPollIndices([]);
//     setCorrectAnswers(0);
//     setWrongAnswers(0);
//     setFeedback(null);
//     setVideoEnded(false);
//   };

//   // Data fetching
//   const { data, error, isLoading } = useQuery(
//     [
//       "portfolio_page",
//       `${end_point}/content_configuration?curriculum=${student?.curriculum}&medium_of_instruction=${student?.medium_of_instruction}&schooling=${student.schooling}&subject=${subjectcontext.subject}&chapter=${subjectcontext.chapter}&topic=${subjectcontext.topic}`,
//     ],
//     brane_get_service
//   );

//   if (!isLoading && error == null) {
//     const { data: alias } = data;
//     const { content } = alias;
//     content_types = content;
//     videourl = content_types[0]?.video;
//     videothumbnail = content_types[0]?.thumbnail;
//     pollQuestions = content_types[0]?.poll;
//   }

//   useEffect(() => {
//     const handleTimeUpdate = () => {
//       const currentTime = videoRef.current.currentTime;

//       if (currentTime === 0) {
//         resetResults();
//       }

//       pollQuestions.forEach((poll, index) => {
//         if (currentTime > poll.time && !shownPollIndices.includes(index)) {
//           setCurrentPoll(poll);
//           setShownPollIndices((prevIndices) => [...prevIndices, index]);
//           videoRef.current.pause();
//           videoRef.current.controls = false;
//         }
//       });
//     };
//     // Attach event listener if videoRef.current is not null
//     if (videoRef.current) {
//       videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
//     }

//     // Return a cleanup function
//     return () => {
//       // Remove event listener if videoRef.current is not null
//       if (videoRef.current) {
//         videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
//       }
//     };
//   }, [shownPollIndices, pollQuestions]);


//   const handleAnswer = (answer) => {
//     let isCorrect = answer === currentPoll.correctAnswer;
//     if (isCorrect) {
//       setCorrectAnswers((prevCount) => prevCount + 1);
//       setFeedback(<img src={correct} alt="Correct" />);
//     } else {
//       setWrongAnswers((prevCount) => prevCount + 1);
//       setFeedback(<img src={wrong} alt="Wrong" />);
//     }

//     // Use setTimeout to hide feedback and resume the video after 1 second
//     setTimeout(() => {
//       setFeedback(null);
//       setCurrentPoll(null); // This will hide the question as well
//       if (videoRef.current) {
//         videoRef.current.controls = true;
//         videoRef.current.play();
//       }
//     }, 1000); // Timeout set to 1 second
//   };

//   const start_assessment = () => {
//     navigate("/assessments");
//   };

//   const piedata = {
//     labels: ["Correct Answers", "Wrong Answers"],
//     datasets: [
//       {
//         data: [correctAnswers, wrongAnswers],
//         backgroundColor: ["#7ce495", "#e73c35"],
//         borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const handleVideoEnd = async () => {
//     setVideoEnded(true);

//     const results = {
//       correctAnswers,
//       wrongAnswers,
//       totalQuestions: pollQuestions.length,
//       percentage: (
//         (correctAnswers / (correctAnswers + wrongAnswers)) *
//         100
//       ).toFixed(2),
//     };
//     console.log(results);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/saveResults",
//         results
//       );
//       console.log("Results saved:", response.data);
//     } catch (error) {
//       console.error("Error saving results:", error);
//     }
//   };

//  // Style for the poll container
//  const pollContainerStyle = {
//     position: 'absolute',
//     left: isOffcanvasOpen ? '43%' : '38%', // Adjust based on your offcanvas width
//     width: isOffcanvasOpen ? '60%' : '50%',
//     right: 0,
//     top:'57%',
//     zIndex: 1000, // Ensure it's above the video player
//     pointerEvents: 'none', // Ensure clicks go through to the video if not clicking on poll
//   };

//   // Apply pointerEvents style only where needed
//   const pollQuestionStyle = {
//     pointerEvents: 'auto', // Enable pointer events for the poll question itself
//   };

//   return (
//     <>
//       <div className="landing__videoClassScreenContainer__TopPart">
//         <Link
//           to={`/portfolio/chapters/${subjectcontext.subject}`}
//           style={{ textDecoration: "none" }}
//         >
//           <div className="landing__videoClassScreenContainer__control-button__back-button">
//             <i
//               className="bi bi-arrow-left-circle"
//               style={{ fontSize: "1.5rem" }}
//             ></i>{" "}
//             Go Back
//           </div>
//         </Link>
//         <div
//           className="landing__videoClassScreenContainer__assessment-button"
//           onClick={start_assessment}
//         >
//           Take Test{" "}
//           <img
//             src={assessmenticon}
//             className="landing__videoClassScreenContainer__assessmenticon"
//             alt="arrow"
//           />
//         </div>
//       </div>
//       <div className="landing__videoClassScreenContainer__Midpart">
//         <div className="video-container">
//           <VideoPlayer
//             src={videourl}
//             ref={videoRef}
//             poster={videothumbnail}
//             onEnded={handleVideoEnd}
//           />
//           <div className="poll-container" style={pollContainerStyle}>
//             {currentPoll && !feedback && (
//               <div style={pollQuestionStyle}>
//                 <PollQuestion
//                   question={currentPoll.question}
//                   options={currentPoll.options}
//                   onAnswer={handleAnswer}
//                 />
//               </div>
//             )}
//             {feedback && <div className="feedback-message">{feedback}</div>}
//           </div>
//         </div>

//         {/* <div className="results">
//           <p>Total Questions: {pollQuestions.length}</p>
//           <p>Correct Answers: {correctAnswers}</p>
//           <p>Wrong Answers: {wrongAnswers}</p>
//           <p>
//             Percentage:{" "}
//             {correctAnswers + wrongAnswers > 0
//               ? (
//                   (correctAnswers / (correctAnswers + wrongAnswers)) *
//                   100
//                 ).toFixed(2)
//               : 0}
//             %
//           </p>
//         </div> */}

//         {videoEnded && (
//           <div className="pie-chart">
//             <Pie data={piedata} />
//           </div>
//         )}
//       </div>
//       <div className="landing__videoClassScreenContainer__PrevNextControls">
//         <div className="landing__videoClassScreenContainer__bottom-left-button__previous-topic">
//           <div className="prev-icon">{"<"}</div>
//           <div className="prev-title">Previous Topic</div>
//         </div>
//         <div className="landing__videoClassScreenContainer__bottom-right-button__next-topic">
//           <div className="next-title">Next Topic</div>
//           <div className="next-icon">{">"}</div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default VideoWithPoll;

// import React, { useState, useRef, useEffect } from "react";
// import VideoPlayer from "./VideoPlayer";
// import PollQuestion from "./PollQuestion";
// import { Pie } from 'react-chartjs-2';
// import 'chart.js/auto';
// import "./VideoWithPoll.css";

// const pollQuestions = [
//     { time: 10, question: "Is real numbers related to maths?", options: ["Yes", "No"], correctAnswer: "Yes" },
//     { time: 30, question: "Is the content clear?", options: ["Yes", "No"], correctAnswer: "No" }
// ];

// function VideoWithPoll() {
//     const [currentPoll, setCurrentPoll] = useState(null);
//     const [shownPollIndices, setShownPollIndices] = useState([]);
//     const [feedback, setFeedback] = useState(null);
//     const [correctAnswers, setCorrectAnswers] = useState(0);
//     const [wrongAnswers, setWrongAnswers] = useState(0);
//     const videoRef = useRef(null);
//     const [videoEnded, setVideoEnded] = useState(false);

//     const resetResults = () => {
//         setCurrentPoll(null);
//         setShownPollIndices([]);
//         setCorrectAnswers(0);
//         setWrongAnswers(0);
//         setFeedback(null);
//         setVideoEnded(false);
//     };

//     useEffect(() => {
//         if (videoRef.current) {
//             const handleTimeUpdate = () => {
//                 const currentTime = videoRef.current.currentTime;

//                 if (currentTime === 0) {
//                     resetResults();
//                 }

//                 pollQuestions.forEach((poll, index) => {
//                     if (currentTime > poll.time && !shownPollIndices.includes(index)) {
//                         setCurrentPoll(poll);
//                         setShownPollIndices(prevIndices => [...prevIndices, index]);
//                         videoRef.current.pause();
//                         videoRef.current.controls = false;
//                     }
//                 });
//             };

//             videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

//             return () => {
//                 videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//             };
//         }
//     }, [shownPollIndices]);

//     const handleAnswer = (answer) => {
//         if (answer === currentPoll.correctAnswer) {
//             setCorrectAnswers(prevCount => prevCount + 1);
//             setFeedback("Correct!");
//         } else {
//             setWrongAnswers(prevCount => prevCount + 1);
//             setFeedback(`Wrong! The correct answer is ${currentPoll.correctAnswer}`);
//         }

//         setTimeout(() => {
//             setFeedback(null);
//             setCurrentPoll(null);
//             if (videoRef.current) {
//                 videoRef.current.controls = true;
//                 videoRef.current.play();
//             }
//         }, 1500);
//     };

//     const data = {
//         labels: ['Correct Answers', 'Wrong Answers'],
//         datasets: [
//             {
//                 data: [correctAnswers, wrongAnswers],
//                 backgroundColor: ['#c96c6c', '#ffe2e2'],
//                 borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const handleVideoEnd = async () => {
//         setVideoEnded(true);

//         const results = {
//           correctAnswers,
//           wrongAnswers,
//           totalQuestions: pollQuestions.length,
//           percentage:((correctAnswers / (correctAnswers + wrongAnswers)) * 100).toFixed(2)
//         };
//         console.log(results);
//         try {
//         //   const response = await axios.post('http://localhost:5000/saveResults', results);
//         //   console.log('Results saved:', response.data);
//         } catch (error) {
//         //   console.error('Error saving results:', error);
//         }
//       };

//     return (
//         <>
//             <div className="video-container">
//                 <VideoPlayer
//                     src="https://braneeducation.s3.ap-south-1.amazonaws.com/content/maths/History_Final_Converted+(4).mp4"
//                     ref={videoRef}
//                     onEnded={handleVideoEnd}
//                 />
//                 {currentPoll && (
//                     <PollQuestion
//                         question={currentPoll.question}
//                         options={currentPoll.options}
//                         onAnswer={handleAnswer}
//                     />
//                 )}
//                 {feedback && (
//                     <div className="feedback-message">{feedback}</div>
//                 )}
//             </div>

//             <div className="results">
//                 <p>Total Questions: {pollQuestions.length}</p>
//                 <p>Correct Answers: {correctAnswers}</p>
//                 <p>Wrong Answers: {wrongAnswers}</p>
//                 <p>Percentage: {correctAnswers + wrongAnswers > 0 ? ((correctAnswers / (correctAnswers + wrongAnswers)) * 100).toFixed(2) : 0}%</p>
//             </div>

//             {videoEnded && (
//                 <div className="pie-chart">
//                     <Pie data={data} />
//                 </div>
//             )}
//         </>
//     );
// }

// export default VideoWithPoll;



import React, { useState } from "react";
import BreadcrumbComponent from "./breadcrum";
import ClassOptions from "./ClassOptions";
import arrowicon from "../../../assets/arrowicon.svg";
import "./learning.css";
import TakeLessonNavbar from "./Navbar2";
import { QueryClient } from "react-query";
import { Outlet, useParams } from "react-router-dom";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls.jsx";
import { useQuery } from "react-query";
import loader from "../../../assets/loading/loader.gif";
import { Link } from "react-router-dom";
import GamePlayer from "./GamePlayer";
import Pdf from "./PdfLecture";
import Ppt from "./PPTLecture";
import { useContext } from "react";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";

const queryClient = new QueryClient();

const TakeaClassPage = () => {
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );
  const { student, updateStudent } = StudentDetailsCustomHook();

  let profile_info = student;
  let content_types = {};
  let navmenu = {};
  const { data, error, isLoading } = useQuery(
    [
      "portfolio_page",
      `${end_point}/content_configuration?curriculum=${profile_info.curriculum}&medium_of_instruction=${profile_info.medium_of_instruction}&schooling=${profile_info.schooling}&subject=${subjectcontext.subject}&chapter=${subjectcontext.chapter}&topic=${subjectcontext.topic}`,
    ],
    brane_get_service
  );

  if (!isLoading && error == null) {
    const { data: alias } = data;
    const { content } = alias;
    content_types = content;
    const { portfolio_page_landing_menu } = alias;
    navmenu = portfolio_page_landing_menu;
  }

  // State to manage the offcanvas menu
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(true);

  // Function to toggle the offcanvas menu
  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <>
            <div className="landing__takelesson">
              <TakeLessonNavbar navmenu={navmenu} />

              <div className="landing__takelesson__MainContainer">
                <div>
                  <BreadcrumbComponent />
                  <div className="landing__takelesson__MainContainer__BottomPart">
                    {/* Apply offcanvas class based on the state */}
                    <ul
                      className="landing__content__types"
                      style={{
                        width: isOffcanvasOpen ? "" : "5vw",
                        transition: "width 0.3s ease-in-out",
                      }}
                    >
                      {content_types[0]?.labels.map((label, index) => (
                        <li
                          style={{
                            cursor: !(label.title in content_types[0]) ? "not-allowed" : "pointer",
                            pointerEvents: !(label.title in content_types[0]) ? "none" : "auto",
                          }}
                          key={index}
                        >
                          <Link
                            aria-disabled={!(label.title in content_types[0])}
                            style={{
                              color: !(label.title in content_types[0]) ? "#babaea" : "#603E9F",
                            }}
                            to={`/takelesson/${label.title.toLowerCase()}/${encodeURIComponent(
                              content_types[0][`${label.title}`]
                            )}`}
                          >
                            <img src={label.icon} alt="icon" />
                            <span
                              style={{
                                visibility: isOffcanvasOpen
                                  ? "visible"
                                  : "hidden",
                                display: isOffcanvasOpen ? "block" : "none",
                                cursor: !(label.title in content_types[0]) ? "not-allowed" : "pointer",
                                pointerEvents: !(label.title in content_types[0]) ? "none" : "auto",
                                fontWeight: !(label.title in content_types[0]) ? "400": "600",
                              }}
                            >
                              {label?.title}
                              {/* {!(label.title in content_types[0]) && (
                              <sup className="badge pulsate">soon</sup>
                            )} */}
                            </span>
                          </Link>

                          {/* 
                          <Link
                            aria-disabled={index > 3}
                            style={{
                              color: index >= 4 ? "#d9cdf6" : "#603E9F",
                            }}
                            to={
                              label &&
                              label.title &&
                              content_types[0] &&
                              content_types[0][label.title]
                                ? `/takelesson/${label.title.toLowerCase()}/${encodeURIComponent(
                                    content_types[0][label.title]
                                  )}`
                                : "#"
                            }
                          >
                            <img src={label?.icon} alt="icon" />
                            <span
                              style={{
                                visibility: isOffcanvasOpen
                                  ? "visible"
                                  : "hidden",
                                display: isOffcanvasOpen ? "block" : "none",
                              }}
                            >
                              {label?.title}
                            </span>
                          </Link> */}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="landing__offcanvas-arrow"
                      onClick={toggleOffcanvas}
                    >
                      {isOffcanvasOpen ? (
                        <img
                          src={arrowicon}
                          style={{
                            transform: "scaleX(-1)",
                          }}
                        ></img>
                      ) : (
                        <img src={arrowicon}></img>
                      )}
                    </div>

                    <div
                      className="landing__videoClassScreenContainer"
                      style={{
                        transition: "width 0.3s ease-in-out",
                        width: isOffcanvasOpen ? "73%" : "86%",
                      }}
                    >
                      <Outlet context={{ isOffcanvasOpen, toggleOffcanvas }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <img src={loader} className="loader" alt="Error" width={200} height={200}></img>
        </>
      )}
    </>
  );
};

export default TakeaClassPage;
