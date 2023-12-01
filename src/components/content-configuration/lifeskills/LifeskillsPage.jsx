import React from 'react'
import TakeLessonNavbar from '../learning/Navbar2'
import { useContext } from 'react'
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic'
import { Link } from 'react-router-dom'
import brane_get_service from '../../../services/brane_get_service'
import { end_point } from '../../../constants/urls'
import { useQuery } from 'react-query'
import loader from "../../../assets/loading/loader.gif"


const LifeskillsPage = () => {

    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { lifeskill, lifeskill_name } = subjectcontext
    let navmenu = {}
    let lifeskills_data = {}
    // let landing

    const { data, error, isLoading } = useQuery(
        [
            "lifeskills_content_data",
            `${end_point}/lifeskills-content?lifeskill=${lifeskill}&lifeskill_name=${lifeskill_name}`,
        ],
        brane_get_service
    );
    if (!isLoading && error == null) {
        const { data: alias } = data;
        const { portfolio_page_landing_menu } = alias;
        navmenu = portfolio_page_landing_menu;
        const { lifeskills_content } = alias;
        lifeskills_data = lifeskills_content
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
                                    <Link to={`/portfolio/lifeskills/${lifeskill}`} style={{ textDecoration: 'none' }}>
                                        <div className="landing__lifeskills__container__content__TopPart__backbtn">
                                            <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                            Go Back
                                        </div>
                                    </Link>
                                    <div>
                                        <h2>{lifeskill}</h2>
                                    </div>
                                    <div style={{ visibility: "hidden" }}>
                                        hidinglifeskill
                                    </div>
                                </div>
                                <div className="landing__lifeskills__container__content__videocontainer">
                                    {
                                        lifeskills_data && (
                                            lifeskills_data.map((item, index) => (
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

export default LifeskillsPage
