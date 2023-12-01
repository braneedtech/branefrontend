// CustomPopup.js
import React from 'react';
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import cancelicon from "../../../assets/multiply.png";
import './popup.css'
const NotificationPopup = ({ onClose }) => {
  // Generate random messages for the popup
  const { student } = StudentDetailsCustomHook();
  let profile_info = student;
  console.log(profile_info)
  const messages = [
    `Hey ${profile_info['student_name']},we noticed a gap in your study schedule. According to your timetable, you are falling behind.`,
    'Exciting News! Our new Learning Network is set to launch very soon.',
  ];

  return (
    <div className="custom-popup1">
      <div className="popup-content">
        <div style={{display:'flex',justifyContent:'flex-end',fontSize:'1.5rem',paddingBottom:'1rem'}}>
        <span style={{paddingRight:'39%',color:'#5d33a2'}}>Notifications</span>
        <span className="popup-close" onClick={onClose}>
        <img src={cancelicon} alt="Close" style={{ cursor: 'pointer',height:'1.5rem',width:'1.5rem'}} />
        </span>
        </div>
        <div style={{fontWeight:'500'}}>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
