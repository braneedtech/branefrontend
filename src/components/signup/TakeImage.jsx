import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const TakeImage = ({ mobileno, childno, handleChange }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleImageCapture = (capturedImageURL) => {
    handleChange(childno - 1,"childimageurl", capturedImageURL);
  };

  const openWebcam = () => {
    setIsWebcamOpen(true);
    setIsUploaded(false); // Reset the isUploaded state when opening the webcam
  };

  const captureImage = () => {
    const videoSrc = webcamRef.current.getScreenshot();
    setCapturedImage(videoSrc);
    setIsWebcamOpen(false); // Hide the webcam after capturing the image
  };

  const uploadImage = async () => {
    try {
      // Upload the video as a base64 string
      if (capturedImage) {
        const formData = new FormData();
        formData.append("image", capturedImage.split(",")[1]);
        formData.append("mobile_number", mobileno);
        formData.append("child_no", childno);

        const response = await axios.post(
          "http://127.0.0.1:8000/signup/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setIsUploaded(true); // Show the successful message
        console.log(response)
        if (response.statusText === "OK") {
          if (response.data.message === "Signup successful") {
            const imageurl = response.data.url;
            handleImageCapture(imageurl);
          } else {
            alert("Error in Uploading Image");
          }
        } else {
          alert("Image not Uploaded Successfully ");
        }
      }
    } catch (error) {
      console.log("");
    }
  };

  const recaptureImage = () => {
    setCapturedImage(null);
    setIsUploaded(false);
    setIsWebcamOpen(true);
  };

  return (
    <div style={{ textAlign: "center",display:"flex",flexDirection:"column",gap: ".5rem", alignItems: "center", justifyContent: "center", paddingTop: ".6875rem"   }}>
      {isWebcamOpen ? (
        <div className="circular-border">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={200}
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
      ) : null}

      {!capturedImage && !isUploaded && !isWebcamOpen && (
        <button
          className="signup__container__form__div__button"
          onClick={openWebcam}
        >
          Open Camera
        </button>
      )}

      {isWebcamOpen && !capturedImage && (
        <button
          className="signup__container__form__div__button"
          style={{ marginTop: "0" }}
          onClick={captureImage}
        >
          Capture
        </button>
      )}

      {capturedImage && !isUploaded && (
        <div>
          {/* Show the captured image */}
          <img src={capturedImage} alt="Captured" width={270} height={200} />
          <br />

          <button
            type="button"
            style={{ marginRight: "1rem", marginTop:".5rem" }}
            onClick={uploadImage}
            className="signup__container__form__div__button"
          >
            Upload Image
          </button>
          <button
            style={{ marginTop:".5rem"}}
            className="signup__container__form__div__button"
            type="button"
            onClick={recaptureImage}
          >
            ReCapture
          </button>
        </div>
      )}
      <br />

      {isUploaded && (
        <div>
          <p style={{ fontSize: "1rem", color: "green", marginBottom:"0rem" }}>Image uploaded successfully!</p>
          <img src={capturedImage} alt="Captured" width={270} height={200} />
        </div>
      )}
    </div>
  );
};

export default TakeImage;
