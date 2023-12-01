import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import loader from '../../../assets/loading/loader.gif';
import './specialskills.css';
import { useQuery } from 'react-query';
import { end_point } from '../../../constants/urls';
import brane_get_service from '../../../services/brane_get_service';

const SpecialSkills = () => {
    const { specialskills } = useParams()
    const { subjectcontext, updateSubjectContext } = useContext(Subject_Chapter_Topic);

    const handleLinkClick = (link) => {
        // Update the subject context when a link is clicked
        updateSubjectContext({
            specialskill: specialskills,
            skill_name: link,
        });
    };
    let specialskills_data = {}

    const { data, error, isLoading } = useQuery(
        [
            "specialskills_details_data",
            `${end_point}/specialskills-details?specialskills_details=${specialskills}`,
        ],
        brane_get_service
    );

    if (!isLoading && error == null) {
        const { data: alias } = data;
        specialskills_data = alias
    }

    return (
        <>
            {!isLoading ? (
                error != null ? (
                    <p>{JSON.stringify(error.message)}</p>
                ) : (
                    <>
                        <div className="landing__rightbox__content--breadcrum">
                            <span>Special Skills</span>
                            <i className="bi bi-caret-right-fill"></i>
                            <span>{specialskills}</span>
                        </div>
                        <div>
                            <ul className='landing__specialskills'>
                                {
                                    (specialskills_data && specialskills_data[`specialskills_${specialskills}`]) && (
                                        specialskills_data[`specialskills_${specialskills}`].map((ele, index) => (
                                            <li key={index}>
                                                <Link to={index === 0 ? '/levels' : index === 1 ? "/specialskills-improve" : '/specialskills-improve'}
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
                    <img src={loader} className="loader" alt="Error" width={200} height={200}></img>
                </>
            )}
        </>
    );
};

export default SpecialSkills;
