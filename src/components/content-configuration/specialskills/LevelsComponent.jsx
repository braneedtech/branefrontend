import React, { useContext } from "react";
import TakeLessonNavbar from "../learning/Navbar2";
import { Link, useNavigate } from "react-router-dom";
import gobackicon from "../../../assets/gobackicon.png";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import "./specialskills.css";
import LevelImage from "../../../assets/LevelImage.png"
import { useQuery } from "react-query";
import { end_point } from "../../../constants/urls";
import brane_get_service from "../../../services/brane_get_service";
import loader from "../../../assets/loading/loader.gif"
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";

const LevelsComponent = () => {
    const navigate = useNavigate();
    const { student } = StudentDetailsCustomHook();
    const { subjectcontext, updateSubjectContext } = useContext(
        Subject_Chapter_Topic
    );
    const { specialskill, skill_name } = subjectcontext;
    const handleLevelClick = (level) => {
        updateSubjectContext({
            specialskill: specialskill,
            skill_name: skill_name,
            level: level,
        });
        navigate("/skills");
    };
    let results = {}

    const { data, error, isLoading } = useQuery(
        [
            "specialskills_details_data",
            `${end_point}/store-results?mobileno=${student?.mobileno}&childIndex=${student?.childIndex}&specialskill=Special Skills&skillname=${specialskill}`,
        ],
        brane_get_service
    );
    let landing_page_nav_menu = {};
    let specialskills_image
    if (!isLoading && error == null) {
        const { data: alias } = data;
        results = alias
        specialskills_image = results?.specialskills_image
        landing_page_nav_menu = results?.landing_page_nav_menu
        results = results?.completedLevels
        // console.log(landing_page_nav_menu)
    }
    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__Container">
                            <TakeLessonNavbar
                                navmenu={landing_page_nav_menu}
                            />
                            <div
                                className="landing__specialskills-skillscontainer"
                                style={{ flexDirection: "column" }}
                            >
                                <div className="landing__specialskills-skillscontainer__TopPart">
                                    <Link
                                        to={`/portfolio/specialskills/${subjectcontext?.specialskill}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <div className="landing__Container__SportsScreen__control-button__back-button">
                                            <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                            Go Back
                                        </div>
                                    </Link>
                                    <div>
                                        <h2>{subjectcontext?.specialskill}</h2>
                                    </div>
                                </div>
                                <div className="landing__specialskills-skillscontainer__bottomPart">
                                    <div className="landing__specialskills-skillscontainer__bottomPart-levelscreen">
                                        <div className="landing__specialskills-skillscontainer__Levels">
                                            <div className="landing__specialskills-skillscontainer__Levels__div1">
                                                <Link to="/skills" onClick={() => handleLevelClick("Level1")}>
                                                    Level 1
                                                </Link>
                                                <Link
                                                    to="/skills" onClick={() => handleLevelClick("Level2")}
                                                    aria-disabled={results && !results['Level1']}
                                                    style={{
                                                        pointerEvents: results && !results['Level1'] ? "none" : "auto",
                                                        background: (results && !results['Level1']) ? "#a485de" : "#603E9F"

                                                    }}
                                                // className={results && !results['Level1'] ? "landing__specialskills-skillscontainer__Levels-disable" : ""}


                                                >
                                                    Level 2
                                                    {
                                                        (results && !results['Level1']) && <span>&nbsp;&nbsp; <i className="bi bi-lock-fill"></i></span>
                                                    }

                                                </Link>
                                                <Link to="/skills" onClick={() => handleLevelClick("Level3")}
                                                    aria-disabled={results && !results['Level2']}
                                                    style={{
                                                        pointerEvents: results && !results['Level2'] ? "none" : "auto",
                                                        background: (results && !results['Level2']) ? "#a485de" : "#603E9F"

                                                    }}
                                                // className={results && !results['Level2'] ? "landing__specialskills-skillscontainer__Levels-disable" : ""}

                                                >
                                                    Level 3
                                                    {
                                                        (results && !results['Level2']) && <span>&nbsp;&nbsp; <i className="bi bi-lock-fill"></i></span>
                                                    }
                                                </Link>
                                            </div>
                                            <div className="landing__specialskills-skillscontainer__Levels__div2">
                                                <Link to="/skills" onClick={() => handleLevelClick("Level4")}
                                                    aria-disabled={results && !results['Level3']}
                                                    style={{
                                                        pointerEvents: results && !results['Level3'] ? "none" : "auto",
                                                        background: (results && !results['Level3']) ? "#a485de" : "#603E9F"

                                                    }}
                                                // className={results && !results['Level3'] ? "landing__specialskills-skillscontainer__Levels-disable" : ""}
                                                >
                                                    Level 4
                                                    {
                                                        (results && !results['Level3']) && <span>&nbsp;&nbsp; <i className="bi bi-lock-fill"></i></span>
                                                    }
                                                </Link>
                                                <Link to="/skills" onClick={() => handleLevelClick("Level5")}
                                                    aria-disabled={results && !results['Level4']}
                                                    style={{
                                                        pointerEvents: results && !results['Level4'] ? "none" : "auto",
                                                        background: (results && !results['Level4']) ? "#a485de" : "#603E9F"

                                                    }}
                                                // className={results && !results['Level4'] ? "landing__specialskills-skillscontainer__Levels-disable" : ""}

                                                >
                                                    Level 5
                                                    {
                                                        (results && !results['Level4']) && <span>&nbsp;&nbsp; <i className="bi bi-lock-fill"></i></span>
                                                    }
                                                </Link>
                                            </div>
                                        </div>
                                        {
                                            (results && results['Level1'] && results['Level2'] && results['Level3'] && results['Level4'] && results['Level5']) ? (
                                                <div className="landing__specialskills-skillscontainer__resultsbtn" >
                                                    <button onClick={() => {
                                                        navigate("/overall-results")
                                                    }}>
                                                        Show Overall Results
                                                    </button>
                                                </div>
                                            ) : ("")
                                        }
                                        <div className="landing__specialskills-skillscontainer__notepoints">
                                            <span>
                                                Note : &nbsp;
                                            </span>
                                            Skills are essential abilities, competencies, or expertise that
                                            individuals acquire through learning, training, and experience. They
                                            enable us to perform tasks, solve problems, and achieve goals in
                                            various aspects of life. Skills are the building blocks of personal
                                            and professional success. Whether you're looking to advance your
                                            career, improve your personal life, or tackle new challenges,
                                            acquiring and refining a diverse set of skills can open doors and
                                            enhance your overall quality of life. Continuous learning and
                                            development are key to staying relevant and adaptable in a rapidly
                                            changing world.
                                        </div>
                                    </div>
                                    <div className="landing__specialskills-skillscontainer__bottomPart-levelimage">
                                        <img src={specialskills_image || LevelImage} alt="" />
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
    )
};

export default LevelsComponent;
