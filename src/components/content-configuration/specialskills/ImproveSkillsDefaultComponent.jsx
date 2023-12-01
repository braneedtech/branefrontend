import React, { useContext } from 'react'
import './specialskills.css'
import TakeLessonNavbar from '../learning/Navbar2'
import { Link, Outlet } from 'react-router-dom'
import brane_get_service from '../../../services/brane_get_service'
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { end_point } from '../../../constants/urls';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic'
import loader from "../../../assets/loading/loader.gif"
import gobackicon from '../../../assets/gobackicon.png'


const ImproveSkillsDefaultComponent = () => {
    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { specialskill } = subjectcontext
    const { data, error, isLoading } = useQuery(
        [
            "specialskills_improveskills",
            `${end_point}/specialskills-improve?specialskills_details=${specialskill}`,
        ],
        brane_get_service
    );
    let content_types;
    let landing_page_nav_menu = {}
    if (!isLoading && error == null) {
        const { data: alias } = data;
        landing_page_nav_menu = alias["landing_page_nav_menu"] || []
        content_types = alias[`specialskills_improve_${specialskill}`] || []

    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div
                            className='landing__specialskills-VideoContainer__right'
                        >
                            <div className='landing__specialskills-VideoContainer__right__child1'>
                                <Link
                                    to={`/portfolio/specialskills/${specialskill}`}
                                    style={{ textDecoration: "none" }}>
                                    <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: ".25rem"
                                    }}>
                                        <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                        Go Back
                                    </div>
                                </Link>
                            </div>
                            <div
                                className='landing__specialskills-VideoContainer__right__child2'
                            >
                                <video src={content_types[0]?.video} controls width="570"
                                    height="320"></video>
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
}

export default ImproveSkillsDefaultComponent
