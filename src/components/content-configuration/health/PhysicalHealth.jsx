import React from 'react'
import TakeLessonNavbar from '../learning/Navbar2'
import { Link, Outlet } from 'react-router-dom'
import HealthContainer from './HealthContainer'
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic'
import { useQuery } from 'react-query'
import { useContext } from 'react'
import brane_get_service from '../../../services/brane_get_service'
import { end_point } from '../../../constants/urls'
import loader from "../../../assets/loading/loader.gif"
const PhysicalHealth = () => {

    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { health, health_name } = subjectcontext
    let navmenu = {}
    let health_data = {}
    let sidemenuData = []
    // let landing

    const { data, error, isLoading } = useQuery(
        [
            "health_content_data",
            `${end_point}/health-content?health=${health}&health_name=${health_name}`,
        ],
        brane_get_service
    );
    if (!isLoading && error == null) {
        const { data: alias } = data;
        const { portfolio_page_landing_menu } = alias;
        navmenu = portfolio_page_landing_menu;
        const { health_content } = alias;
        health_data = health_content

        // Iterate over each object in the array
        for (const obj of health_data) {
            // Iterate over the keys in each object
            for (const key in obj) {
                // Store the key in the array
                sidemenuData.push(key);
            }
        }
    }

    return (

        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <div className='landing__health__container'>
                        <TakeLessonNavbar
                            navmenu={navmenu}
                        />
                        <div className='landing__health__container__physicalhealth'>
                            <div className='landing__health__container__physicalhealth__sidebar'>
                                <ul>
                                    {
                                        sidemenuData && (
                                            sidemenuData.map((ele, ind) => (
                                                <li key={ind}>
                                                    <Link to={`/physical-health/${ele}`}>
                                                        {ele}
                                                    </Link>
                                
                                                </li>
                                            ))
                                        )
                                    }
                                </ul>
                            </div>
                            <Outlet />
                        </div>
                    </div>
                )
            ) : (
                <>
                    <img src={loader} alt="Error" width={200} height={200}></img>
                </>
            )}
        </>
    )
}

export default PhysicalHealth
