import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { end_point } from "../../../constants/urls.jsx";
import { useQuery } from "react-query";
import loader from "../../../assets/loading/loader.gif";
import brane_get_service from "../../../services/brane_get_service";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook.jsx";

const SubscriptionDetails = () => {
    const { student } = StudentDetailsCustomHook();
    const navigate = useNavigate()
    const { data, error, isLoading } = useQuery(
        [
            "subscribe-details",
            `${end_point}/subscribe-details?mobileno=${student.mobileno}&childIndex=${student.childIndex}`,
        ],
        brane_get_service
    );

    let subscribe_details = {};

    if (!isLoading && error == null) {
        const { data: alias } = data;
        if (alias.success) {
            subscribe_details = alias?.subscribe_details
        }
    }


    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__subscription">
                            <div className="landing__subscriptiondetails">
                                <div className="landing__subscriptiondetails__content">
                                    <div className="landing__subscriptiondetails__content-title">
                                        Name of the Subscriber
                                    </div>
                                    <div>: &nbsp;&nbsp;</div>
                                    <div className="landing__subscriptiondetails__content-value">
                                        {
                                            student ? student?.student_name : ""
                                        }
                                    </div>
                                </div>
                                <div className="landing__subscriptiondetails__content">

                                    <div className="landing__subscriptiondetails__content-title">
                                        Subscription Start Date</div>
                                    <div>: &nbsp;&nbsp;</div>

                                    <div className="landing__subscriptiondetails__content-value">
                                        {
                                            subscribe_details ? subscribe_details.subscribe_data : ""
                                        }
                                    </div>
                                </div>
                                <div className="landing__subscriptiondetails__content">
                                    <div className="landing__subscriptiondetails__content-title">Subscription End Date</div>
                                    <div>: &nbsp;&nbsp;</div>

                                    <div className="landing__subscriptiondetails__content-value">
                                        {
                                            subscribe_details ? subscribe_details.end_date : ""
                                        }
                                    </div>
                                </div>
                                <div className="landing__subscriptiondetails__content">
                                    <div className="landing__subscriptiondetails__content-title"> Your Current Plan </div>
                                    <div>: &nbsp;&nbsp;</div>

                                    <div className="landing__subscriptiondetails__content-value">
                                        {
                                            subscribe_details ? subscribe_details.tier : ""
                                        }
                                    </div>
                                </div>
                                <div className="landing__subscriptiondetails__button">
                                    <button onClick={()=>navigate(`/subscription/${student?.mobileno}`)}>
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
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

export default SubscriptionDetails;