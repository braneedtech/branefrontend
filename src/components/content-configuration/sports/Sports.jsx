import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Sports.css';
import { end_point } from '../../../constants/urls';
import brane_get_service from '../../../services/brane_get_service';
import { useQuery } from 'react-query';
import { useContext, useEffect } from 'react';
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic';
import loader from '../../../assets/loading/loader.gif'

const Sports = () => {
  const { sports } = useParams();
  const { subjectcontext, updateSubjectContext } = useContext(
    Subject_Chapter_Topic
  );

  // Use useEffect to set sports only once when the component mounts
  // useEffect(() => {
  //   if (!subjectcontext.sports) {
  //     updateSubjectContext({
  //       sports: sports,
  //     });
  //   }
  // }, [subjectcontext.sports, sports, updateSubjectContext]);

  const handleLinkClick = (link) => {
    // Optionally, you can update additional information based on the link clicked
    updateSubjectContext({
      sports: sports,
      sports_name: link,
    });
  };

  let sports_data = {}

  const { data, error, isLoading } = useQuery(
    [
      "sports_data",
      `${end_point}/sports-details?sports=${sports}`,
    ],
    brane_get_service
  );
  if (!isLoading && error == null) {
    const { data: alias } = data;
    sports_data = alias
  }

  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <>
            <div className="landing__rightbox__content--breadcrum">
              <span>Sports</span>
              <i className="bi bi-caret-right-fill"></i>
              <span>{sports}</span>
            </div>
            <div>
              <ul className='landing__sports'>
                {
                  (sports_data && sports_data[`sports_${sports}`]) && (
                    sports_data[`sports_${sports}`].map((ele, index) => (
                      <li key={index}>
                        <Link to='/sportspage' onClick={() => handleLinkClick(ele)}>
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

export default Sports;
