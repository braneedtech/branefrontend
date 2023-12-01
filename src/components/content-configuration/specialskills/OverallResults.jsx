import React, { useContext } from "react";
import TakeLessonNavbar from "../learning/Navbar2";
import { Link, useNavigate } from "react-router-dom";
import gobackicon from "../../../assets/gobackicon.png";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import { Bar } from "react-chartjs-2";
import loader from "../../../assets/loading/loader.gif";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls";
import 'chart.js/auto';
import { useQuery } from "react-query";

const OverallResults = () => {
    const navigate = useNavigate();
    const { student } = StudentDetailsCustomHook();
    const { subjectcontext, updateSubjectContext } = useContext(
        Subject_Chapter_Topic
    );
    const { specialskill, skill_name } = subjectcontext;

    let results = {};

    const { data, error, isLoading } = useQuery(
        [
            "specialskills_details_data",
            `${end_point}/all_level_results?mobileno=${student?.mobileno}&childIndex=${student?.childIndex}&specialskill=Special Skills&skillname=${specialskill}`,
        ],
        brane_get_service
    );
    let landing_page_nav_menu;
    if (!isLoading && error == null) {
        const { data: alias } = data;
        results = alias;
        if (alias && alias.landing_page_nav_menu) {
            landing_page_nav_menu = alias.landing_page_nav_menu;
        } else {
            // Handle the case where landingpagenavmenu is undefined
            landing_page_nav_menu = []
        }
        results = results[`${specialskill}`] || []
    }


    // Extracting data for chart
    const levels = Object.keys(results);
    const correctedAnswersData = levels.map((level) => results[level]["Corrected Answers"]);
    const wrongAnswersData = levels.map((level) => results[level]["Wrong Answers"]);
    const percentageData = levels.map((level) => results[level]["Percentage"]);
    const barChartData = {
        labels: levels,
        datasets: [
            {
                label: "Corrected Answers",
                backgroundColor: "#196ce0",
                hoverBackgroundColor: "#0b66e6",
                data: correctedAnswersData,
            },
            {
                label: "Wrong Answers",
                backgroundColor: "#de3a5d",
                hoverBackgroundColor: "#d9234a",
                data: wrongAnswersData,
            },
            {
                label: "Percentage",
                backgroundColor: "#57a158",
                hoverBackgroundColor: "#50b551",
                data: percentageData,
            },
        ],
    };

    const barChartOptions = {
        scales: {
            x: {
                grid: {
                    display: false, // Remove x-axis grid lines
                },
            },
            y: {
                grid: {
                    display: false, // Remove y-axis grid lines
                },
            },
        },
    };

    const doughnutData = {
        labels: levels,
        datasets: [
            {
                data: correctedAnswersData,
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

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
                                <div className="landing__specialskills-skillscontainer__barchart">
                                    {isLoading ? (
                                        <img src={loader} className="loader" alt="Loading..." />
                                    ) : (
                                        <Bar data={barChartData} options={barChartOptions}
                                        />
                                    )}
                                </div>

                                <div className="landing__specialskills-skillscontainer__resultsbottomPart2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate("/levels");
                                        }}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            ) : (
                <>
                    <img src={loader} alt="Error" width={200} height={200}></img>
                </>
            )}
        </>

    );
};

export default OverallResults;
