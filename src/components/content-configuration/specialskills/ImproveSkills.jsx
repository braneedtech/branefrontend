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

const ImproveSkills = () => {
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
        // console.log(content_types)

    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className='landing__specialskills-improveskills'>
                            <TakeLessonNavbar navmenu={landing_page_nav_menu} />
                            <div className='landing__specialskills-skillscontainer'>
                                <ul className='landing__specialskills-content__types'>
                                    {
                                        content_types && (
                                            // console.log(content_types[0].title)
                                            content_types.map((ele, index) => (
                                                <li key={index}>
                                                    <Link to={`/specialskills-improve/${encodeURIComponent(ele.video)}`}>{ele?.title}</Link>
                                                </li>
                                            ))
                                        )
                                    }
                                    
                                </ul>

                                <div className='landing__specialskills-VideoContainer'>
                                    <Outlet />
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
}

export default ImproveSkills
