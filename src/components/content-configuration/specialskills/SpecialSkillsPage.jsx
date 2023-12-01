import React, { useState } from 'react';
import { useContext } from 'react';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import '../sports/Sports.css';
import gobackicon from '../../../assets/gobackicon.png';
import brane_get_service from '../../../services/brane_get_service';
import { end_point } from '../../../constants/urls';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import TakeLessonNavbar from '../learning/Navbar2';
import loader from '../../../assets/loading/loader.gif'
import SpecialSkillsVideoComponent from './SpecialSkillsVideoComponent';
import InstructionsScreen from './InstructionsScreen';
import SpecialSkills from './SpecialSkills';

const SpecialSkillsPage = () => {
    const { subjectcontext } = useContext(Subject_Chapter_Topic);
    // const [contentType, setContentType] = useState('video');
    // const handleContentChange = (type) => {
    //     setContentType(type);
    // };

    // let navmenu = {}
    // let sports_data = {}

    // const { data, error, isLoading } = useQuery(
    //     [
    //         "sports_content_data",
    //         `${end_point}/sports-content?sports=${subjectcontext?.sports}&sports_name=${subjectcontext?.sports_name}`,
    //     ],
    //     brane_get_service
    // );
    // if (!isLoading && error == null) {
    //     const { data: alias } = data;
    //     const { portfolio_page_landing_menu } = alias;
    //     navmenu = portfolio_page_landing_menu;
    //     const { sports_content } = alias;
    //     sports_data = sports_content
    //     // sports_data = alias
    // }

    return (
        <>
            <div className="landing__Container">
                <TakeLessonNavbar navmenu={
                     [
                        {
                          "_id": "64f03e65aee64a0b717d698e",
                          "landingpage_nav_menu": [
                            {
                              "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/left_menu/Vector%402x.png",
                              "title": "Dashboard"
                            },
                            {
                              "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/left_menu/E-learning+(2).png",
                              "title": "General Search"
                            },
                            {
                              "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/left_menu/dynamic.png",
                              "title": "Dynamic TimeTable"
                            },
                            {
                              "image": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/left_menu/E-learning+(2).png",
                              "title": "Learning Network"
                            }
                          ],
                          "notifications_icon": "https://braneeducation.s3.ap-south-1.amazonaws.com/landing_page/nav_menu/notification+btn.png"
                        }
                      ]
                } />
                <div className="landing__Container__SportsScreen">
                    <div className="landing__Container__SportsScreen__TopPart">
                        <Link to={`/portfolio/specialskills/${subjectcontext?.specialskill}`} style={{ textDecoration: 'none' }}>
                            <div className="landing__Container__SportsScreen__control-button__back-button">
                            <i className="bi bi-arrow-left-circle" style={{fontSize:"1.5rem"}}></i>{" "}
                                Go Back
                            </div>
                        </Link>
                        <div>
                            <h2>{subjectcontext?.specialskill}</h2>
                        </div>
                    </div>
                    <InstructionsScreen />

                </div>
            </div>
        </>

    );
};

export default SpecialSkillsPage;
