import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder = ({ mobileno, childno, handleChange, onAudioBlobChange }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [apiResponse, setApiResponse] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleAudioCapture = (capturedaudio) => {
    // setChildImageURL(childno - 1, capturedImageURL);
    handleChange(childno - 1, "childaudiourl", capturedaudio);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      // Convert the audioBlob to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        setAudioBlob(base64Data);
        sendBase64AudioToAPI(base64Data);
      };
      reader.readAsDataURL(audioBlob);

      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current.start();
    setTimeout(() => {
      stopRecording();
    }, 15000); // Stop recording after 10 seconds
    setRecording(true);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const recordAgain = () => {
    setAudioBlob(null);
    setApiResponse(false); // Reset the apiResponse state
    setUploadError(null);
    startRecording();
  };

  const sendBase64AudioToAPI = async (base64Data) => {
    const formData = new FormData();
    try {
      console.log(base64Data);
      console.log(mobileno, childno)
      formData.append("audio_file", base64Data);
      formData.append("mobile_number", mobileno);
      formData.append("child_no", childno);
      const response = await axios.post(
        "http://3.109.144.62:8001/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsUploaded(true)

      // Log the response for debugging

      if (response && response.data && response.data.message === "Signup successful") {
        handleAudioCapture(response.data.url);
      }

      setApiResponse(true);


    } catch (error) {
      // Log the error for debugging
      console.log("");
    } finally {
      setAudioBlob(null);
      formData.delete("audio_file");
    }
  };


  return (
    <div
      style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: ".25rem" }}
    >
      <div style={{ fontSize: "1.25rem" }}>
        Read it with low pitch and high pitch one time each:

      </div>
      <div style={{ fontSize: ".85rem", textAlign: "justify" }}>
        "छोटे चाचा ने छोटी चाची को छोटा चिकन चबा चबा कर छाक के चला दिया।"<br />
        "How can a clam cram in a clean cream can?"<br />
        "కాకు కాకు కోయ కాకు, కోయ కాకు కాక కాకాయకో"<br />
      </div>
      {isUploaded && (
        <div>
          <p style={{ fontSize: "1rem", color: "green" }}>
            Audio uploaded successfully!
          </p>
        </div>
      )}
      {audioBlob ? (
        <div>
          <audio controls src={`data:audio/wav;base64,${audioBlob}`} /><br />
          <button
            className="signup__container__form__div__button"
            type="button"
            onClick={recordAgain}
          >
            Record Again
          </button>
          <br />
        </div>
      ) : (
        <button
          className="signup__container__form__div__button"
          type="button"
          onClick={startRecording}
          disabled={recording}
        >
          Record Audio
        </button>
      )}

    </div>
  );
};

export default AudioRecorder;
