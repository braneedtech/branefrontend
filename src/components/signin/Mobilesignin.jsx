import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { encrypt_secrete_key, end_point } from "../../constants/urls";
import StudentDetailsCustomHook from "../context-api/StudentDetailsCustomHook";

const MobileSignin = ({
  phoneNumber,
  pin,
  triggerLogin,
  updateLoginStatus,
}) => {
  const navigate = useNavigate();
  const { student, updateStudent } = StudentDetailsCustomHook();
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting_message =
    currentHour >= 7 && currentHour <= 11
      ? "Good Morning"
      : currentHour >= 12 && currentHour <= 16
      ? "Good Afternoon"
      : "Good Evening";

  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);

  const [PhonenoErrorStatus, setPhonenoErrorStatus] = useState("");
  const [PasswordErrorStatus, setPasswordErrorStatus] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const speakout = window.speechSynthesis;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setLoginStatus("");
  };

  // In MobileSignin component
  useEffect(() => {
    // Assuming phoneNumber and pin are received as props
    phoneNumberRef.current.value = phoneNumber;
    passwordRef.current.value = pin;
  }, [phoneNumber, pin]);

  useEffect(() => {
    // Only set values if refs are not null
    if (phoneNumberRef.current && passwordRef.current) {
      phoneNumberRef.current.value = phoneNumber;
      passwordRef.current.value = pin;
    }

    return () => {
      // Reset states when component unmounts
      setPhonenoErrorStatus("");
      setPasswordErrorStatus("");
      setLoginStatus("");
      // Any other states that need to be reset
      // Clear the input fields when the component unmounts, if refs are not null
      if (phoneNumberRef.current && passwordRef.current) {
        phoneNumberRef.current.value = "";
        passwordRef.current.value = "";
      }
    };
  }, [phoneNumber, pin]);

  // New function to reset login details
  const resetLoginDetails = () => {
    phoneNumberRef.current.value = "";
    passwordRef.current.value = "";
    // Reset any other relevant state or props if necessary
  };

  // useEffect to reset state when loginStatus changes to successful
  useEffect(() => {
    if (loginStatus === "Login successful") {
      resetLoginDetails();
    }
  }, [loginStatus]);

  useEffect(() => {
    if (triggerLogin) {
      handleSubmit();
      // Reset the triggerLogin flag here if necessary
    }
  }, [triggerLogin]);

  // Panda Animation Functions
  const handleFocusPhoneNumber = () => {
    document.querySelector(".eyeball-l").style.cssText =
      "left: 0.75em; top: 1.12em;";
    document.querySelector(".eyeball-r").style.cssText =
      "right: 0.75em; top: 1.12em;";
    normalHandStyle();
  };

  const handleFocusPassword = () => {
    document.querySelector(".hand-l").style.cssText =
      "height: 6.56em; top: 3.87em; left: 11.75em; transform: rotate(-155deg);";
    document.querySelector(".hand-r").style.cssText =
      "height: 6.56em; top: 3.87em; right: 11.75em; transform: rotate(155deg);";
    normalEyeStyle();
  };

  const handleClickOutside = (e) => {
    if (
      e.target !== phoneNumberRef.current &&
      e.target !== passwordRef.current
    ) {
      normalEyeStyle();
      normalHandStyle();
    }
  };

  const normalEyeStyle = () => {
    document.querySelector(".eyeball-l").style.cssText =
      "left: 0.6em; top: 0.6em;";
    document.querySelector(".eyeball-r").style.cssText =
      "right: 0.6em; top: 0.6em;";
  };

  const normalHandStyle = () => {
    document.querySelector(".hand-l").style.cssText =
      "height: 2.81em; top: 8.4em; left: 7.5em; transform: rotate(0deg);";
    document.querySelector(".hand-r").style.cssText =
      "height: 2.81em; top: 8.4em; right: 7.5em; transform: rotate(0deg);";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (value.length !== 10) {
        setPhonenoErrorStatus("Mobile number must be 10 digits.");
      } else {
        setPhonenoErrorStatus("");
      }
    }

    if (name === "password") {
      if (value.length !== 4) {
        setPasswordErrorStatus("PIN must be 4 digits.");
      } else {
        setPasswordErrorStatus("");
      }
    }
  };

  const handleKeyPress = (e) => {
    const digitPattern = /^[0-9]*$/;
    const key = String.fromCharCode(e.which);

    if (!digitPattern.test(key)) {
      e.preventDefault();
    }
    if (e.target.name === "phoneNumber" && e.target.value.length === 10) {
      passwordRef.current.focus();
    }

    if (e.target.name === "password" && e.target.value.length >= 4) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    // Check if the event exists and prevent the default behavior
    if (e) e.preventDefault();
    const phoneNumber = phoneNumberRef.current.value;
    const password = passwordRef.current.value;

    // Disable the button to prevent multiple clicks during API call
    setButtonDisabled(true);

    try {
      const response = await axios.get(`${end_point}/user-login`);
      const userData = response.data;

      const user = userData.find(
        (user) => user.parentsmobileno === phoneNumber
      );

      if (!user) {
        const speaking = new SpeechSynthesisUtterance("Invalid Credentials");
        speakout.speak(speaking);
        setLoginStatus("Invalid Credentials!");
        return;
      }

      if (password === user.parentspassword) {
        setLoginStatus("Parent Login successful");
        const speaking = new SpeechSynthesisUtterance(
          "Parent login successful"
        );
        speakout.speak(speaking);

        // Navigate to parent's page
        navigate("/parentspage");
      } else {
        // Initialize child index to -1
        let childIndex = -1;

        const matchingChild = user.child.find((child, index) => {
          if (child.childpassword === password) {
            childIndex = index; // Store the child index when found
            return true;
          }
          return false;
        });

        if (matchingChild) {
          const profile_info = {
            mobileno: user?.parentsmobileno,
            student_name: matchingChild?.childname,
            medium_of_instruction: matchingChild?.mediumofinstruction,
            schooling: matchingChild?.childclass,
            profile_img: matchingChild?.childimageurl,
            curriculum: matchingChild?.childsyllabus,
            childIndex: childIndex, // Pass the child index
          };
          updateStudent(profile_info);
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(profile_info),
            encrypt_secrete_key
          ).toString();
          window.localStorage.setItem("login_details", encryptedData);
          setLoginStatus("Login successful");
          updateLoginStatus(true); // Update login status on successful login

          // Navigate to child's page
          const speaking = new SpeechSynthesisUtterance("Login successful");
          speakout.speak(speaking);

          setTimeout(() => {
            const speaking = new SpeechSynthesisUtterance(
              `${greeting_message} ${profile_info?.student_name}`
            );
            speakout.speak(speaking);
          }, 3000);
          navigate("/portfolio");
          // Reset phoneNumber and pin here after successful login
          resetLoginDetails();
        } else {
          const speaking = new SpeechSynthesisUtterance("Login Failed");
          speakout.speak(speaking);
          setLoginStatus("Login failed!");
          updateLoginStatus(false); // Update login status on failure
        }
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setLoginStatus("Error occurred during login");
    } finally {
      // Enable the button after API call is complete
      setButtonDisabled(false);
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="pandacontainer" onClick={handleClickOutside}>
      {/* Existing form elements */}
      <div className="mobile__signin" style={{ padding: "1.45rem 0" }}>
        <div className="input-container">
          <i className="bi bi-telephone icon"></i>
          <input
            className="input-field"
            type="tel"
            name="phoneNumber"
            placeholder="Mobile Number"
            maxLength={10}
            onFocus={() => {
              handleFocus();
              handleFocusPhoneNumber();
              const speaking = new SpeechSynthesisUtterance(
                "Enter Mobile Number"
              );
              speakout.speak(speaking);
            }}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            ref={phoneNumberRef}
          />
        </div>
        {PhonenoErrorStatus && (
          <small className="error-message">{PhonenoErrorStatus}</small>
        )}
        <div className="input-container">
          <i className="bi bi-lock-fill icon"></i>
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="4 Digit PIN"
            onChange={handleChange}
            onKeyPress={handlePasswordKeyPress}
            ref={passwordRef}
            maxLength={4}
            onFocus={() => {
              handleFocus();
              handleFocusPassword();
              const speaking = new SpeechSynthesisUtterance(
                "I am very honest,i'm not seeing your password"
              );
              speakout.speak(speaking);
            }}
          />
          <i
            className={`bi bi-eye${showPassword ? "-slash" : ""} password-icon`}
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        {PasswordErrorStatus && (
          <small className="pass-error-message">{PasswordErrorStatus}</small>
        )}
        {/* <button
    className="loginform-btn"
    type="submit"
    onClick={handleSubmit}
    disabled={isButtonDisabled}
  >
    {isButtonDisabled ? "Logging in..." : "Login"}
  </button> */}

        <button
          className="loginform-btn"
          type="submit"
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          <span className="transition"></span>
          <span className="gradient"></span>
          <span className="label">
            {isButtonDisabled ? "Logging in..." : "Login"}
          </span>
        </button>

        {loginStatus && (
          <div
            style={{
              fontSize: ".8rem",
              color: "white",
              padding: "0.1rem 0.8rem",
              backgroundColor: "#ff0000b8",
              position: "absolute",
              borderRadius: "1rem",
              top: "14.56rem",
            }}
          >
            {loginStatus}
          </div>
        )}
      </div>
      {/* Panda Markup */}
      <div className="ear-l"></div>
      <div className="ear-r"></div>
      <div className="panda-face">
        <div className="blush-l"></div>
        <div className="blush-r"></div>
        <div className="eye-l">
          <div className="eyeball-l"></div>
        </div>
        <div className="eye-r">
          <div className="eyeball-r"></div>
        </div>
        <div className="nose"></div>
        <div className="mouth"></div>
      </div>
      <div className="hand-l"></div>
      <div className="hand-r"></div>
      <div className="paw-l"></div>
      <div className="paw-r"></div>
    </div>
  );
};

export default MobileSignin;
