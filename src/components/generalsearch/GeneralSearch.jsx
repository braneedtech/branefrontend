import React, { useState, useEffect, useRef } from "react";
import "./GeneralSearchStyle.css";
import searchicon from "../../assets/magnifying-glass-solid.svg";
import micActive from "../../assets/glassmicrophoneon.png"; // Active listening icon
import micInactive from "../../assets/glassmicrophone.png"; // Inactive microphone icon
 
const API_KEY = "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";
const systemMessage = {
  role: "system",
  content:
    "Imagine you're a personal voice assistant. Give only short and best summarized responses.",
};
 
const GeneralSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [audioStreamEnabled, setAudioStreamEnabled] = useState(true); // Initially enabled
  const [lastResultTimestamp, setLastResultTimestamp] = useState(Date.now());
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [paused, setPaused] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(true); // Enable TTS
  const [titleText, setTitleText] = useState("What would you like to know?"); // New state variable for title text
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
 
  const initializeRecognition = () => {
    const recognitionInstance = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
 
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
 
    recognitionInstance.onresult = (event) => {
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(interimTranscript);
 
      // Check for pause
      const now = Date.now();
      if (now - lastResultTimestamp > 10000) {
        console.log("Pause detected for more than 5 seconds");
        setPauseStartTime(now);
        setPaused(true); // Set paused flag
      } else {
        setPauseStartTime(null); // Reset pause start time if speech continues
        setPaused(false); // Reset paused flag
      }
    };
 
    recognitionInstance.onend = () => {
      setIsListening(false);
      setAudioStreamEnabled(true); // Enable the audio stream after recognition ends
      console.log("Recognition ended");
    };
 
    return recognitionInstance;
  };
 
  // const toggleMicrophone = async () => {
  //   if (isListening) {
  //     // Stop recording and recognition
  //     stream.getTracks().forEach((track) => track.stop());
  //     recognition.stop();
  //     // Make the API call when stopping with the microphone
  //     makeApiCall();
  //   } else {
  //     // Enable the audio stream
  //     try {
  //       const audioStream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //       });
  //       setStream(audioStream);
  //       setAudioStreamEnabled(true);
 
  //       const recognitionInstance = initializeRecognition();
  //       recognitionInstance.start();
  //       setRecognition(recognitionInstance);
  //     } catch (error) {
  //       console.error("Error accessing the microphone:", error);
  //       setAudioStreamEnabled(false); // Disable the audio stream if there's an error
  //     }
  //   }
  //   setIsListening(!isListening);
  // };
 
  const toggleForm = () => {
    if (isFormOpen) {
      // If we are about to close the form, reset everything
      setTitleText("What would you like to know?");
      setApiResponse("");
      setTranscript("");
    }
    setIsFormOpen(!isFormOpen);
  };
 
  const closeFormAndResetTitle = () => {
    setIsFormOpen(false);
    setTitleText("What would you like to know?");
    setApiResponse(""); // Clear the previous API response
    setTranscript(""); // Also clear the transcript if needed
  };
 
  // const makeApiCall = () => {
  //   const typedMessage = inputRef.current.value;
 
  //   if (typedMessage.trim() !== "") {
  //     setLoading(true); // Start loading
  //     setTitleText("Loading..."); // Show loading in title
 
  //     // Prepare messages for API request
  //     const userMessage = { role: "user", content: typedMessage };
  //     const apiRequestBody = {
  //       model: "gpt-3.5-turbo",
  //       messages: [systemMessage, userMessage],
  //     };
 
  //     // Make the API call to OpenAI
  //     fetch("https://api.openai.com/v1/chat/completions", {
  //       method: "POST",
  //       headers: {
  //         Authorization: "Bearer " + API_KEY,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(apiRequestBody),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Update the API response
  //         const chatGptResponse = data.choices[0].message.content;
  //         setApiResponse(chatGptResponse);
 
  //         // Use text-to-speech to speak the API response
  //         if (ttsEnabled) {
  //           const synth = window.speechSynthesis;
  //           const utterance = new SpeechSynthesisUtterance(chatGptResponse);
  //           synth.speak(utterance);
  //         }
 
  //         setTitleText("What would you like to know?"); // Reset title text
  //       })
  //       .catch((error) => {
  //         console.error("Error in API call:", error);
  //         setTitleText("Error. Please try again."); // Show error in title
  //       })
  //       .finally(() => {
  //         setLoading(false); // Stop loading
  //         inputRef.current.blur(); // Remove focus from input field
  //       });
  //   }
  // };
 
  const makeApiCall = (message) => {
    setLoading(true); // Start loading
    setTitleText("Loading..."); // Show loading in title
 
    // Prepare messages for API request
    const userMessage = { role: "user", content: message };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
    };
 
    // Make the API call to OpenAI
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const chatGptResponse = data.choices[0].message.content;
        setApiResponse(chatGptResponse);
        setTitleText(chatGptResponse); // Show the response in title
 
        // Text-to-speech
        if (ttsEnabled) {
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(chatGptResponse);
          synth.speak(utterance);
        }
      })
      .catch((error) => {
        console.error("Error in API call:", error);
        setTitleText("Error. Please try again."); // Show error in title
      })
      .finally(() => {
        setLoading(false);
        setTranscript("");
      });
  };
 
 
  // useEffect hook for handling the form's open/close state
  useEffect(() => {
    // If the form is open and there's an API response, update the title text
    if (isFormOpen && apiResponse) {
      setTitleText(apiResponse);
    }
  }, [isFormOpen, apiResponse]);
 
  // const handleInputKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault(); // Prevent form submission
  //     makeApiCall(); // Make the API call
  //     inputRef.current.blur(); // Remove focus from the input field
  //   }
  // };
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const message = inputRef.current.value;
      if (message.trim() !== "") {
        makeApiCall(message); // Make the API call with the typed message
      }
      inputRef.current.blur(); // Remove focus from the input field
    }
  };
 
 
  useEffect(() => {
    // Cleanup logic
    return () => {
      // Clean up when the component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [stream, recognition]);
 
  // useEffect(() => {
  //   if (isListening) {
  //     const checkAudioTimeout = setInterval(() => {
  //       const now = Date.now();
 
  //       if (now - lastResultTimestamp > 1000 && transcript.trim() === "") {
  //         console.log("No recognized audio for 1 second, stopping microphone");
 
  //         // Stop using the microphone immediately
  //         stream.getTracks().forEach((track) => track.stop());
  //         recognition.stop();
  //         setIsListening(false);
 
  //         // Use text-to-speech to prompt the user to say something
  //         if (ttsEnabled) {
  //           const synth = window.speechSynthesis;
  //           const utterance = new SpeechSynthesisUtterance(
  //             "Please ask something."
  //           );
  //           synth.speak(utterance);
  //         }
  //       } else if (
  //         now - lastResultTimestamp > 1000 &&
  //         transcript.trim() !== ""
  //       ) {
  //         console.log("Making API call after 1 second of recognized audio");
 
  //         // Stop using the microphone immediately
  //         stream.getTracks().forEach((track) => track.stop());
  //         recognition.stop();
  //         setIsListening(false);
 
  //         // Prepare messages for API request
  //         const userMessage = { role: "user", content: transcript };
  //         const apiRequestBody = {
  //           model: "gpt-3.5-turbo",
  //           messages: [systemMessage, userMessage],
  //         };
 
  //         // Make the API call to OpenAI
  //         fetch("https://api.openai.com/v1/chat/completions", {
  //           method: "POST",
  //           headers: {
  //             Authorization: "Bearer " + API_KEY,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(apiRequestBody),
  //         })
  //           .then((response) => response.json())
  //           .then((data) => {
  //             // Update the API response
  //             const chatGptResponse = data.choices[0].message.content;
  //             setApiResponse(chatGptResponse);
 
  //             // Use text-to-speech to speak the API response
  //             if (ttsEnabled) {
  //               const synth = window.speechSynthesis;
  //               const utterance = new SpeechSynthesisUtterance(chatGptResponse);
  //               synth.speak(utterance);
  //             }
 
  //             // Clear the transcript
  //             setTranscript("");
  //           })
  //           .catch((error) => {
  //             console.error("Error in API call:", error);
  //           });
  //       }
  //     }, 2500);
 
  //     return () => {
  //       clearInterval(checkAudioTimeout);
  //     };
  //   }
  // }, [isListening, lastResultTimestamp, transcript, ttsEnabled]);
 
  const toggleMicrophone = async () => {
    if (isListening) {
      // Stop recording and recognition
      stream.getTracks().forEach((track) => track.stop());
      recognition.stop();
    } else {
      // Start listening
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(audioStream);
        setAudioStreamEnabled(true);
 
        const recognitionInstance = initializeRecognition();
        recognitionInstance.start();
        setRecognition(recognitionInstance);
        setTitleText("Listening..."); // Show listening status
      } catch (error) {
        console.error("Error accessing the microphone:", error);
        setAudioStreamEnabled(false);
      }
    }
    setIsListening(!isListening);
  };
 
  // Adjusted useEffect hook for handling audio timeout and making an API call
  useEffect(() => {
    if (isListening) {
      const checkAudioTimeout = setInterval(() => {
        const now = Date.now();
 
        if (now - lastResultTimestamp > 2000 && transcript.trim() !== "") {
          // Stop using the microphone and make an API call
          stream.getTracks().forEach((track) => track.stop());
          recognition.stop();
          setIsListening(false);
          makeApiCall(transcript); // Call API with the transcript
        }
      }, 2500);
 
      return () => clearInterval(checkAudioTimeout);
    }
  }, [isListening, lastResultTimestamp, transcript]);
 
  return (
    // <div className="GeneralSearchComponent">
    //   <div className="general-search-bar">
    //   <img src={searchicon}/>
    //     <input
    //       ref={inputRef}
    //       type="text"
    //       placeholder="Search or Speak..."
    //       value={transcript}
    //       onKeyPress={handleInputKeyPress}
    //       onChange={(e) => setTranscript(e.target.value)}
    //       disabled={isListening || !audioStreamEnabled}
    //     />
    //     <div class="mic-icon" onClick={toggleMicrophone}>
    //         <img src={mic}/>
    //     </div>
    //   </div>
    //   <div className="response">
    //     <p>{apiResponse}</p>
    //   </div>
    // </div>
    <div className="GeneralSearchComponent">
    <div id="form" className={`form ${isFormOpen ? "open" : ""}`}>
      <div
        id="heading"
        className="glass glass--gradient glass--heading"
        onClick={toggleForm}
      >
        <span className="form-header">
          <span className="form-icon"></span>
          <span className="form-title">
            {loading ? "Loading..." : titleText}
          </span>{" "}
        </span>
        <button
          className="form-close-button"
          onClick={closeFormAndResetTitle}
        >
          ✕
        </button>
      </div>
      <div id="input" className="glass">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type or speak your query Here..."
          value={transcript}
          onKeyPress={handleInputKeyPress}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={isListening || !audioStreamEnabled}
        />
        <div className="mic-icon" onClick={toggleMicrophone}>
          <img
            src={isListening ? micActive : micInactive}
            alt="Microphone icon"
            className="mic-icon-image"
          />
        </div>
      </div>
    </div>
  </div>
  );
};
 
export default GeneralSearch;