import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './lifeskills.css';
import { end_point } from '../../../constants/urls';
import brane_get_service from '../../../services/brane_get_service';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import loader from '../../../assets/loading/loader.gif'

const LifeSkills = () => {
  const { lifeskill } = useParams();
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );

  // // Use useEffect to set sports only once when the component mounts
  // useEffect(() => {
  //   if (!subjectcontext.sports) {
  //     updateSubjectContext({
  //       lifeskill: lifeskill,
  //     });
  //   }
  // }, [subjectcontext.lifeskill, lifeskill, updateSubjectContext]);

  const handleLinkClick = (link) => {
    // Optionally, you can update additional information based on the link clicked
    updateSubjectContext({
      lifeskill: lifeskill,
      lifeskill_name: link,
    });
  };

  let lifeskills_data = {}

  const { data, error, isLoading } = useQuery(
    [
      "lifeskills_data",
      `${end_point}/lifeskills-details?lifeskill=${lifeskill}`,
    ],
    brane_get_service
  );
  if (!isLoading && error == null) {
    const { data: alias } = data;
    lifeskills_data = alias
  }

  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <>
            <div className="landing__rightbox__content--breadcrum">
              <span>Life Skills</span>
              <i className="bi bi-caret-right-fill"></i>
              <span>{lifeskill}</span>
            </div>
            <div>
              <ul className='landing__lifeskills'>
                {
                  (lifeskills_data && lifeskills_data[`lifeskills_${lifeskill}`]) && (
                    lifeskills_data[`lifeskills_${lifeskill}`].map((ele, index) => (
                      <li key={index}>
                        <Link to='/lifeskillspage' onClick={() => handleLinkClick(ele)}>
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

  );
};

export default LifeSkills;
