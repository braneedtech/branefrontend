import React, { useContext } from 'react'
import failvideo from '../../../assets/fail.mp4'
import gobackicon from '../../../assets/gobackicon.png'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Subject_Chapter_Topic } from '../../context-api/Subject_Chapter_Topic'
const SpVideoContainer = () => {
    const { videourl } = useParams();
    const { subjectcontext } = useContext(Subject_Chapter_Topic)
    const { specialskill } = subjectcontext
    const decodedUrl = decodeURIComponent(videourl);
    return (
        <>
            <div
                className='landing__specialskills-VideoContainer__right'
            >
                <div className='landing__specialskills-VideoContainer__right__child1'>
                    <Link
                        to={`/portfolio/specialskills/${specialskill}`}
                        // to={`/portfolio/chapters/${subjectcontext.subject}`} 
                        style={{ textDecoration: "none" }}>
                        <div>
                            <i className="bi bi-arrow-left-circle" style={{ fontSize: "1.5rem" }}></i>{" "}
                            Go Back
                        </div>
                    </Link>
                </div>
                <div
                    className='landing__specialskills-VideoContainer__right__child2'
                >
                    <video src={decodedUrl} controls width="570"
                        height="320"></video>
                </div>
            </div>
        </>
    )
}

export default SpVideoContainer
