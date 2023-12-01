import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import StudentDetailsCustomHook from "../context-api/StudentDetailsCustomHook";
import { encrypt_secrete_key } from "../../constants/urls";
import voicegif from "../../assets/waveanim.gif";
import loadingGif from "../../assets/loading.gif";
import successGif from "../../assets/successful.gif";
import failGif from "../../assets/failed.gif";

const AudioRecorderSignin = ({ updateLoginStatus, triggerRecord }) => {
  const { updateStudent } = StudentDetailsCustomHook();
  const [audioBase64, setAudioBase64] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [showRecordButton, setShowRecordButton] = useState(true); // Initialize to true
  const mediaRecorderRef = useRef(null);
  const navigate = useNavigate();
  const speakout = window.speechSynthesis;
  const [showGif, setShowGif] = useState(false);
  const [showSuccessGif, setShowSuccessGif] = useState(false);
  const [showFailGif, setShowFailGif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const abortController = useRef(new AbortController());

  useEffect(() => {
    return () => abortController.current.abort();
  }, []);

  const startRecording = async () => {
    setShowFailGif(false); // Hide the fail GIF
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        setAudioBase64(base64Data);
        sendAudioBase64ToAPI(base64Data);
      };
      reader.readAsDataURL(audioBlob);

      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current.start();
    setShowRecordButton(false);
    // Show the GIF exactly when the record button hides
    setShowGif(true);
    setTimeout(() => {
      stopRecording();
    }, 7000); // Stop recording after 7 seconds
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    // Hide the recording GIF and show the record button
    setShowGif(false);
    setShowRecordButton(true);
  };

  // const stopRecording = () => {
  //   if (
  //     mediaRecorderRef.current &&
  //     mediaRecorderRef.current.state !== "inactive"
  //   ) {
  //     mediaRecorderRef.current.stop();
  //   }
  //   // Hide the recording GIF and show the record button
  //   setShowGif(false);
  //   setShowRecordButton(true);
  // };

  const recordAgain = () => {
    setVerificationStatus("");
    setAudioBase64(null);
    setShowFailGif(false); // Hide the fail GIF
    startRecording();
  };

  const sendAudioBase64ToAPI = async (base64Data) => {
    setLoading(true); // Show loading GIF while waiting for the server
    const formData = new FormData();
    formData.append("audio_file", base64Data);

    try {
      const response = await axios.post(
        "http://3.109.144.62:8001/signin/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: abortController.current.signal,

        }
      );

      setApiResponse(response.data.success);
      if (response && response.statusText === "OK") {
        if (response.data.success) {
          setVerificationStatus("Login Success");
          updateLoginStatus(true);
          const profile_info = {
            student_name: response.data?.student_name,
            medium_of_instruction: response.data?.medium_of_instruction,
            schooling: response.data?.grade,
            profile_img: response.data?.profile_img,
            curriculum: response.data?.curriculum,
            mobileno: response.data?.mobileno,
            childIndex: response.data?.childIndex,
          };
          updateStudent(profile_info);
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(profile_info),
            encrypt_secrete_key
          ).toString();
          window.localStorage.setItem("login_details", encryptedData);
          setShowSuccessGif(true);
          setLoading(false); // Hide loading GIF after successful login
          speakLoginSuccess(profile_info);
          navigate(`/portfolio`);
        } else {
          setVerificationStatus("Login Fail");
          updateLoginStatus(false);
          setShowFailGif(true);
          setLoading(false); // Hide loading GIF after failed login
          speakLoginFail();
          setShowRecordButton(true); // Show "Record Again" button after login failure
        }
      }
    } catch (error) {
      console.log(error);
      setVerificationStatus("Login Failed server error");
      setShowFailGif(true);
      updateLoginStatus(false);
      setLoading(false);
      setShowRecordButton(true);
      if (error.name !== "CanceledError") {
        // If the error is not due to abortion, proceed with the error handling
        speakLoginFail();
      } else {
      
      }
    }
  };

  const speakLoginSuccess = (profile_info) => {
    const greeting_message = `Good ${new Date().getHours() < 12 ? "Morning" : "Afternoon"
      } ${profile_info?.student_name}`;
    const speaking = new SpeechSynthesisUtterance(
      `${greeting_message}. Login successful`
    );
    speakout.speak(speaking);
  };

  const speakLoginFail = () => {
    const speaking = new SpeechSynthesisUtterance(
      "Login Failed. Please try again."
    );
    speakout.speak(speaking);
  };

  useEffect(() => {
    if (triggerRecord) {
      startRecording();
    }
  }, [triggerRecord]);


  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "2rem",
        height: "13vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loading && (
        <img className="loading_gif"
          src={loadingGif}
          alt="Loading GIF"
        />
      )}
      {showGif && !loading && (
        <img
          src={voicegif}
          style={{ height: "8rem", marginLeft: "1rem" }}
          alt="Recording GIF"
        />
      )}
      {showSuccessGif && (
        <img
          src={successGif}
          style={{ height: "8rem", marginLeft: "1rem" }}
          alt="Success GIF"
        />
      )}
      {showFailGif && (
        <img className="fail_gif"
          src={failGif}
          alt="Fail GIF"
        />
      )}
      {showRecordButton && !loading && (
        <div>
          <button
            className="loginform-btn"
            type="button"
            onClick={startRecording}
          >
            <span className="transition"></span>
            <span className="gradient"></span>
            <span className="label"> Record Audio</span>
          </button>
        </div>
      )}
      {verificationStatus === "Login Success" && !loading && (
        <div>
          <div>
            <audio controls src={`data:audio/wav;base64,${audioBase64}`} />
          </div>
        </div>
      )}
      {verificationStatus === "Login Fail" && !loading && (
        <div>
          <div style={{ fontSize: "1rem", color: "red", paddingTop: "1rem" }}>
            Login Failed
          </div>
          <button
            className="signup__container__form__div__button"
            type="button"
            onClick={recordAgain}
          >
            Record Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderSignin;

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import CryptoJS from "crypto-js";
// import StudentDetailsCustomHook from "../context-api/StudentDetailsCustomHook";
// import { encrypt_secrete_key } from "../../constants/urls";
// import voicegif from '../../assets/waveanim.gif';
// const AudioRecorderSignin = () => {
//   const { updateStudent } = StudentDetailsCustomHook();
//   const [recording, setRecording] = useState(false);
//   const [audioBase64, setAudioBase64] = useState(null);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [uploadError, setUploadError] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const currentDate = new Date();
//   const currentHour = currentDate.getHours();
//   const greeting_message = currentHour >= 7 && currentHour <= 12 ? "Good Morning" : currentHour > 12 && currentHour <= 4 ? "Good Afternoon" : "Good Evening"
//   const navigate = useNavigate();
//   const [verificationStatus, setVerificationStatus] = useState("");
//   const speakout = window.speechSynthesis;
//   const [showGif, setShowGif] = useState(false);
//   const startRecording = async () => {
//     setShowGif(true);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     mediaRecorderRef.current = new MediaRecorder(stream);
//     let audioChunks = [];

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         audioChunks.push(event.data);
//       }
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Data = reader.result.split(",")[1];
//         setAudioBase64(base64Data);
//         sendAudioBase64ToAPI(base64Data);
//       };
//       reader.readAsDataURL(audioBlob);

//       stream.getTracks().forEach((track) => track.stop());
//     };

//     mediaRecorderRef.current.start();
//     setTimeout(() => {
//       stopRecording();
//     }, 7000); // Stop recording after 5 seconds
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     setShowGif(false);
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state !== "inactive"
//     ) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }
//   };

//   const recordAgain = () => {
//     setVerificationStatus("");
//     setAudioBase64(null);
//     setApiResponse(null);
//     setUploadError(null);
//     startRecording();
//   };

//   const sendAudioBase64ToAPI = async (base64Data) => {
//     const formData = new FormData();
//     formData.append("audio_file", base64Data);

//     try {
//       const response = await axios.post(
//         "http://65.2.149.64:8001/signin/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response)
//       setApiResponse(response.data.success);
//       const msg = response.data.success ? "Login successful" : "Login Failed";
//       const speaking = new SpeechSynthesisUtterance(msg);
//       speakout.speak(speaking);
//       if (response.data.success) {
//         setVerificationStatus("Login Sucess");
//         const profile_info = {
//           student_name: response.data?.student_name,
//           medium_of_instruction: response.data?.medium_of_instruction,
//           schooling: response.data?.grade,
//           profile_img: response.data?.profile_img,
//           curriculum: response.data?.curriculum,
//           mobileno: response.data?.mobileno,
//           childIndex: response.data?.childIndex,

//         };
//         updateStudent(profile_info);
//         const encryptedData = CryptoJS.AES.encrypt(
//           JSON.stringify(profile_info),
//           encrypt_secrete_key
//         ).toString();
//         window.localStorage.setItem("login_details", encryptedData);
//         setTimeout(()=>{
//           const speaking = new SpeechSynthesisUtterance(`${greeting_message} ${profile_info?.student_name}`);
//           speakout.speak(speaking)
//         },4000)
//         navigate(`/portfolio`);
//       } else {
//         setVerificationStatus("Login Fail");
//       }
//     } catch (error) {
//       console.error("Error uploading audio:", error);
//       setVerificationStatus("Login Failed server error");
//       setUploadError("Error audio signin. Please try again.");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", paddingTop: "2rem" }}>
//       {showGif && (
//         // <iframe
//         //   src="https://tenor.com/embed/23229777"
//         //   className="giphy-embed"
//         //   allowFullScreen
//         //   title="Sound GIF"
//         // />
//         <img src={voicegif} style={{height:'8rem', marginLeft: '1rem'}}/>
//       )}
//       {audioBase64 ? (
//         <div>
//           <audio controls src={`data:audio/wav;base64,${audioBase64}`} />
//           <br />
//           <br />
//           <button
//             className="signup__container__form__div__button"
//             type="button"
//             onClick={recordAgain}
//           >
//             Record Again
//           </button>
//         </div>
//       ) : (
//         !recording && (
//         <button
//           className="signup__container__form__div__button1"
//           type="button"
//           onClick={startRecording}
//           disabled={recording}
//         >
//           {recording ? "Recording..." : "Record Audio"}
//         </button>
//         )
//       )}
//       {verificationStatus && (
//         <div
//           style={{
//             fontSize: "1rem",
//             color: "red",
//             paddingTop: "1rem",
//           }}
//         >
//           {verificationStatus}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioRecorderSignin;
