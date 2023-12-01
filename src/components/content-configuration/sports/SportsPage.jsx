import React, { useState } from 'react';
import { useContext } from 'react';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import './Sports.css';
import gobackicon from '../../../assets/gobackicon.png';
import brane_get_service from '../../../services/brane_get_service';
import { end_point } from '../../../constants/urls';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import TakeLessonNavbar from '../learning/Navbar2';
import loader from '../../../assets/loading/loader.gif'

const SportsPage = () => {
    const { subjectcontext } = useContext(Subject_Chapter_Topic);
    const [contentType, setContentType] = useState('video');
    const handleContentChange = (type) => {
        setContentType(type);
    };

    let navmenu = {}
    let sports_data = {}

    const { data, error, isLoading } = useQuery(
        [
            "sports_content_data",
            `${end_point}/sports-content?sports=${subjectcontext?.sports}&sports_name=${subjectcontext?.sports_name}`,
        ],
        brane_get_service
    );
    if (!isLoading && error == null) {
        const { data: alias } = data;
        const { portfolio_page_landing_menu } = alias;
        navmenu = portfolio_page_landing_menu;
        const { sports_content } = alias;
        sports_data = sports_content
        
        // sports_data = alias
    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__Container">
                            <TakeLessonNavbar navmenu={navmenu} />
                            <div className="landing__Container__SportsScreen">
                                <div className="landing__Container__SportsScreen__TopPart">
                                    <Link to={`/portfolio/sports/${subjectcontext?.sports}`} style={{ textDecoration: 'none' }}>
                                        <div className="landing__Container__SportsScreen__control-button__back-button">
                                        <i className="bi bi-arrow-left-circle" style={{fontSize:"1.5rem"}}></i>{" "}
                                         Go Back
                                        </div>
                                    </Link>
                                    <div>
                                        <h2>{subjectcontext?.sports}</h2>
                                    </div>
                                </div>
                                {/* <div className="landing__Container__SportsScreen__TopPart1">
                </div> */}
                                <div className="landing__Container__SportsScreen__Mid">
                                    <button onClick={() => handleContentChange('video')}>Video</button>
                                    <button onClick={() => handleContentChange('pdf')}>PDF</button>
                                </div>
                                <div className="landing__Container__SportsScreen__Midpart">
                                    {contentType === 'video' ? (
                                        <video
                                            id="my-video"
                                            className="video-js-topic"
                                            controls
                                            preload="auto"
                                            width="700"
                                            height="390"
                                            src={sports_data?.video}
                                            data-setup="{}"
                                            poster={sports_data?.thumbnail}
                                        >
                                            <p className="landing__Container__SportsScreen__vjs-no-js-topic">
                                                To view this video, please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video player
                                            </p>
                                        </video>
                                    ) : (
                                        <iframe src={sports_data?.pdf}></iframe>
                                    )}
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

export default SportsPage;
