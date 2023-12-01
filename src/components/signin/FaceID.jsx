import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam"; // Import the Webcam component
import { useNavigate } from "react-router-dom";
import retake from "../../assets/loading-arrow.png";
import CryptoJS from "crypto-js";
import { encrypt_secrete_key } from "../../constants/urls";
import StudentDetailsCustomHook from "../context-api/StudentDetailsCustomHook";
const FaceIDComponent = ({updateLoginStatus}) => {
  const { updateStudent } = StudentDetailsCustomHook();
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting_message =
    currentHour >= 7 && currentHour <= 11
      ? "Good Morning"
      : currentHour >= 12 && currentHour <= 16
      ? "Good Afternoon"
      : "Good Evening";
  const [countdown, setCountdown] = useState(3);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [showRetakeButton, setShowRetakeButton] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const speakout = window.speechSynthesis;
  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => abortController.current.abort();
  }, []);
  useEffect(() => {
    let timeout;

    if (countdown > 0) {
      timeout = setTimeout(() => {
        setCountdownInterval(
          setInterval(() => {
            setCountdown((prevCountdown) => Math.max(prevCountdown - 1, 0));
          }, 1000)
        );
      }, 2000);
    } else if (countdown === 0) {
      clearTimeout(timeout);
      clearInterval(countdownInterval);
      handleSignin();
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  const handleSignin = async () => {
    if (webcamRef.current === null) {
      setVerificationStatus("Login failed");
      setShowRetakeButton(true);
      return;
    }

    const pictureSrc = webcamRef.current.getScreenshot();
    console.log(pictureSrc);
    if (pictureSrc === null) {
      console.log("null object");
      setVerificationStatus("Login failed");
      setShowRetakeButton(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", pictureSrc.split(",")[1]);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/signin/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: abortController.current.signal,

        }
      );
      if (response.statusText === "OK") {
        const response_message = response.data.success;
        if (response_message) {
          const child_number = response.data;
          const profile_info = {
            student_name: child_number?.student_name,
            medium_of_instruction: child_number?.medium_of_instruction,
            schooling: child_number?.grade,
            profile_img: child_number?.profile_img,
            curriculum: child_number?.curriculum,
            mobileno: child_number?.mobileno,
            childIndex: child_number?.childIndex,
          };
          updateStudent(profile_info);
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(profile_info),
            encrypt_secrete_key
          ).toString();
          window.localStorage.setItem("login_details", encryptedData);
          const speaking = new SpeechSynthesisUtterance("Login successful");
          updateLoginStatus(true);
          speakout.speak(speaking);
          setTimeout(() => {
            const speaking = new SpeechSynthesisUtterance(
              `${greeting_message} ${profile_info?.student_name}`
            );
            speakout.speak(speaking);
          }, 3000);
          navigate(`/portfolio`);
        } else {
          setVerificationStatus("Login failed");
          const speaking = new SpeechSynthesisUtterance(
            "Login Failed. Please retry."
          );
          updateLoginStatus(false);
          speakout.speak(speaking);
          setShowRetakeButton(true);
        }
      } else {
        setVerificationStatus("Error during signin");
        updateLoginStatus(false);
      }
    } catch (err) {
      console.log(err);
      setVerificationStatus("Login Failed. Server Error. Try again.");
      updateLoginStatus(false);
      setShowRetakeButton(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setVerificationStatus("");
    setCountdown(3);
    setShowRetakeButton(false);
    clearInterval(countdownInterval);
    setCountdownInterval(
      setInterval(() => {
        setCountdown((prevCountdown) => Math.max(prevCountdown - 1, 0));
      }, 1000)
    );
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="face-id-container">
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            border:
              verificationStatus === "Login failed" ||
              verificationStatus === "Login Failed. Server Error. Try again."
                ? "5px solid red"
                : "5px solid #4130ae",
            transform: "scalex(-1)",
          }}
        />
      </div>
      <div className="countdown">{countdown}</div>
      {showRetakeButton && (
        <img
          src={retake}
          alt="Retake"
          className="retake-img"
          onClick={handleRetake}
        />
      )}
      {/* {verificationStatus && (
        <div className="verification-status">{verificationStatus}</div>
      )} */}
      {/* <button
        className="signin-button"
        disabled={loading}
        onClick={handleSignin}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button> */}
    </div>
  );
};

export default FaceIDComponent;
