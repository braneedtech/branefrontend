import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import brane_get_service from "../../../services/brane_get_service";
import { end_point } from "../../../constants/urls.jsx";
import { useQuery } from "react-query";
import loader from "../../../assets/loader.gif";
import "./Portfolio.css";
import Profile from "./Profile";
import Logout from "./Logout";
import FreshNavbar from "./Navbar";
import Accordion from "react-bootstrap/Accordion";
import network_error from "../../../assets/network_error.gif";
import { encrypt_secrete_key } from "../../../constants/urls";
import CryptoJS from "crypto-js";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import AccordionData from "./AccordionData";
import { Subject_Chapter_Topic } from "../../context-api/Subject_Chapter_Topic";
import Subject_Chapter_Topic_CustomHook from "../../context-api/Subject_Chapter_Topic_CustomHook";
const Portfolio = ({ updateLoginStatus, activeKey, setActiveKey,triggerLogout }) => {
  const { student } = StudentDetailsCustomHook();
  let profile_info = student;
  let portfolio_data = [];
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const location = useLocation();
  const greeting_message =
    currentHour >= 7 && currentHour <= 12
      ? "Good Morning"
      : currentHour > 12 && currentHour <= 4
      ? "Good Afternoon"
      : "Good Evening";

  const encryptedDataFromStorage = localStorage.getItem("login_details");
  if (encryptedDataFromStorage != null) {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedDataFromStorage,
      encrypt_secrete_key
    ).toString(CryptoJS.enc.Utf8);
    profile_info = JSON.parse(decryptedData);
  }
  const [formStyle, setFormStyle] = useState({ padding: "1.4rem" });

  useEffect(() => {
    if (location.pathname.includes("/portfolio/generalsearch")) {
      setFormStyle({ padding: "0px" });
    } else {
      setFormStyle({ padding: "1.4rem" });
    }
  }, [location]);

  let subjects = {};
  let skills = {};
  let sports_portfolio = {};
  let health_tips = {};
  let lifes_skills = {};
  let account = {};
  let loggedout = {};
  let navbar = {};
  let language_lab_data = {};
  let fine_arts_data = {}

  let platform_data = {};
  let certificate_length;
  const { data, error, isLoading } = useQuery(
    [
      "portfolio_page",
      `${end_point}/portfolio?curriculum=${profile_info.curriculum}&medium_of_instruction=${profile_info.medium_of_instruction}&schooling=${profile_info.schooling}&mobileno=${profile_info.mobileno}&childno=${profile_info.childIndex}`,
    ],
    brane_get_service
  );
  if (!isLoading && error == null) {
    const { data: alias } = data;
    const { filtered_subjects } = alias;
    subjects = filtered_subjects;
    const { special_skills } = alias;
    skills = special_skills.special_skills;
    const { sports } = alias;
    sports_portfolio = sports.sports;
    const { health } = alias;
    health_tips = health.health;
    const { life_skills } = alias;
    lifes_skills = life_skills.life;
    const { language_lab } = alias;
    language_lab_data = language_lab.language_lab;
    const { my_account } = alias;
    account = my_account.my_acc;
    const { logout } = alias;
    loggedout = logout;
    const { landing_page_nav_menu } = alias;
    navbar = landing_page_nav_menu;
    const { platform } = alias;
    platform_data = platform;
    const {fine_arts} = alias;
    fine_arts_data = fine_arts.fine_arts;
    portfolio_data.push(
      {
        icon: subjects?.icon,
        title: subjects?.title,
        content:
          subjects[
            `${profile_info.curriculum}_${profile_info.medium_of_instruction}_${profile_info.schooling}`
          ],
      },
      {
        icon: lifes_skills?.icon,
        title: lifes_skills?.title,
        content: lifes_skills?.life_skills,
      },
      {
        icon: health_tips?.icon,
        title: health_tips?.title,
        content: health_tips?.health,
      },
      {
        icon: platform_data?.icon,
        title: platform_data?.title,
        content: platform_data?.platform?.platform,
      },
      {
        icon: skills?.icon,
        title: skills?.title,
        content: skills?.special_skills,
      },
      {
        icon: sports_portfolio?.icon,
        title: sports_portfolio?.title,
        content: sports_portfolio?.sports,
      },
      
      {
        icon: language_lab_data?.icon,
        title: language_lab_data?.title,
        content: language_lab_data?.language_lab,
      },
      {
        icon: fine_arts_data?.icon,
        title: fine_arts_data?.title,
        content: fine_arts_data?.fine_arts,
      },
      {
        icon: account?.icon,
        title: account?.title,
        content: account?.my_account,
      }
    );
    const { certificate_count } = alias;
    certificate_length = certificate_count;
  }

  return (
    <>
      {/* <Subject_Chapter_Topic.Provider value="hello" > */}

      {!isLoading ? (
        error != null ? (
          <>
            <img src={network_error} alt="Error" className="loader"></img>
          </>
        ) : (
          <>
            <div className="landing">
              <div className="landing__leftbox">
                <Profile profile_info={profile_info}></Profile>
                <div className="landing__leftbox__accordionsection">
                  <AccordionData
                    portfolio_data={portfolio_data}
                    certificate_count={certificate_length}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                  />
                </div>
                <hr />
                <Logout
                  loggedout={loggedout}
                  updateLoginStatus={updateLoginStatus}
                  triggerLogout={triggerLogout}

                />
              </div>
              <div className="landing__rightbox">
                <div className="landing__rightbox__navbar">
                  <FreshNavbar navbar={navbar}></FreshNavbar>
                </div>
                <div className="landing__rightbox__content" style={formStyle}>
                  <Outlet />
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <img
            src={loader}
            alt="Error"
            width={200}
            height={200}
            className="loader"
          ></img>
        </>
      )}
      {/* </Subject_Chapter_Topic.Provider> */}
    </>
  );
};
export default Portfolio;
