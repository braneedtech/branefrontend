import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, NavLink } from "react-router-dom";
import "./signin.css";
import branelogo from "../../assets/brane-white.svg";
import booksvg from "../../assets/floatingsvg/book.svg";
import pencil from "../../assets/floatingsvg/pencilicon.svg";
import structure from "../../assets/floatingsvg/structure.svg";
import openbook from "../../assets/floatingsvg/openbook.svg";
import writingpad from "../../assets/floatingsvg/writingpad.svg";
import compass from "../../assets/floatingsvg/compass.png";
import closebook from "../../assets/floatingsvg/2dbook.svg";
import bulb from "../../assets/floatingsvg/bulb.svg";
import flask from "../../assets/floatingsvg/flask.svg";
import microscope from "../../assets/floatingsvg/Microscope.svg";
import structure3 from "../../assets/floatingsvg/structure3.svg";
import swirlblue from "../../assets/swril-white.svg";

const SigninForm = () => {
  const location = useLocation();

  useEffect(() => {
    // Update the tabPosition state based on the current route
    const pathname = location.pathname;
    if (pathname === "/login/mobile") {
      setTabPosition("left");
    } else if (pathname === "/login/faceid") {
      setTabPosition("center");
    } else if (pathname === "/login/voiceid") {
      setTabPosition("right");
    }
  }, [location.pathname]); // Re-run this effect when the pathname changes
  const [tabPosition, setTabPosition] = useState("left");
  // Applying background color based on the current route
  const formStyle =
    location.pathname.includes("mobile") ||
    location.pathname === "/login" ||
    location.pathname === "/login/"
      ? {
          backgroundColor: "transparent",
          marginTop: "5rem",
          gap: "2rem",
          borderStyle: "none",
          boxShadow: "none",
        }
      : {
        backgroundColor: "white",
        top: 0,
          width: "37%",
          boxShadow: "0px 2px 13px 4px rgba(176, 176, 176, 0.48)",
        };

  // Setting height for "signin__container__form__div" based on the current route
  const divStyle =
    location.pathname.includes("/login/faceid") ||
    location.pathname.includes("/login/voiceid")
      ? { height: "0" }
      : {};

  return (
    <section className="signin">
      <section className="signin__branelogo">
        <Link to="/">
          <img src={branelogo} alt="logo" />
        </Link>
      </section>
      <div className="signup__background">
        <img src={swirlblue} className="swirlbackground"></img>
      </div>
      <section className="signin__container">
        <div className="floatingsvgs">
          {/* <img src={booksvg} className="floating-svg1 "></img> */}
          {/* <img src={pencil} className="floating-svg2"></img> */}
          <img src={flask} className="floating-svg3"></img>
          <img src={openbook} className="floating-svg4"></img>
          {/* <img src={writingpad} className="floating-svg5"></img> */}
          <img src={compass} className="floating-svg6"></img>
          {/* <img src={closebook} className="floating-svg7" ></img> */}
          <img src={microscope} className="floating-svg8"></img>
        </div>
        <article className="signin__container__form__div__tabs">
          <div className="wrapper">
            <div className={`tab-switch ${tabPosition} text-center`}>
              <NavLink
                to="/login/mobile"
                className={({ isActive }) =>
                  `tab ${isActive ? "active" : ""} ${
                    location.pathname === "/login" ? "active" : ""
                  }`
                }
                onClick={() => setTabPosition("left")}
              >
                Mobile
              </NavLink>

              <NavLink
                to="/login/faceid"
                className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
                onClick={() => setTabPosition("center")}
              >
                Face ID
              </NavLink>

              <NavLink
                to="/login/voiceid"
                className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
                onClick={() => setTabPosition("right")}
              >
                Voice ID
              </NavLink>
            </div>
          </div>
        </article>

        <article className="signin__container__form" style={formStyle}>
          <Outlet />
          <article className="signin__container__form__div" style={divStyle}>
            {/* Content for the form div */}
          </article>
          <article className="signin__container__form__noaccount">
            Don't have an Account? <Link to="/signup"> &nbsp; Sign Up</Link>
          </article>
        </article>
        <article className="signin__container__animation">
          {/* Content for the animation section */}
        </article>
      </section>
      <div className="signin_footer">
      <p className="SigninFooterCopyright">
        © 2023 Brane Cognitives Pte. Ltd. All Rights Reserved.
        </p>
      </div>
    </section>
    
  );
};

export default SigninForm;
