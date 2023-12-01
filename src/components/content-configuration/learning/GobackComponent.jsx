import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import assessmenticon from "../../../assets/assessmenticon.svg";
import { useContext } from 'react';

const GobackComponent = () => {
    const navigate = useNavigate()
    const start_assessment = () => {
        navigate("/assessments");
    };
    const { subjectcontext, updateSubjectContext } = useContext(
        Subject_Chapter_Topic
    );


    return (
        <div className="landing__videoClassScreenContainer__TopPart">
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
        </div>
    )
}

export default GobackComponent
