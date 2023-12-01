import React from 'react';
import aboutusimg from '../../assets/aboutusimg.svg'
import './about.css'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
const AboutUs = () => {
    const navigate = useNavigate()
    const getstartedClick = () =>{
        navigate("/signup")
    }
    return (
        <>
            <Header homepage_header={{
                "nav_links": [
                    "Home",
                    "About",
                    "Contact",
                    "For Parents",
                    "Patents"
                ],
                "brane_logo": "https://braneeducation.s3.ap-south-1.amazonaws.com/Homepage_images/logo/brane-white.svg"
            }} />
            <div className='about__wrapper'>
                <div className='about'>
                    <div className='about__container'>
                        <h1>About Us</h1>
                        <h2>Don't limit yourself to learning</h2>
                        <p>Welcome to Brane Education Platform, where we're revolutionizing education for Industry 4.0. Founded by passionate educators and tech enthusiasts, we're on a mission to deliver immersive, concept-based learning experiences. From AI to advanced robotics, we break the mold with games, animations, and simulations, making education enjoyable. Our innovative voice-controlled interface ensures accessibility for all. Join us in reshaping the future—education should be an adventure, and we're here to make it happen. Sign up today and be part of the evolution.</p>
                        <div className='about__container--btn'>
                            <button
                                onClick={getstartedClick}
                            >Get Started</button>

                        </div>
                    </div>
                    <div className='about__image'>
                        <img src={aboutusimg} alt='aboutus image' />
                    </div>
                </div>
            </div>
        </>
    )
};
export default AboutUs;