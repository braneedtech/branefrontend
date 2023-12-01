import "./PracticeExamscreen.css";
import image from "../../../assets/assessmentlevelimg.svg";
import branelogo from "../../../assets/Branenewlogo.png";

import { Link } from "react-router-dom";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


const PracticeExamscreen = () => {
  const navigate = useNavigate()
  const { student } = StudentDetailsCustomHook();
  const { subjectcontext, updateSubjectContext } = useContext(Subject_Chapter_Topic)
  const { subject, chapter, topic } = subjectcontext
  const handleLevelClick = (level) => {
    updateSubjectContext({
      subject: subject,
      chapter: chapter,
      topic: topic,
      level: level
    });
    navigate("/practice-instructions")
  }

  const getInitials = (name) => {
    // Extract the first letter of each word in the name
    const initials = name.split(" ").map((word) => word[0]).join("");
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
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      <div className="ExamScreen">
        <div className="LevelScreen__StickyNavbar">
          <div className="BraneLogo">
            <img src={branelogo} alt="Brane Logo" />
          </div>
          <div className="LevelScreen__StickyNavbar__profile">
            {renderProfileImage()}
          </div>
        </div>
        <section className="mainscreen">
          <article className="mainscreen__container">
            <div className="mainscreen__container__Assessment_Header1">
              <div className="GoBackButton">
                <Link
                  to={`/takelesson`}
                >
                  <div>
                    <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                    Go Back
                  </div>
                </Link>
              </div>
            </div>
            <article className="mainscreen__insidescreen">
              <article className="mainscreen__insidescreen__text">
                <div className="mainscreen__insidescreen__text__heading">
                  <h1> Practice Assessment </h1>
                </div>
                <div className="mainscreen__insidescreen__text__paragraph">
                  <p>
                    This online assessment program offers students the opportunity
                    to enhance their knowledge and skills on a specific topic
                    through a four-level examination process. These iterative
                    exams provide a structured learning experience, starting with
                    foundational concepts and moving deeper into the topic. This
                    approach helps students develop a strong command of the topic
                    and promotes continuous improvement in their knowledge and
                    abilities.
                  </p>
                </div>
                <div className="mainscreen__insidescreen__text__buttons">
                  <button className="mainscreen__insidescreen__text__buttons__btn"
                    onClick={() => handleLevelClick("Level 1")}
                  // style={{
                  //   background: results && results["Level1"] ? "#73f038e8" : "#ded9f7"
                  // }}
                  >
                    Level 1
                  </button>
                  <button
                    className="mainscreen__insidescreen__text__buttons__btn"
                    onClick={() => handleLevelClick("Level 2")}
                  // style={{
                  //   background: results && results["Level2"] ? "#73f038e8" : "#ded9f7",
                  //   pointerEvents: results && !results['Level1'] ? "none" : "auto",

                  // }}
                  // disabled={results && !results['Level1']}

                  >

                    Level 2
                  </button>
                  <button
                    className="mainscreen__insidescreen__text__buttons__btn"
                    onClick={() => handleLevelClick("Level 3")}
                  // style={{
                  //   background: results && results["Level3"] ? "#73f038e8" : "#ded9f7",
                  //   pointerEvents: results && !results['Level2'] ? "none" : "auto",

                  // }}
                  // disabled={results && !results['Level2']}

                  >
                    Level 3
                  </button>
                  <button
                    className="mainscreen__insidescreen__text__buttons__btn"
                    onClick={() => handleLevelClick("Level 4")}
                  // style={{
                  //   background: results && results["Level4"] ? "#73f038e8" : "#ded9f7",
                  //   pointerEvents: results && !results['Level3'] ? "none" : "auto",

                  // }}
                  // disabled={results && !results['Level3']}

                  >
                    Level 4

                  </button>
                </div>
              </article>
              <article className="mainscreen__insidescreen__image">
                <img src={image}></img>
              </article>
            </article>
          </article>
        </section>
      </div>
    </>
  )
};
export default PracticeExamscreen;
