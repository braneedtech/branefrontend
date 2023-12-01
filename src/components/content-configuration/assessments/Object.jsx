import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
// import "./styles.css";
import { drawRect } from "./utilities";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import CustomPopup from "./CustomPopup";
function ObjectDectection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cheatCount, setCheatCount] = useState(0);
  const [smsSent, setSmsSent] = useState(false);
  const {student}=StudentDetailsCustomHook();
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  // console.log(student?.mobileno)
  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };
  const handleConfirmPopup = () => {
    // Check if each item exists in local storage before removing it
    if (localStorage.getItem("timer")) {
      localStorage.removeItem("timer");
    }
    if (localStorage.getItem("questions")) {
      localStorage.removeItem("questions");
    }
    if (localStorage.getItem("answers")) {
      localStorage.removeItem("answers");
    }
    if (localStorage.getItem("isSubmitted")) {
      localStorage.removeItem("isSubmitted");
    }
    navigate("/takelesson");
  };

  const handleCancelPopup = () => {
    setShowCustomPopup(false);
  };

  const sendWhatsAppMessage = async (to, body) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, body }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("WhatsApp message sent:", result);
      setSmsSent(true);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error.message);
    }
  };
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);
      console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);

      const isCellphoneDetected = obj.some(item => item.class === 'cell phone');

      if (isCellphoneDetected) {
        setCheatCount(prevCount => prevCount + 1);
        // alert("cell phone detected")
        setShowCustomPopup(true)
      } else {
        setCheatCount(0); // Reset count if cellphone is not detected
      }
      if (cheatCount >= 10 && !smsSent) {
        // Make the API call with the desired to and body values
        const to = "whatsapp:+917901063698" // Replace with the recipient's number
        const body = "Cheating alert! The cheat count has crossed 10.";
        sendWhatsAppMessage(to, body);
        console.log("API call triggered for WhatsApp message");
        // Optionally reset cheatCount after triggering the API call
        setCheatCount(0);
      
      }
    }
  };


  useEffect(() => {
    if (cheatCount >= 10 && !smsSent) {
      // Reset cheatCount after triggering the API call
      setCheatCount(0);
    }
  }, [cheatCount, smsSent]);

  useEffect(() => {
    runCoco();
  }, [cheatCount,smsSent]);


  return (
    <div className="container">
      <Webcam
        ref={webcamRef}
        muted={true}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          // width: "100vw",
          // height: "100vh",
          visibility:"hidden"
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 8,
          width: "100vw",
          height: "100vh",
          visibility:"hidden"
        }}
      />
      {showCustomPopup && (
          <CustomPopup
            message="cell phone detected it seems you are cheating"
            confirmText="Yes, leave"
            cancelText="No, stay"
            onConfirm={handleConfirmPopup}
            onCancel={handleCancelPopup}
          />
        )}
    </div>
  );
}

export default ObjectDectection;
