import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ profile_info }) => {
  const navigate = useNavigate()
  const getInitials = (name) => {
    // Extract the first letter of each word in the name
    const initials = name.split(" ").map((word) => word[0]).join("");
    return initials.toUpperCase();
  };

  const renderProfileImage = () => {
    // If there is a profile image, display it
    if (profile_info['profile_img']) {
      return (
        <img
          src={profile_info['profile_img']}
          className="landing__leftbox__portfolio__profile__userimage"
          alt="Profile"
        />
      );
    }

    // If there is no profile image, display the first letter with a background color
    const initials = getInitials(profile_info['student_name']);
    return (
      <div
        className="landing__leftbox__portfolio__profile__initials"
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      <div className="landing__leftbox__portfolio__profile">
        <img
          src="https://braneeducation.s3.ap-south-1.amazonaws.com/Homepage_images/logo/Branenewlogo.png"
          className="landing__leftbox__portfolio__profile__branelogo"
          alt="Brane Logo"
          onClick = {()=>navigate('')}
        />
        {renderProfileImage()}
        <span className="landing__leftbox__portfolio__profile__username">{profile_info['student_name']}</span>
        <span className="landing__leftbox__portfolio__profile__userclass">{profile_info['schooling']}</span>
        <div className="landing__leftbox__portfolio__profile__line"></div>
      </div>
    </>
  );
};

export default Profile;
