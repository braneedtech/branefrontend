import React, { useContext } from "react";
import TakeLessonNavbar from "../learning/Navbar2";
import { Link, useNavigate } from "react-router-dom";
import gobackicon from "../../../assets/gobackicon.png";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import "./specialskills.css";
import { Doughnut } from 'react-chartjs-2';
import loader from "../../../assets/loading/loader.gif";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls";
import { useQuery } from "react-query";
import 'chart.js/auto';


const LevelResultsDashboard = () => {
    const navigate = useNavigate();
    const { student } = StudentDetailsCustomHook();
    const { subjectcontext, updateSubjectContext } = useContext(
        Subject_Chapter_Topic
    );
    const { specialskill, skillname, level } = subjectcontext

    let results = {};
    let levelsdbdata = {};

    const { data, error, isLoading } = useQuery(
        [
            "specialskills_details_data",
            `${end_point}/level-results?mobileno=${student?.mobileno}&childIndex=${student?.childIndex}&specialskill=Special Skills&skillname=${subjectcontext?.specialskill}&level=${subjectcontext?.level}`,
        ],
        brane_get_service
    );
    let landing_page_nav_menu
    if (!isLoading && error == null) {
        const { data: alias } = data;
        results = alias;
        landing_page_nav_menu = results["landing_page_nav_menu"] || []
        levelsdbdata = {
            labels: ['Correct Answers', 'Wrong Answers'],
            datasets: [
                {
                    data: [results['Corrected Answers'] || 0, results['Wrong Answers'] || 0],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                },
            ],
        };
    }

    const pieChartOptions = {
        // responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: level || "Level", // You can set your desired title here
                font: {
                    size: 16,
                },
            },
        },
    };

    return (
        <div className="landing__Container">
            <TakeLessonNavbar
                navmenu={[
                    {
                        "_id": "64f03e65aee64a0b717d698e",
                        "landingpage_nav_menu": [
                            {
                                "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/nav_menu/dashboard.png",
                                "title": "Dashboard"
                            },
                            {
                                "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/nav_menu/generalsearch.png",
                                "title": "General Search"
                            },
                            {
                                "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/nav_menu/DYNAMIC.png",
                                "title": "Dynamic TimeTable"
                            },
                            {
                                "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/left_menu/E-learning+(2).png",
                                "title": "Learning Network"
                            }
                        ],
                        "notifications_icon": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/nav_menu/notification+btn.png"
                    },
                ]}
            />
            <div
                className="landing__specialskills-skillscontainer"
                style={{ flexDirection: "column" }}
            >
                <div className="landing__specialskills-skillscontainer__resultsTopPart">
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
                <div className="landing__specialskills-skillscontainer__resultsbottomPart">
                    <div className="landing__specialskills-skillscontainer__resultsbottomPart-piechart">
                        {isLoading ? (
                            <img src={loader} className="loader" alt="Loading..." />
                        ) : (
                            <Doughnut
                                data={levelsdbdata}
                                options={pieChartOptions}
                            />
                        )}
                    </div>
                    <div className="landing__specialskills-skillscontainer__resultsbottomPart-content">
                        {/* Content goes here */}
                        <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container">
                            <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field">
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-label">
                                    Level
                                </div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-colon"
                                >:</div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-value">
                                    {level || "Level1"}
                                </div>
                            </div>
                            <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field">
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-label">
                                    Time Taken
                                </div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-colon"
                                >:</div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-value">
                                    {results['Time Taken'] || ""}
                                </div>
                            </div>
                            <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field">
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-label">
                                    Corrected Answers
                                </div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-colon"
                                >:</div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-value">
                                    {results['Corrected Answers'] || "0"}
                                </div>
                            </div>
                            <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field">
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-label">
                                    Wrong Answers :
                                </div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-colon"
                                >:</div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-value">
                                    {results['Wrong Answers'] || "0"}
                                </div>
                            </div>
                            <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field">
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-label">
                                    Total Score
                                </div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-colon"
                                >:</div>
                                <div className="landing__specialskills-skillscontainer__resultsbottomPart-content-container-field-value">
                                    {results['Percentage'] || ""} %
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="landing__specialskills-skillscontainer__resultsbottomPart2">
                    <button type="button"
                        onClick={() => {
                            navigate("/levels")
                        }}
                    >Continue</button>
                </div>
            </div>
        </div>
    );
};

export default LevelResultsDashboard;
