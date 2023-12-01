import React from 'react'
import TakeLessonNavbar from '../learning/Navbar2'
import { useContext } from 'react'
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic'
import { Link } from 'react-router-dom'
import fail from '../../../assets/fail.mp4'
import mental from "../../../assets/mental.png"
import brane_get_service from '../../../services/brane_get_service'
import { end_point } from '../../../constants/urls'
import { useQuery } from 'react-query'
import loader from "../../../assets/loading/loader.gif"


const ExpertsVideos = () => {

    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { health, health_name } = subjectcontext
    let navmenu = {}
    let health_data = {}
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
        // sports_data = alias
    }
    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className='landing__lifeskills__container'>
                            <TakeLessonNavbar
                                navmenu={navmenu}
                            />
                            <div className="landing__lifeskills__container__content">
                                <div className="landing__lifeskills__container__content__TopPart">
                                    <Link to={`/portfolio/health/${health}`} style={{ textDecoration: 'none' }}>
                                        <div className="landing__lifeskills__container__content__TopPart__backbtn">
                                            <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                            Go Back
                                        </div>
                                    </Link>
                                    <div>
                                        <h2>{health}</h2>
                                    </div>
                                    <div style={{ visibility: "hidden" }}>
                                        hidinglifeskill
                                    </div>
                                </div>
                                <div className="landing__lifeskills__container__content__videocontainer">
                                    {
                                        health_data && (
                                            health_data.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="landing__lifeskills__container__content__videocontainer-item"
                                                >
                                                    <video controls
                                                        poster={item?.thumbnail}
                                                    >
                                                        <source src={item?.video} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    <div>
                                                        {item?.title}
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    }

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
    )
}

export default ExpertsVideos
