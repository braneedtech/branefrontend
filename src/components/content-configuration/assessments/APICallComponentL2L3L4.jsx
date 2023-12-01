import React, { useContext } from "react";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls";
import loader from "../../../assets/loader.gif";
import network_error from "../../../assets/network_error.gif";
import { useQuery } from "react-query";
import Questions from "./Questions";
import branelogo from "../../../assets/Branenewlogo.png"
import DisplayCertificate from "./DisplayCertificate";
import { useNavigate, Link } from 'react-router-dom'
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import Instructions from "./Instructions";

function APICallComponentL2L3L4() {
    const navigate = useNavigate();
    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { student } = StudentDetailsCustomHook()
    const { data, error, isLoading } = useQuery(
        ['assessments', `${end_point}/assessments?mobileno=${student.mobileno}&childIndex=${student.childIndex}&curriculum=${student.curriculum}&medium_of_instruction=${student.medium_of_instruction}&schooling=${student.schooling}&subject=${subjectcontext.subject}&chapter=${subjectcontext.chapter}&topic=${subjectcontext.topic}&level=${subjectcontext?.level}`],
        brane_get_service
    );

    let assessment_questions = [];
    let hasMessage = false;

    if (error == null && !isLoading) {
        const { data: alias_data } = data;
        if ('message' in alias_data) {
            // Data contains a message
            hasMessage = true;
        } else {
            // Data contains questions
            const { questions } = alias_data;
            assessment_questions = questions;
        }
    }

    return (
        <>
            {isLoading && (
                <img src={loader} alt="Loading..." width={200} height={200} className="loader" />
            )}

            {error && (
                <img src={network_error} alt="Network Error" width={200} height={200} className="loader" />
            )}

            {!isLoading && !error && (
                <>
                    {hasMessage ? (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div className="StickyHeader">
                                    <div className="BraneLogo">
                                        <img src={branelogo} alt="Brane Logo" />
                                    </div>
                                </div>
                                <div
                                    className='certificate_buttons'
                                    style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="GoBackButton">
                                        <Link
                                            to={`/assessments`}
                                        >
                                            <div style={{ padding: "0 1vw" }}>
                                                <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                                Go Back
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div style={{ width: "100%", padding: "0 1rem" }}>
                                    <iframe src={data?.data?.s3Url} width="100%" height={450} ></iframe>
                                </div>

                            </div>
                        </>

                    ) : (
                        <Instructions assessment_questions={assessment_questions} />
                    )}
                </>
            )}
        </>
    );
}

export default APICallComponentL2L3L4;