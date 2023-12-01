import React, { useState, useEffect } from 'react';
import './Download.css';
import image1 from '../../assets/img.svg'
import image2 from '../../assets/img2.png'
import image3 from '../../assets/img3.png'
import image4 from '../../assets/img4.png'
const Downloads = () => {
    const [studentsCount, setStudentsCount] = useState(84457);

    useEffect(() => {
      const interval = setInterval(() => {
        setStudentsCount((prevCount) => prevCount + 1);
      }, 10); 
  
      return () => {
        clearInterval(interval); 
      };
    }, []);
  



  return (
<section id="next-section">
    <div className="app1">
      <div className="example img1">
        <img src={image1}alt="Image" />
        {/* <p>10M+ <br></br> Students</p> */}
        <p> 
        <span className="highlight">{studentsCount}+</span> <br /> Students
        {/* {studentsCount}+<br /> Students */}
        </p> 
    
      </div>
      <div className="example img2">
        <img src={image2} alt="Image" />
        <p>
        <span className="highlight">4.8+</span> <br /> App Rating
        </p>
      </div>
      <div className="example">
        <img src={image3} alt="Image" />
        <p>
        <span className="highlight">3.5M+</span> <br /> Hours of Lectures
        </p>
      </div>
      <div className="example img4">
        <img src={image4} alt="Image" />
        <p>
        <span className="highlight">1500+ cities</span> <br /> India wide
        </p>
      </div>
    </div>
    </section>
  );
};

export default Downloads;
