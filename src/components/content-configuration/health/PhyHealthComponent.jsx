import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import { end_point } from '../../../constants/urls';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import brane_get_service from '../../../services/brane_get_service';
import loader from "../../../assets/loading/loader.gif"

const PhyHealthComponent = () => {
    const { item } = useParams()
    const [activeTab, setActiveTab] = useState('problem');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { health, health_name } = subjectcontext
    let navmenu = {}
    let health_data = {}
    let foundObject = {};
    let title;
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
        foundObject = health_data.find(obj => item in obj);
        console.log(foundObject)
        // sports_data = alias
    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <div className='landing__health__container__content'>
                        <div className='landing__health__container__content__breadcrum'>
                            Health & Wellness <i className="bi bi-caret-right-fill"></i>
                            {health} <i className="bi bi-caret-right-fill"></i>
                            {health_name}
                        </div>
                        <div className="landing__health__container__content__TopPart">
                            <Link to={`/portfolio/health/${health}`} style={{ textDecoration: 'none' }}>
                                <div className="landing__health__container__content__TopPart__backbtn">
                                    <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                                    Go Back
                                </div>
                            </Link>
                            <div>
                                <h2>{item}</h2>
                            </div>
                            <div style={{ visibility: "hidden" }}>
                                hidinglifeskill
                            </div>
                        </div>
                        <div className='landing__health__container__content__buttons'>
                            <button onClick={() => handleTabClick('problem')} className={activeTab === 'problem' ? 'active' : ''}>
                                Problems
                            </button>
                            <button onClick={() => handleTabClick('solution')} className={activeTab === 'solution' ? 'active' : ''}>
                                Experts Advice
                            </button>
                            <button onClick={() => handleTabClick('pdf')} className={activeTab === 'pdf' ? 'active' : ''}>
                                PDF
                            </button>
                        </div>
                        <div className='landing__health__container__content__tab-content'>
                            {activeTab === 'problem' && (
                                <div className='landing__health__container__content__videocontainer'>
                                    <video
                                        poster={foundObject[item]?.problem?.thumbnail}
                                        controls>
                                        <source
                                            src={foundObject[item]?.problem?.video}
                                            type='video/mp4'
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            {activeTab === 'solution' && (
                                <div className='landing__health__container__content__videocontainer'>
                                    <video
                                        poster={foundObject[item]?.solution?.thumbnail}
                                        controls
                                    >
                                        <source
                                            src={foundObject[item]?.solution?.video}
                                            type='video/mp4'
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {activeTab === 'pdf' && (
                                <div className='landing__health__container__content__videocontainer'>
                                    <iframe title='pdf-frame'
                                        src={foundObject[item]?.pdf?.url}
                                        width='100%' height='380px'
                                        style={{ paddingBottom: "2vh" }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )
            ) : (
                <>
                    <img src={loader} alt="Error" width={200} height={200}></img>
                </>
            )}
        </>
    );
};

export default PhyHealthComponent;
