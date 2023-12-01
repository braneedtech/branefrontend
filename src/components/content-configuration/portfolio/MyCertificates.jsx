import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { end_point } from "../../../constants/urls.jsx";
import { useQuery } from "react-query";
import loader from "../../../assets/loading/loader.gif";
import brane_get_service from "../../../services/brane_get_service";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook.jsx";
import certificatenotfound from "../../../assets/certificatenotfound.svg"
 
const MyCertificates = () => {
    let certificateslength;
    const { student } = StudentDetailsCustomHook();
    const { data, error, isLoading } = useQuery(
        [
            "certificates",
            `${end_point}/certificate?mobileno=${student.mobileno}&childno=${student.childIndex}`,
        ],
        brane_get_service
    );
 
    let certificates_data = {};
    let certificates_list = []
 
    if (!isLoading && error == null) {
        const { data: alias } = data;
        certificates_data = alias;
        // console.log(certificates_data)
        if (certificates_data.isexists === false) {
            return (
                <div className="landing__mycertificates__NotFound">
                    <img src={certificatenotfound} alt="Not Found" />
                </div>
            );
        }
        certificates_data = certificates_data[0];
        certificates_list = certificates_data[`${student?.mobileno}_${student?.childIndex}`] || [];
        certificateslength = certificates_data[`${student?.mobileno}_${student?.childIndex}`].length
        localStorage.setItem("certificates_length", certificateslength)
    }
    // const downloadCertificate = (certificateLink) => {
    //     const link = document.createElement("a");
    //     link.href = certificateLink;
    //     link.download = "certificate.pdf"; // Set the desired filename here
    //     link.click();
    // };
 
    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__mycertificates">
                            {
                                certificates_list && (
                                    certificates_list.map((element, index) => (
                                        <div
                                            key={index}
                                            className="landing__mycertificates__list"
                                        >
                                            <div className="landing__mycertificates__list__name">
                                                {element?.subjectName} {" : "}
                                                {element?.chapterName} _
                                                {element?.topicName}_{element?.level}
                                            </div>
                                            <div
                                                className="landing__mycertificates__list__icons"
                                            >
                                                <button onClick={() => {
                                                    const link = document.createElement("a");
                                                    link.href = element?.certificatelink;
                                                    link.target = "_blank";
                                                    link.download = "certificate.pdf"; // You can set a custom filename here
                                                    link.click();
                                                }}>View</button>
                                                {/* <button onClick={() => {
                                                    downloadCertificate(element?.certificatelink)
                                                }}>Download</button> */}
                                                {/* <i
                                                    onClick={() => {
                                                        const link = document.createElement("a");
                                                        link.href = element?.certificatelink;
                                                        link.download = "certificate.pdf"; // You can set a custom filename here
                                                        link.click();
                                                    }}
                                                    className="bi bi-download"
                                                ></i> */}
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </>
                )
            ) : (
                <>
                    <img
                        src={loader}
                        alt="Error"
                        width={250}
                        height={250}
                        className="loader-content"
                    ></img>
                </>
            )}
        </>
    );
};
 
export default MyCertificates;