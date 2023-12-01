import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationPopup from './Notificationpopup';

const Navbar = ({ navbar }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleNotificationClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const returnRoute = (index) =>{
    let route;
    switch(index){
      case 0:
        route = "/dashboard";
        break;
      case 1:
        route = "/portfolio/generalsearch"
        break;
      case 2:
        route = "/portfolio/dynamic-timetable"
        break;
      case 3:
        route = "/portfolio/learning-network"
        break;
      default:
        route = ""
    }
    return route
  }
  return (
    <>
      <div className="landing__rightbox__navbar__left">
        {navbar &&
          navbar[0] &&
          navbar[0]?.landingpage_nav_menu &&
          navbar[0].landingpage_nav_menu.map((ele, index) => (
            <span key={index}>
              <img src={ele.image} className="navicons" alt={`${ele.title} icon`} />
              <Link
                to={returnRoute(index)}
                className="navbar-option"
              >
                {ele.title}
              </Link>
            </span>
          ))}
      </div>
      <div className="landing__rightbox__navbar__right">
        <input type="text" className="landing__rightbox__navbar__right__searchbox" placeholder="Search" />
        <img src={navbar[0] ? navbar[0]?.notifications_icon : ""} alt="notification image" className="notiicon"
          onClick={handleNotificationClick}
        />
      </div>
      {showPopup && <NotificationPopup onClose={handleClosePopup} />}
    </>
  );
};

export default Navbar;
