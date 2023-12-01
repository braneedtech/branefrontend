import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './health.css';
import { end_point } from '../../../constants/urls';
import brane_get_service from '../../../services/brane_get_service';
import { useQuery } from 'react-query';
import { useContext, useEffect } from 'react';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import loader from '../../../assets/loading/loader.gif'

const Health = () => {
    const { health } = useParams();
    const { subjectcontext, updateSubjectContext } = useContext(
        Subject_Chapter_Topic
    );

    const handleLinkClick = (link) => {
        // Optionally, you can update additional information based on the link clicked
        updateSubjectContext({
            health: health,
            health_name: link,
        });
    };

    let health_data = {}

    const { data, error, isLoading } = useQuery(
        [
            "health_data",
            `${end_point}/health-details?health=${health}`,
        ],
        brane_get_service
    );
    if (!isLoading && error == null) {
        const { data: alias } = data;
        health_data = alias
    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__rightbox__content--breadcrum">
                            <span>Health & Wellness</span>
                            <i className="bi bi-caret-right-fill"></i>
                            <span>{health}</span>
                        </div>
                        <div>
                            <ul className='landing__sports'>
                                {
                                    (health_data && health_data[`health_${health}`]) && (
                                        health_data[`health_${health}`].map((ele, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={ele === "Experts Advice" ? "/health-experts-videos" : "/physical-health"}
                                                    onClick={() => handleLinkClick(ele)}>
                                                    {ele}
                                                </Link>
                                            </li>
                                        ))
                                    )
                                }
                            </ul>
                        </div>
                    </>
                )
            ) : (
                <>
                    <img src={loader} alt="Error" width={200} height={200}></img>
                </>
            )}
        </>
        // <>
        //     <div>
        //         <ul className='landing__health'>
        //             <li>
        //                 <Link
        //                 // to='/sportspage'
        //                 // onClick={() => handleLinkClick(ele)}
        //                 >
        //                     Video's
        //                 </Link>
        //             </li>
        //             <li>
        //                 <Link
        //                 // to='/sportspage'
        //                 // onClick={() => handleLinkClick(ele)}
        //                 >
        //                     Experts Advice
        //                 </Link>
        //             </li>
        //             <li>
        //                 <Link
        //                 // to='/sportspage'
        //                 // onClick={() => handleLinkClick(ele)}
        //                 >
        //                     PDF
        //                 </Link>
        //             </li>
        //             <li>
        //                 <Link
        //                 // to='/sportspage'
        //                 // onClick={() => handleLinkClick(ele)}
        //                 >
        //                     Test your skills
        //                 </Link>
        //             </li>
        //         </ul>
        //     </div>
        // </>

    );
};

export default Health;
