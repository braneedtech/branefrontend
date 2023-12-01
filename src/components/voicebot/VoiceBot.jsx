import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import "./VoiceBot.css";
import chatbotimage from "../../assets/chatbotgif.gif";

const VoiceBot = ({ videoRefs,setMobileNumber,setPin,triggerLogin, setTriggerRecordAudio }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const [hasGreeted, setHasGreeted] = useState(false);
  const navigate = useNavigate();

  // Initialize speech recognition
  useEffect(() => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = false;
    recognition.current.onresult = onResult;
    recognition.current.onend = onRecognitionEnd;
    recognition.current.starting = false;

    recognition.current.onerror = (event) => {
      console.error("Recognition error:", event.error);
      if (isListening && !isSpeaking) {
        restartRecognition();
      }
    };

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const checkRecognition = () => {
      if (isListening && !isSpeaking && !recognition.current.starting) {
        console.log("Restarting recognition because it's not active.");
        recognition.current.starting = true;
        recognition.current.start();
        console.log("Restarted recognition.");
      }
    };

    const recognitionCheckInterval = setInterval(checkRecognition, 500); // Check every .5 second

    return () => {
      clearInterval(recognitionCheckInterval);
    };
  }, [isListening, isSpeaking]);

  const historyStack = useRef([]);

  useEffect(() => {
    return () => {
      // Clean up the listener when the component unmounts
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handlePopState = () => {
    // This needs to handle both back and forward browser actions
    // Use some logic to determine whether it's a back or forward action
    // For simplicity, assume it's always back
    historyStack.current.pop();
    forwardStack.current.length = 0; // Clear forward stack on manual navigation
  };

  // Listen to popstate events to update the history stack
  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
  }, []);

  const forwardStack = useRef([]);

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      window.history.back();
      speak("Going back");
    } else {
      speak("Can't go back any further.");
    }
  };

  const goForward = () => {
    if (
      window.history.state &&
      window.history.state.idx < window.history.length - 1
    ) {
      window.history.forward();
      speak("Going forward");
    } else {
      speak("No forward history available.");
    }
  };

  const scrollAmount = window.innerHeight * 0.82;

  const scrollUp = () => {
    if (window.pageYOffset === 0) {
      speak("Already at the top of the page.");
    } else {
      window.scrollBy(0, -scrollAmount);
      speak("Scrolled up.");
    }
  };

  const scrollDown = () => {
    const maxScrollTop =
      document.documentElement.scrollHeight - window.innerHeight;
    if (window.pageYOffset >= maxScrollTop) {
      speak("Already at the bottom of the page.");
    } else {
      window.scrollBy(0, scrollAmount);
      speak("Scrolled down.");
    }
  };

  const scrollToTop = () => {
    if (window.pageYOffset === 0) {
      speak("Already at the top of the page.");
    } else {
      window.scrollTo(0, 0);
      speak("Scrolled to the top of the page.");
    }
  };

  const scrollToBottom = () => {
    const maxScrollTop =
      document.documentElement.scrollHeight - window.innerHeight;
    if (window.pageYOffset >= maxScrollTop) {
      speak("Already at the bottom of the page.");
    } else {
      window.scrollTo(0, document.body.scrollHeight);
      speak("Scrolled to the bottom of the page.");
    }
  };

  const controlVideo = (videoId, action) => {
    const videoRef = videoRefs.current.get(videoId);
    if (videoRef && videoRef.current) {
      switch (action) {
        case "play":
          videoRef.current.play();
          break;
        case "pause":
          videoRef.current.pause();
          break;
        case "mute":
          videoRef.current.muted = true;
          break;
        case "unmute":
          videoRef.current.muted = false;
          break;
        case "fullscreen":
          if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
          } else if (videoRef.current.webkitRequestFullscreen) {
            // Safari
            videoRef.current.webkitRequestFullscreen();
          } else if (videoRef.current.msRequestFullscreen) {
            // IE11
            videoRef.current.msRequestFullscreen();
          }
          break;
        case "exitFullscreen":
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            // Safari
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            // IE11
            document.msExitFullscreen();
          }
          break;
        case "increaseVolume":
          if (videoRef.current.volume < 1) {
            videoRef.current.volume = Math.min(
              1,
              videoRef.current.volume + 0.1
            );
          }
          break;
        case "decreaseVolume":
          if (videoRef.current.volume > 0) {
            videoRef.current.volume = Math.max(
              0,
              videoRef.current.volume - 0.1
            );
          }
          break;
        // Add other cases as needed
      }
      speak(
        `${
          action.charAt(0).toUpperCase() +
          action
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
        }ing video.`
      );
    } else {
      speak(`Video not found.`);
    }
  };

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Restart recognition after speaking has ended
      if (isListening) {
        restartRecognition();
      }
    };

    setIsSpeaking(true);
    // Stop recognition when the bot starts speaking
    if (recognition.current) {
      recognition.current.abort();
    }
    speechSynthesis.current.speak(utterance);
  };

  const restartRecognition = () => {
    // Check if recognition is not already started and if the bot is set to listen
    if (
      recognition.current &&
      !recognition.current.starting &&
      isListening &&
      !isSpeaking
    ) {
      recognition.current.abort(); // Ensure any ongoing recognition is stopped
      recognition.current.starting = true;
      recognition.current.start();
    }
  };

  // Restart recognition when bot finishes speaking and isListening is true
  useEffect(() => {
    if (!isSpeaking && isListening) {
      restartRecognition();
    }
  }, [isSpeaking, isListening]);

  const onResult = (event) => {
    const resultIndex = event.resultIndex;
    const transcript = event.results[resultIndex][0].transcript
      .trim()
      .toLowerCase();

    if (event.results[resultIndex].isFinal) {
      console.log(`Recognized text: ${transcript}`);
      if (transcript.includes("brain")) {
        console.log("Wake word heard, processing command...");
        handleCommandWithFuse(transcript.replace("brain", ""));
      }
    }
  };

  const onRecognitionEnd = () => {
    recognition.current.starting = false;
    if (isListening && !isSpeaking) {
      restartRecognition();
    }
  };

  useEffect(() => {
    if (isListening && !hasGreeted) {
      speak("Hello, I'm Brane. How can I help you today?");
      setHasGreeted(true);
    }
  }, [isListening, hasGreeted]);

  // Updated startListening function
  const startListening = () => {
    setIsListening(true);
    if (!recognition.current.starting) {
      restartRecognition();
    }
  };

  // Updated stopListening function
  const stopListening = () => {
    setIsListening(false);
    if (speechSynthesis.current.speaking) {
      speechSynthesis.current.cancel();
    }
    recognition.current.abort();
  };

  // const handleCommandWithFuse = (command) => {
  //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
  //   const results = fuse.search(command);
  //   const foundCommand = results.length ? results[0].item : null;

  //   if (foundCommand) {
  //     console.log("Command text to process:", command);
  //     console.log("Command found:", foundCommand.utterance);
  //     if (foundCommand.action) {
  //       foundCommand.action(command); // Pass the command text to the action function
  //     } else if (foundCommand.route) {
  //       navigate(foundCommand.route);
  //     }

  //     // Speak after performing the action or navigation
  //     speak(foundCommand.response);
  //   } else {
  //     console.log("No command found.");
  //     speak("I'm not sure how to respond to that.");
  //   }
  // };

  const handleCommandWithFuse = (command) => {
    const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
    const results = fuse.search(command);
    const foundCommand = results.length ? results[0].item : null;
    const currentPath = window.location.pathname;
  
    if (foundCommand) {
      console.log("Command text to process:", command);
      console.log("Command found:", foundCommand.utterance);
  
      if (foundCommand.action) {
        // Execute the action associated with the command
        foundCommand.action(command);
      } else if (foundCommand.route) {
        // Navigate to the route if it's different from the current path
        if (currentPath !== foundCommand.route) {
          navigate(foundCommand.route);
        } else {
          // If already on the requested page, inform the user
          speak("You are already on this page.");
          return; // Prevent further execution to avoid speaking the regular response
        }
      }
  
      // Speak the response only if it's a different route or an action was performed
      if (!foundCommand.route || currentPath !== foundCommand.route) {
        speak(foundCommand.response);
      }
    } else {
      console.log("No command found.");
      speak("I'm not sure how to respond to that.");
    }
  };
  

  const extractNumber = (spokenText) => {
    if (!spokenText) return null; // Return null if spokenText is undefined or null
  
    const sanitizedText = spokenText.replace(/[.,]/g, '');
    const matches = sanitizedText.match(/\d+/);
    return matches ? matches[0] : null;
  };


  const commands = [
    {
      utterance: "Hello who are you ?",

      response:
        "Hi! This is Brane! your Voice bot from Brane Education How can I Assist you Today ?",
    },

    {
      utterance: "Hello",

      response: "Hi! How can I assist you today?",
    },

    {
      utterance: "hello",

      response: "Hi! How can I assist you today?",
    },

    {
      utterance: "Hi.",

      response: "Hello! How can I assist you today?",
    },

    {
      utterance: "Hey there",

      response: "Hi! How can I assist you today?",
    },

    {
      utterance: "Good morning Brane.",

      response: "Hey Hiii! Good morning  ! How can I help you?",
    },

    {
      utterance: "Good afternoon Brane.",

      response: "Hey Hiii! Good after noon ! How can I help you?",
    },

    {
      utterance: "Good evening Brane.",

      response: "Hey Hiii! Good evening ! How can I help you?",
    },

    {
      utterance: "take me to homepage",

      route: "/",

      response: "You're in Homepage now",
    },
    {
      utterance: "open homepage",

      route: "/",

      response: "You're in Homepage now",
    },
    {
      utterance: "go to homepage",

      route: "/",

      response: "You're in Homepage now",
    },
    {
      utterance: "go back to homepage",

      route: "/",

      response: "You're in Homepage now",
    },
    {
      utterance: "can you please take me to login page",

      route: "/login",

      response: "Here's the Login Page, Please Login",
    },

    {
      utterance: "please take me to login page",

      route: "/login",

      response: "Here's the Login Page, Please Login",
    },

    {
      utterance: "Go to login page",

      route: "/login",

      response: "Here's the Login Page, Please Login",
    },

    {
      utterance: "open login page",

      route: "/login",

      response: "Here's the Login Page, Please Login",
    },

    {
      utterance: "can you please take me to signup page",

      route: "/signup",

      response: "Here's the signup page. Please proceed With Registration.",
    },

    {
      utterance: "take me to signup page",

      route: "/signup",

      response: "Here's the signup page. Please proceed With Registration.",
    },

    {
      utterance: "Go to signup page",

      route: "/signup",

      response: "Here's the signup page. Please proceed With Registration.",
    },

    {
      utterance: "open signup page",

      route: "/signup",

      response: "Here's the signup page. Please proceed With Registration.",
    },

    {
      utterance: "Go to face id",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },

    {
      utterance: "Go to face id login",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },
    {
      utterance: "Go to face login",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },

    {
      utterance: "login with face id",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },

    {
      utterance: "login with face",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },

    {
      utterance: "i want to login with face",

      route: "/login/faceid",

      response: "Here's Face ID Login. Please proceed.",
    },

    {
      utterance: "login with voice",

      route: "/login/voiceid",

      response: "Here's Voice Login. Please proceed.",
    },

    {
      utterance: "i want to login with voice",

      route: "/login/voiceid",

      response: "Here's Voice Login. Please proceed.",
    },

    {
      utterance: "go to voice login",

      route: "/login/voiceid",

      response: "Here's Voice Login. Please proceed.",
    },

    {
      utterance: "login with voice",

      route: "/login/voiceid",

      response: "Here's Voice Login. Please proceed.",
    },

    {
      utterance: "login with mobile",

      route: "/login/mobile",

      response: "Here's Mobile Login. Please proceed.",
    },

    {
      utterance: "i want to login with mobile",

      route: "/login/mobile",

      response: "Here's Mobile Login. Please proceed.",
    },
    {
      utterance: "go to mobile login",

      route: "/login/mobile",

      response: "Here's Mobile Login. Please proceed.",
    },
    {
      utterance: "go to about page",

      route: "/aboutus",

      response: "This is About us.",
    },
    {
      utterance: "go to about us page",

      route: "/aboutus",

      response: "This is About us.",
    },
    {
      utterance: "open about us page",

      route: "/aboutus",

      response: "This is About us.",
    },
    {
      utterance: "open about page",

      route: "/aboutus",

      response: "This is About us.",
    },
    {
      utterance: "take me to about page",

      route: "/aboutus",

      response: "This is About us.",
    },
    {
      utterance: "take me to about us page",

      route: "/aboutus",

      response: "This is About us.",
    },

    {
      utterance: "go to contact page",

      route: "/contactus",

      response: "You can contact us from here",
    },
    {
      utterance: "go to contact us page",

      route: "/contactus",

      response: "You can contact us from here",
    },
    {
      utterance: "open contact us page",

      route: "/contactus",

      response: "You can contact us from here",
    },
    {
      utterance: "open contact page",

      route: "/contactus",

      response: "You can contact us from here",
    },
    {
      utterance: "take me to about page",

      route: "/contactus",

      response: "You can contact us from here",
    },
    {
      utterance: "take me to contact us page",

      route: "/contactus",

      response: "You can contact us from here",
    },

    {
      utterance: "what are platform features",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "Features of platform",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "What does the platform offer",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "Say me the features of platform",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "Say me the services of platform",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "tell me the services offered by the platform",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "explain platform services",

      response:
        "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
    },

    {
      utterance: "Give me the Parent voice of Julia Harris",

      response:
        "Brane education has helped my son a lot in his studies. He improved a lot in his studies and is now able to score good marks in his exams",
    },

    {
      utterance: "Leaders Voice",

      response:
        "This Voice-interactive AI Platform is a game Changer. It revolutionizes education.",
    },

    {
      utterance: "Curriculum Supported by Brane Education",

      response:
        "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
    },

    {
      utterance: "Boards supported by the platform",

      response:
        "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
    },

    {
      utterance: "Curriculum",

      response:
        "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
    },

    {
      utterance: "what is today's quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

      route: "/childpage",
    },

    {
      utterance: "Today's Inspirational quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

      route: "/childpage",
    },

    {
      utterance: "say me today's quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

      route: "/childpage",
    },
    {
      utterance: "go back",
      response: "",
      action: goBack, // Note the use of an action property
    },
    {
      utterance: "go forward",
      response: "",
      action: goForward,
    },
    // {
    //   utterance: "play video",
    //   // response: "Playing video.",
    //   action: playVideo,
    // },
    // {
    //   utterance: "pause video",
    //   // response: "Pausing video.",
    //   action: pauseVideo,
    // },
    // {
    //   utterance: "start video",
    //   // response: "Playing video.",
    //   action: playVideo,
    // },
    // {
    //   utterance: "stop video",
    //   // response: "Playing video.",
    //   action: pauseVideo,
    // },
    {
      utterance: "scroll up",
      // response: "Scrolling up.",
      action: scrollUp,
    },
    {
      utterance: "scroll down",
      // response: "Scrolling down.",
      action: scrollDown,
    },
    {
      utterance: "go up",

      // response: "Scrolling up.",
      action: scrollUp,
    },
    {
      utterance: "go down",
      // response: "Scrolling down.",
      action: scrollDown,
    },
    {
      utterance: "scroll to top",
      action: scrollToTop,
    },
    {
      utterance: "scroll to bottom",
      action: scrollToBottom,
    },
    {
      utterance: "brane stop",
      action: stopListening,
    },
    {
      utterance: "brane turn off",
      action: stopListening,
    },
    {
      utterance: "brane stop the bot",
      action: stopListening,
    },
    // {
    //   utterance: "mute the video",
    //   action: muteVideo,
    // },
    // {
    //   utterance: "unmute the video",
    //   action: unmuteVideo,
    // },
    // {
    //   utterance: "stop the video sound",
    //   action: muteVideo,
    // },
    // {
    //   utterance: "play the video sound",
    //   action: unmuteVideo,
    // },
    {
      utterance: "play transforming education video",
      action: () => controlVideo("ourProjectsVideo", "play"),
    },
    {
      utterance: "start transforming education video",
      action: () => controlVideo("ourProjectsVideo", "play"),
    },
    {
      utterance: "pause transforming education video",
      action: () => controlVideo("ourProjectsVideo", "pause"),
    },
    {
      utterance: "stop transforming education video",
      action: () => controlVideo("ourProjectsVideo", "pause"),
    },
    {
      utterance: "mute transforming education video",
      action: () => controlVideo("ourProjectsVideo", "mute"),
    },
    {
      utterance: "unmute transforming education video",
      action: () => controlVideo("ourProjectsVideo", "unmute"),
    },
    {
      utterance: "fullscreen transforming education video",
      action: () => controlVideo("ourProjectsVideo", "fullscreen"),
    },
    {
      utterance: "exit fullscreen transforming education video",
      action: () => controlVideo("ourProjectsVideo", "exitFullscreen"),
    },
    {
      utterance: "increase volume transforming education video",
      action: () => controlVideo("ourProjectsVideo", "increaseVolume"),
    },
    {
      utterance: "decrease volume transforming education video",
      action: () => controlVideo("ourProjectsVideo", "decreaseVolume"),
    },
    {
      utterance: "play the video about transforming education",
      action: () => controlVideo("ourProjectsVideo", "play"),
    },
    {
      utterance: "start the transforming education video",
      action: () => controlVideo("ourProjectsVideo", "play"),
    },
    {
      utterance: "can you pause the video on transforming education",
      action: () => controlVideo("ourProjectsVideo", "pause"),
    },
    {
      utterance: "stop the video about transforming education",
      action: () => controlVideo("ourProjectsVideo", "pause"),
    },
    {
      utterance: "mute the transforming education video",
      action: () => controlVideo("ourProjectsVideo", "mute"),
    },
    {
      utterance: "unmute the video on transforming education",
      action: () => controlVideo("ourProjectsVideo", "unmute"),
    },
    {
      utterance: "make the transforming education video fullscreen",
      action: () => controlVideo("ourProjectsVideo", "fullscreen"),
    },
    {
      utterance: "exit fullscreen on the transforming education video",
      action: () => controlVideo("ourProjectsVideo", "exitFullscreen"),
    },
    {
      utterance: "increase the volume of the transforming education video",
      action: () => controlVideo("ourProjectsVideo", "increaseVolume"),
    },
    {
      utterance: "decrease the volume of the transforming education video",
      action: () => controlVideo("ourProjectsVideo", "decreaseVolume"),
    },

    {
      utterance: "play leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "play"),
    },
    {
      utterance: "start leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "play"),
    },
    {
      utterance: "pause leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "pause"),
    },
    {
      utterance: "stop leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "pause"),
    },
    {
      utterance: "mute leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "mute"),
    },
    {
      utterance: "unmute leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "unmute"),
    },
    {
      utterance: "fullscreen leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "fullscreen"),
    },
    {
      utterance: "exit fullscreen leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "exitFullscreen"),
    },
    {
      utterance: "increase volume leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "increaseVolume"),
    },
    {
      utterance: "decrease volume leaders voice video",
      action: () => controlVideo("leadersVoiceVideo", "decreaseVolume"),
    },

    {
      utterance: "set mobile number to *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const mobileNumber = extractNumber(spokenText);
        if (mobileNumber) {
          setMobileNumber(mobileNumber);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "enter mobile number as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const mobileNumber = extractNumber(spokenText);
        if (mobileNumber) {
          setMobileNumber(mobileNumber);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "enter my mobile number as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const mobileNumber = extractNumber(spokenText);
        if (mobileNumber) {
          setMobileNumber(mobileNumber);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "set mobile number as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const mobileNumber = extractNumber(spokenText);
        if (mobileNumber) {
          setMobileNumber(mobileNumber);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "fill mobile number as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const mobileNumber = extractNumber(spokenText);
        if (mobileNumber) {
          setMobileNumber(mobileNumber);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "set password as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "enter password as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "change password to *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "fill password as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "set pin as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "set pin to *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "enter pin as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "fill pin as *",
      action: (spokenText) => {
        if (!spokenText) {
          speak("I couldn't understand the command.");
          return;
        }
        const pin = extractNumber(spokenText);
        if (pin) {
          setPin(pin);
        } else {
          speak("I couldn't find a number in your command.");
        }
      },
    },
    {
      utterance: "press login",
      action: () => {
        triggerLogin();
        speak("Attempting to log in.");
      },
    },
    {
      utterance: "press login button",
      action: () => {
        triggerLogin();
        speak("Attempting to log in.");
      },
    },
    {
      utterance: "click login button",
      action: () => {
        triggerLogin();
        speak("Attempting to log in.");
      },
    },
    {
      utterance: "click login",
      action: () => {
        triggerLogin();
        speak("Attempting to log in.");
      },
    },
    {
      utterance: "press record audio",
      action: () => {
        console.log("Record Audio command detected");
        setTriggerRecordAudio(true);
      },
      response: "Started"
    },
    {
      utterance: "press record audio button",
      action: () => {
        console.log("Record Audio command detected");
        setTriggerRecordAudio(true);
      },
      response: "Started"
    },
    {
      utterance: "click record audio",
      action: () => {
        console.log("Record Audio command detected");
        setTriggerRecordAudio(true);
      },
      response: "Started"
    },
    {
      utterance: "click record audio button",
      action: () => {
        console.log("Record Audio command detected");
        setTriggerRecordAudio(true);
      },
      response: "Started"
    },
    
  ];

  return (
    <div className="speech-bot-container">
      <div
        className={`button-container ${
          isListening ? "voicebotframeactive" : "voicebotframe"
        }`}
      >
        {/* <button onClick={isListening ? stopListening : startListening}>
          {isListening ? "Stop" : "Start"} Animation
        </button> */}
        <img
          className="botimage"
          src={chatbotimage}
          alt=""
          onClick={isListening ? stopListening : startListening}
        />
      </div>
    </div>
  );
};

export default VoiceBot;

{
  /* // import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./VoiceBot.css";

// const VoiceBot = ({ videoRef }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognition = useRef(null);
//   const speechSynthesis = useRef(window.speechSynthesis);
//   const [hasGreeted, setHasGreeted] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     recognition.current = new window.webkitSpeechRecognition();
//     recognition.current.continuous = true;
//     recognition.current.interimResults = false;
//     recognition.current.onresult = onResult;
//     recognition.current.onend = onRecognitionEnd;
//     recognition.current.starting = false;

//     // Simplified error handling, removed specific handling for 'no-speech'
//     recognition.current.onerror = (event) => {
//       console.error("Recognition error:", event.error);
//       // Check if listening is true and the bot isn't speaking
//       if (isListening && !isSpeaking) {
//         // Restart recognition
//         restartRecognition();
//       }
//     };

//     return () => {
//       if (recognition.current) {
//         recognition.current.abort();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const checkRecognition = () => {
//       if (isListening && !isSpeaking && !recognition.current.starting) {
//         console.log("Restarting recognition because it's not active.");
//         recognition.current.starting = true;
//         recognition.current.start();
//         console.log("Restarted recognition.");
//       }
//     };

//     const recognitionCheckInterval = setInterval(checkRecognition, 100); // Check every 1 second

//     return () => {
//       clearInterval(recognitionCheckInterval);
//     };
//   }, [isListening, isSpeaking]);

//   const restartRecognition = () => {
//     if (recognition.current.starting) {
//       console.log("Recognition is already starting or running.");
//       return;
//     }

//     recognition.current.abort(); // Stop any existing recognition process
//     recognition.current.starting = true;
//     recognition.current.start();
//     console.log("Recognition restarted.");
//   };

//   const historyStack = useRef([]);

//   useEffect(() => {
//     return () => {
//       // Clean up the listener when the component unmounts
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);

//   const handlePopState = () => {
//     // This needs to handle both back and forward browser actions
//     // Use some logic to determine whether it's a back or forward action
//     // For simplicity, assume it's always back
//     historyStack.current.pop();
//     forwardStack.current.length = 0; // Clear forward stack on manual navigation
//   };
  

//   // Add a new entry to the stack whenever navigate is called
//   const customNavigate = (to, options) => {
//     historyStack.current.push(to);
//     navigate(to, options);
//   };

//   // Listen to popstate events to update the history stack
//   useEffect(() => {
//     window.addEventListener("popstate", handlePopState);
//   }, []);

//   const forwardStack = useRef([]);

//   const goBack = () => {
//     if (window.history.state && window.history.state.idx > 0) {
//       window.history.back();
//       speak("Going back");
//     } else {
//       speak("Can't go back any further.");
//     }
//   };

//   const goForward = () => {
//     if (window.history.state && window.history.state.idx < window.history.length - 1) {
//       window.history.forward();
//       speak("Going forward");
//     } else {
//       speak("No forward history available.");
//     }
//   };

//   const playVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//       speak("Playing video.");
//     } else {
//       speak("No video to play.");
//     }
//   };

//   const pauseVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       speak("Video paused.");
//     } else {
//       speak("No video to pause.");
//     }
//   };

//   const scrollAmount = window.innerHeight * 0.82;

//   const scrollUp = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollBy(0, -scrollAmount);
//       speak("Scrolled up.");
//     }
//   };

//   const scrollDown = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollBy(0, scrollAmount);
//       speak("Scrolled down.");
//     }
//   };

//   const scrollToTop = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollTo(0, 0);
//       speak("Scrolled to the top of the page.");
//     }
//   };

//   const scrollToBottom = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollTo(0, document.body.scrollHeight);
//       speak("Scrolled to the bottom of the page.");
//     }
//   };

//   const speak = (message) => {
//     console.log("speak function called with message:", message);
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       console.log("Speaking ended.");
//       if (isListening && !recognition.current.starting) {
//         console.log("Restarting recognition after speaking.");
//         recognition.current.starting = true;
//         recognition.current.start();
//         console.log("Restarted recognition after speaking.");
//       }
//     };

//     setIsSpeaking(true);
//     console.log("Speaking started.");
//     recognition.current.stop(); // Ensure to stop recognition before speaking
//     speechSynthesis.current.speak(utterance);
//   };

//   const onResult = (event) => {
//     const resultIndex = event.resultIndex;
//     const transcript = event.results[resultIndex][0].transcript
//       .trim()
//       .toLowerCase();

//     if (event.results[resultIndex].isFinal) {
//       console.log(`Recognized text: ${transcript}`);
//       if (transcript.includes("brain")) {
//         console.log("Wake word heard, processing command...");
//         handleCommandWithFuse(transcript.replace("brain", ""));
//       }
//     }
//   };

//   const onRecognitionEnd = () => {
//     recognition.current.starting = false;
//     if (isListening && !isSpeaking) {
//       restartRecognition();
//     }
//   };

//   useEffect(() => {
//     if (isListening) {
//       if (!hasGreeted) {
//         speak("Hello, I'm Brane. How can I help you today?");
//         setHasGreeted(true);
//       } else {
//         speak("Listening.");
//       }
//     }
//   }, [isListening, hasGreeted]);


//   const startListening = () => {
//     if (!recognition.current.starting) {
//       setIsListening(true);
//       restartRecognition();
//     }
//   };

//   const stopListening = () => {
//     setIsListening(false);
//     recognition.current.abort();
//     if (speechSynthesis.current.speaking) {
//       speechSynthesis.current.cancel();
//     }
//   };

//   const handleCommandWithFuse = (command) => {
//     const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//     const results = fuse.search(command);
//     const foundCommand = results.length ? results[0].item : null;

//     if (foundCommand) {
//       console.log("Command found:", foundCommand.utterance);

//       if (foundCommand.action) {
//         foundCommand.action();
//       } else if (foundCommand.route) {
//         navigate(foundCommand.route);
//       }

//       // Speak after performing the action or navigation
//       speak(foundCommand.response);
//     } else {
//       console.log("No command found.");
//       speak("I'm not sure how to respond to that.");
//     }
//   };

//   const commands = [
//     {
//       utterance: "Hello who are you ?",

//       response:
//         "Hi! This is Brane! your Voice bot from Brane Education How can I Assist you Today ?",
//     },

//     {
//       utterance: "Hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Hi.",

//       response: "Hello! How can I assist you today?",
//     },

//     {
//       utterance: "Hey there",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Good morning Brane.",

//       response: "Hey Hiii! Good morning  ! How can I help you?",
//     },

//     {
//       utterance: "Good afternoon Brane.",

//       response: "Hey Hiii! Good after noon ! How can I help you?",
//     },

//     {
//       utterance: "Good evening Brane.",

//       response: "Hey Hiii! Good evening ! How can I help you?",
//     },

//     {
//       utterance: "can you please take me to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "please take me to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "Go to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "open login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "can you please take me to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "take me to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "Go to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "open signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "Go to face id",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "Go to face id login",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with face id",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with face",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with face",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "go to voice login",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "login with mobile",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with mobile",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },
//     {
//       utterance: "go to mobile login",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },

//     {
//       utterance: "what are platform features",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "What does the platform offer",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the services of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "tell me the services offered by the platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "explain platform services",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Give me the Parent voice of Julia Harris",

//       response:
//         "Brane education has helped my son a lot in his studies. He improved a lot in his studies and is now able to score good marks in his exams",
//     },

//     {
//       utterance: "Play today's motivational video",

//       response: "I am playing the video",
//     },

//     {
//       utterance: "Play today's video",

//       response: "I am playing Motivational video",
//     },

//     {
//       utterance: "Leaders Voice",

//       response:
//         "This Voice-interactive AI Platform is a game Changer. It revolutionizes education.",
//     },

//     {
//       utterance: "Curriculum Supported by Brane Education",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Boards supported by the platform",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Curriculum",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Go to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "take me to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "roll back to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "what is today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },

//     {
//       utterance: "Today's Inspirational quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },

//     {
//       utterance: "say me today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },
//     {
//       utterance: "go back",
//       response: "",
//       action: goBack, // Note the use of an action property
//     },
//     {
//       utterance: "go forward",
//       response: "",
//       action: goForward,
//     },
//     {
//       utterance: "play video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "pause video",
//       // response: "Pausing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "start video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "stop video",
//       // response: "Playing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "scroll up",
//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "scroll down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "go up",

//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "go down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "scroll to top",
//       action: scrollToTop,
//     },
//     {
//       utterance: "scroll to bottom",
//       action: scrollToBottom,
//     },
//     {
//       utterance: "brane stop",
//       action: stopListening,
//     },
//     {
//       utterance: "brane turn off",
//       action: stopListening,
//     },
//     {
//       utterance: "brane stop the bot",
//       action: stopListening,
//     },
//   ];

//   return (
//     <div className="speech-bot-container">
//       <div
//         className={`button-container ${
//           isListening ? "voicebotframeactive" : "voicebotframe"
//         }`}
//       >
//         <button onClick={isListening ? stopListening : startListening}>
//           {isListening ? "Stop" : "Start"} Animation
//         </button>
//         {/* <button onClick={toggleBotActive}>
//         {isBotActive ? 'Deactivate Bot' : 'Activate Bot'}
//       </button> 
//       </div>
//     </div>
//   );
// };

// export default VoiceBot; */
}

//iska v1

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./VoiceBot.css";

// const VoiceBot = ({ videoRef}) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognition = useRef(null);
//   const speechSynthesis = useRef(window.speechSynthesis);
//   const [hasGreeted, setHasGreeted] = useState(false);
//   const navigate = useNavigate();

//  // Initialize speech recognition
//  useEffect(() => {
//   recognition.current = new window.webkitSpeechRecognition();
//   recognition.current.continuous = true;
//   recognition.current.interimResults = false;
//   recognition.current.onresult = onResult;
//   recognition.current.onend = onRecognitionEnd;
//   recognition.current.starting = false;

//   recognition.current.onerror = (event) => {
//     console.error("Recognition error:", event.error);
//     if (isListening && !isSpeaking) {
//       restartRecognition();
//     }
//   };

//   return () => {
//     if (recognition.current) {
//       recognition.current.abort();
//     }
//   };
// }, []);

//   // useEffect(() => {
//   //   const checkRecognition = () => {
//   //     if (isListening && !isSpeaking && !recognition.current.starting) {
//   //       console.log("Restarting recognition because it's not active.");
//   //       recognition.current.starting = true;
//   //       recognition.current.start();
//   //       console.log("Restarted recognition.");
//   //     }
//   //   };

//   //   const recognitionCheckInterval = setInterval(checkRecognition, 100); // Check every .5 second

//   //   return () => {
//   //     clearInterval(recognitionCheckInterval);
//   //   };
//   // }, [isListening, isSpeaking]);

//   const historyStack = useRef([]);

//   useEffect(() => {
//     return () => {
//       // Clean up the listener when the component unmounts
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);

//   const handlePopState = () => {
//     // This needs to handle both back and forward browser actions
//     // Use some logic to determine whether it's a back or forward action
//     // For simplicity, assume it's always back
//     historyStack.current.pop();
//     forwardStack.current.length = 0; // Clear forward stack on manual navigation
//   };

//   // Add a new entry to the stack whenever navigate is called
//   const customNavigate = (to, options) => {
//     historyStack.current.push(to);
//     navigate(to, options);
//   };

//   // Listen to popstate events to update the history stack
//   useEffect(() => {
//     window.addEventListener("popstate", handlePopState);
//   }, []);

//   const forwardStack = useRef([]);

//   const goBack = () => {
//     if (window.history.state && window.history.state.idx > 0) {
//       window.history.back();
//       speak("Going back");
//     } else {
//       speak("Can't go back any further.");
//     }
//   };

//   const goForward = () => {
//     if (window.history.state && window.history.state.idx < window.history.length - 1) {
//       window.history.forward();
//       speak("Going forward");
//     } else {
//       speak("No forward history available.");
//     }
//   };

//   const playVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.play();
//       speak("Playing video.");
//     } else {
//       speak("No video to play.");
//     }
//   };

//   const pauseVideo = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       speak("Video paused.");
//     } else {
//       speak("No video to pause.");
//     }
//   };

//   const scrollAmount = window.innerHeight * 0.82;

//   const scrollUp = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollBy(0, -scrollAmount);
//       speak("Scrolled up.");
//     }
//   };

//   const scrollDown = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollBy(0, scrollAmount);
//       speak("Scrolled down.");
//     }
//   };

//   const scrollToTop = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollTo(0, 0);
//       speak("Scrolled to the top of the page.");
//     }
//   };

//   const scrollToBottom = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollTo(0, document.body.scrollHeight);
//       speak("Scrolled to the bottom of the page.");
//     }
//   };

//   const speak = (message) => {
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       // Restart recognition after speaking has ended
//       if (isListening) {
//         restartRecognition();
//       }
//     };

//     setIsSpeaking(true);
//     // Stop recognition when the bot starts speaking
//     if (recognition.current) {
//       recognition.current.abort();
//     }
//     speechSynthesis.current.speak(utterance);
//   };

//   const restartRecognition = () => {
//     // Check if recognition is not already started and if the bot is set to listen
//     if (recognition.current && !recognition.current.starting && isListening && !isSpeaking) {
//       // Only start recognition if it's not already active
//       if (recognition.current.state !== 'active') {
//         recognition.current.abort(); // Ensure any ongoing recognition is stopped
//         recognition.current.starting = true;
//         recognition.current.start();
//       }
//     }
//   };

//     // Restart recognition when bot finishes speaking and isListening is true
//     useEffect(() => {
//       if (!isSpeaking && isListening) {
//         restartRecognition();
//       }
//     }, [isSpeaking, isListening]);

//   const onResult = (event) => {
//     const resultIndex = event.resultIndex;
//     const transcript = event.results[resultIndex][0].transcript
//       .trim()
//       .toLowerCase();

//     if (event.results[resultIndex].isFinal) {
//       console.log(`Recognized text: ${transcript}`);
//       if (transcript.includes("brain")) {
//         console.log("Wake word heard, processing command...");
//         handleCommandWithFuse(transcript.replace("brain", ""));
//       }
//     }
//   };

//   const onRecognitionEnd = () => {
//     recognition.current.starting = false;
//     if (isListening && !isSpeaking) {
//       restartRecognition();
//     }
//   };

//   useEffect(() => {
//     if (isListening && !hasGreeted) {
//       speak("Hello, I'm Brane. How can I help you today?");
//       setHasGreeted(true);
//     }
//   }, [isListening, hasGreeted]);

// // Updated startListening function
// const startListening = () => {
//   setIsListening(true);
//   if (recognition.current && !recognition.current.starting) {
//     recognition.current.start();
//   }
// };

// // Updated stopListening function
// const stopListening = () => {
//   setIsListening(false);
//   setIsSpeaking(false); // Reset speaking state
//   setHasGreeted(false); // Reset greeting state if needed
//   if (recognition.current) {
//     recognition.current.abort(); // Stop any ongoing speech recognition
//   }
//   if (speechSynthesis.current.speaking) {
//     speechSynthesis.current.cancel(); // Stop any ongoing speech synthesis
//   }
// };

//   const handleCommandWithFuse = (command) => {
//     const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//     const results = fuse.search(command);
//     const foundCommand = results.length ? results[0].item : null;

//     if (foundCommand) {
//       console.log("Command found:", foundCommand.utterance);

//       if (foundCommand.action) {
//         foundCommand.action();
//       } else if (foundCommand.route) {
//         navigate(foundCommand.route);
//       }

//       // Speak after performing the action or navigation
//       speak(foundCommand.response);
//     } else {
//       console.log("No command found.");
//       speak("I'm not sure how to respond to that.");
//     }
//   };

//   const commands = [
//     {
//       utterance: "Hello who are you ?",

//       response:
//         "Hi! This is Brane! your Voice bot from Brane Education How can I Assist you Today ?",
//     },

//     {
//       utterance: "Hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Hi.",

//       response: "Hello! How can I assist you today?",
//     },

//     {
//       utterance: "Hey there",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Good morning Brane.",

//       response: "Hey Hiii! Good morning  ! How can I help you?",
//     },

//     {
//       utterance: "Good afternoon Brane.",

//       response: "Hey Hiii! Good after noon ! How can I help you?",
//     },

//     {
//       utterance: "Good evening Brane.",

//       response: "Hey Hiii! Good evening ! How can I help you?",
//     },

//     {
//       utterance: "can you please take me to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "please take me to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "Go to login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "open login page",

//       route: "/login",

//       response: "Here's the Login Page, Please Login",
//     },

//     {
//       utterance: "can you please take me to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "take me to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "Go to signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "open signup page",

//       route: "/signup",

//       response: "Here's the signup page. Please proceed With Registration.",
//     },

//     {
//       utterance: "Go to face id",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "Go to face id login",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },
//     {
//       utterance: "Go to face login",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with face id",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with face",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with face",

//       route: "/login/faceid",

//       response: "Here's Face ID Login. Please proceed.",
//     },

//     {
//       utterance: "login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "go to voice login",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "login with voice",

//       route: "/login/voiceid",

//       response: "Here's Voice Login. Please proceed.",
//     },

//     {
//       utterance: "login with mobile",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },

//     {
//       utterance: "i want to login with mobile",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },
//     {
//       utterance: "go to mobile login",

//       route: "/login/mobile",

//       response: "Here's Mobile Login. Please proceed.",
//     },

//     {
//       utterance: "what are platform features",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "What does the platform offer",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the services of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "tell me the services offered by the platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "explain platform services",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Give me the Parent voice of Julia Harris",

//       response:
//         "Brane education has helped my son a lot in his studies. He improved a lot in his studies and is now able to score good marks in his exams",
//     },

//     {
//       utterance: "Play today's motivational video",

//       response: "I am playing the video",
//     },

//     {
//       utterance: "Play today's video",

//       response: "I am playing Motivational video",
//     },

//     {
//       utterance: "Leaders Voice",

//       response:
//         "This Voice-interactive AI Platform is a game Changer. It revolutionizes education.",
//     },

//     {
//       utterance: "Curriculum Supported by Brane Education",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Boards supported by the platform",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Curriculum",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Go to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "take me to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "roll back to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "what is today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },

//     {
//       utterance: "Today's Inspirational quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },

//     {
//       utterance: "say me today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       route: "/childpage",
//     },
//     {
//       utterance: "go back",
//       response: "",
//       action: goBack, // Note the use of an action property
//     },
//     {
//       utterance: "go forward",
//       response: "",
//       action: goForward,
//     },
//     {
//       utterance: "play video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "pause video",
//       // response: "Pausing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "start video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "stop video",
//       // response: "Playing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "scroll up",
//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "scroll down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "go up",

//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "go down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "scroll to top",
//       action: scrollToTop,
//     },
//     {
//       utterance: "scroll to bottom",
//       action: scrollToBottom,
//     },
//     {
//       utterance: "brane stop",
//       action: stopListening,
//     },
//     {
//       utterance: "brane turn off",
//       action: stopListening,
//     },
//     {
//       utterance: "brane stop the bot",
//       action: stopListening,
//     },
//   ];

//   return (
//     <div className="speech-bot-container">
//       <div
//         className={`button-container ${
//           isListening ? "voicebotframeactive" : "voicebotframe"
//         }`}
//       >
//         <button onClick={isListening ? stopListening : startListening}>
//           {isListening ? "Stop" : "Start"} Animation
//         </button>
//         {/* <button onClick={toggleBotActive}>
//         {isBotActive ? 'Deactivate Bot' : 'Activate Bot'}
//       </button> */}
//       </div>
//     </div>
//   );
// };

// export default VoiceBot;

//Bot Video added but some start issues

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./VoiceBot.css";

// const VoiceBot = ({ videoRef }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognition = useRef(null);
//   const speechSynthesis = useRef(window.speechSynthesis);
//   const hasGreeted = useRef(false);
//   const restartRecognitionTimeout = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isRecognitionActive, setIsRecognitionActive] = useState(false); // New state to track recognition status

//   useEffect(() => {
//     recognition.current = new window.webkitSpeechRecognition();
//     recognition.current.continuous = true;
//     recognition.current.interimResults = false;
//     recognition.current.onresult = onResult;
//     recognition.current.onend = () => {
//       console.log("Recognition ended.");
//       if (isListening) {
//         startListening();
//       }
//     };
//     recognition.current.onerror = (event) => {
//       console.error("Recognition error:", event.error);
//     };

//     return () => {
//       recognition.current.abort();
//     };
//   }, []);

//   // Update useEffect for managing the recognition state based on isListening and isRecognitionActive
//   useEffect(() => {
//     if (isListening && !isRecognitionActive) {
//       startListening();
//     } else if (!isListening && isRecognitionActive) {
//       stopListening();
//     }
//   }, [isListening, isRecognitionActive]);

//   const goBack = () => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       speak("Can't go back any further.");
//     }
//   };

//   const goForward = () => {
//     // Unfortunately, there's no direct way to check if you can go forward in the history.
//     // You might need to manage this state manually based on user navigation.
//     navigate(1);
//   };

//   const playVideo = () => {
//     if (videoRef.current && !videoRef.current.paused) {
//       speak("Video is already playing.");
//     } else if (videoRef.current) {
//       videoRef.current.play();
//       speak("Playing video.");
//     } else {
//       speak("No video to play.");
//     }
//   };

//   const pauseVideo = () => {
//     if (videoRef.current && videoRef.current.paused) {
//       speak("Video is already paused.");
//     } else if (videoRef.current) {
//       videoRef.current.pause();
//       speak("Video paused.");
//     } else {
//       speak("No video to pause.");
//     }
//   };

//   const scrollAmount = window.innerHeight * 0.82;

//   const scrollUp = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollBy(0, -scrollAmount);
//       speak("Scrolled up.");
//     }
//   };

//   const scrollDown = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollBy(0, scrollAmount);
//       speak("Scrolled down.");
//     }
//   };

//   const scrollToTop = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollTo(0, 0);
//       speak("Scrolled to the top of the page.");
//     }
//   };

//   const scrollToBottom = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollTo(0, document.body.scrollHeight);
//       speak("Scrolled to the bottom of the page.");
//     }
//   };

//   // const speak = (message) => {
//   //   const utterance = new SpeechSynthesisUtterance(message);
//   //   utterance.onend = () => {
//   //     setIsSpeaking(false);
//   //     console.log("Speaking ended.");
//   //     // Only restart recognition if we're still supposed to be listening
//   //     // if (isListening) {
//   //     //   if (restartRecognitionTimeout.current) {
//   //     //     clearTimeout(restartRecognitionTimeout.current);
//   //     //   }
//   //     //   restartRecognitionTimeout.current = setTimeout(() => {
//   //     //     console.log("Recognition restarted.");
//   //     //     recognition.current.start();
//   //     //   }, 100); // Delay to prevent immediate restart
//   //     // }
//   //     if (isListening && !recognition.current.starting) { // Check the flag before restarting
//   //       recognition.current.starting = true; // Set the flag when starting recognition
//   //       recognition.current.start();
//   //     }
//   //   };

//   //   setIsSpeaking(true);
//   //   console.log("Speaking started.");
//   //   recognition.current.stop(); // Stop recognition when the bot starts speaking
//   //   speechSynthesis.current.speak(utterance);
//   // };

//   const speak = (message) => {
//     console.log("speak function called with message:", message);
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       console.log("Speaking ended.");
//       // Directly handle the restart of recognition here if needed
//       if (isListening) {
//         startListening();
//       }
//     };

//     setIsSpeaking(true);
//     console.log("Speaking started.");
//     recognition.current.stop(); // Ensure to stop recognition before speaking
//     speechSynthesis.current.speak(utterance);
//   };

//   const onResult = (event) => {
//     const resultIndex = event.resultIndex;
//     const transcript = event.results[resultIndex][0].transcript
//       .trim()
//       .toLowerCase();

//     if (event.results[resultIndex].isFinal) {
//       console.log(`Recognized text: ${transcript}`);
//       if (transcript.includes("brain")) {
//         console.log("Wake word heard, processing command...");
//         handleCommandWithFuse(transcript.replace("brain", ""));
//       }
//     }
//   };

//   // const onRecognitionEnd = () => {
//   //   console.log("Recognition ended.");
//   //   setIsRecognitionActive(false); // Update state when recognition ends
//   //   recognition.current.starting = false; // Reset the flag when recognition ends
//   //   // We now check if the recognition is already running before starting it again
//   //   if (isListening && !isSpeaking && !recognition.current?.starting) {
//   //     console.log("Restarting recognition.");
//   //     recognition.current.start();
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (isListening && !hasGreeted.current) {
//   //     speak("Hello, I'm Brane. How can I assist you today?");
//   //     hasGreeted.current = true;
//   //   } else if (isListening && !isSpeaking) {
//   //     recognition.current.start();
//   //   }
//   // }, [isListening, isSpeaking]);

//   useEffect(() => {
//     if (isListening && !hasGreeted.current) {
//       speak("Hello, I'm Brane. How can I assist you today?");
//       hasGreeted.current = true;
//     } else if (isListening && !isSpeaking && !recognition.current.starting) {
//       // Check the flag before starting
//       recognition.current.starting = true; // Set the flag when starting recognition
//       recognition.current.start();
//     }
//   }, [isListening, isSpeaking]);

//   // const startListening = () => {
//   //   console.log("Attempting to start listening.");
//   //   if (recognition.current && !recognition.current.starting) {
//   //     setIsListening(true);
//   //     recognition.current.starting = true; // Set the flag when starting recognition
//   //     recognition.current.start();
//   //     console.log("Listening started.");
//   //   }
//   // };

//   // const stopListening = () => {
//   //   console.log("Stopping listening.");

//   //   setIsListening(false);
//   //   recognition.current.stop();
//   //   if (speechSynthesis.current.speaking) {
//   //     speechSynthesis.current.cancel();
//   //   }
//   //   if (restartRecognitionTimeout.current) {
//   //     clearTimeout(restartRecognitionTimeout.current);
//   //   }
//   //   console.log("Listening stopped.");
//   // };
//   // Handle start and stop listening logic
//   const startListening = () => {
//     console.log("Attempting to start listening.");
//     if (!recognition.current.starting) {
//       setIsListening(true);
//       recognition.current.starting = true;
//       recognition.current.start();
//       console.log("Listening started.");
//     } else {
//       console.log("Recognition already active.");
//     }
//   };

//   const stopListening = () => {
//     console.log("Stopping listening.");
//     if (recognition.current.starting) {
//       setIsListening(false);
//       recognition.current.starting = false;
//       recognition.current.stop();
//       console.log("Listening stopped.");
//     } else {
//       console.log("Recognition already inactive.");
//     }
//   };

//   // const handleCommandWithFuse = (command) => {
//   //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//   //   const results = fuse.search(command);
//   //   const foundCommand = results.length ? results[0].item : null;

//   //   if (foundCommand) {
//   //     console.log("Command found:", foundCommand.utterance);
//   //     speak(foundCommand.response);
//   //     if (foundCommand.route) {
//   //       navigate(foundCommand.route); // Navigate to the route specified in the command
//   //     }
//   //   } else {
//   //     console.log("No command found.");
//   //     speak("I'm not sure how to respond to that.");
//   //   }
//   // };

//   const handleCommandWithFuse = (command) => {
//     const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//     const results = fuse.search(command);
//     const foundCommand = results.length ? results[0].item : null;

//     if (foundCommand) {
//       console.log("Command found:", foundCommand.utterance);

//       if (foundCommand.route) {
//         if (location.pathname !== foundCommand.route) {
//           navigate(foundCommand.route);
//           speak(
//             `Navigating to ${
//               foundCommand.routeDescription || "requested page"
//             }.`
//           );
//         } else {
//           speak(
//             `You are already on the ${
//               foundCommand.routeDescription || "requested page"
//             }.`
//           );
//         }
//       } else if (foundCommand.action) {
//         foundCommand.action();
//       }

//       if (foundCommand.response) {
//         speak(foundCommand.response);
//       }
//     } else {
//       console.log("No command found.");
//       speak("I'm not sure how to respond to that.");
//     }
//   };

//   const commands = [
//     {
//       utterance: "Hello who are you ?",

//       response:
//         "Hi! This is Brane! your Voice bot from Brane Education How can I Assist you Today ?",
//     },

//     {
//       utterance: "Hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Hi.",

//       response: "Hello! How can I assist you today?",
//     },

//     {
//       utterance: "Hey there",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Good morning Brane.",

//       response: "Hey Hiii! Good morning  ! How can I help you?",
//     },

//     {
//       utterance: "Good afternoon Brane.",

//       response: "Hey Hiii! Good after noon ! How can I help you?",
//     },

//     {
//       utterance: "Good evening Brane.",

//       response: "Hey Hiii! Good evening ! How can I help you?",
//     },

//     {
//       utterance: "can you please take me to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "go to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "please take me to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "Go to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "open login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "can you please take me to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "take me to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "Go to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "open signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "what are platform features",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "What does the platform offer",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the services of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "tell me the services offered by the platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "explain platform services",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Give me the Parent voice of Julia Harris",

//       response:
//         "Brane education has helped my son a lot in his studies. He improved a lot in his studies and is now able to score good marks in his exams",
//     },

//     {
//       utterance: "Play today's motivational video",

//       response: "I am playing the video",
//     },

//     {
//       utterance: "Play today's video",

//       response: "I am playing Motivational video",
//     },

//     {
//       utterance: "Leaders Voice",

//       response:
//         "This Voice-interactive AI Platform is a game Changer. It revolutionizes education.",
//     },

//     {
//       utterance: "Curriculum Supported by Brane Education",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Boards supported by the platform",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Curriculum",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Go to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "take me to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "roll back to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "what is today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },

//     {
//       utterance: "Today's Inspirational quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },

//     {
//       utterance: "say me today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },
//     {
//       utterance: "go back",
//       response: "Going back.",
//       action: goBack, // Note the use of an action property
//     },
//     {
//       utterance: "go forward",
//       response: "Going forward.",
//       action: goForward,
//     },
//     {
//       utterance: "play video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "pause video",
//       // response: "Pausing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "start video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "stop video",
//       // response: "Playing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "scroll up",
//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "scroll down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "go up",

//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "go down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "scroll to top",
//       action: scrollToTop,
//     },
//     {
//       utterance: "scroll to bottom",
//       action: scrollToBottom,
//     },
//   ];
//   return (
//     <div className="speech-bot-container">
//       <div
//         className={`button-container ${
//           isListening ? "voicebotframeactive" : "voicebotframe"
//         }`}
//       >
//         <div onClick={isListening ? stopListening : startListening}>
//           <iframe
//             src={
//               isListening
//                 ? "https://lottie.host/?file=a89aca3f-5407-4052-82c3-2048afca7a9f/NpCdWzLSKD.json"
//                 : "https://lottie.host/?file=d2b6cc0e-fe95-4847-85b5-35365fca7e00/vTudpCuPZq.json"
//             }
//             width="120" // Set your desired width
//             height="120" // Set your desired height
//             title={isListening ? "Stop Animation" : "Start Animation"}
//             className={isListening ? "voicebotframeactive" : "voicebotframe"}
//           ></iframe>
//           {isListening ? (
//             <div className="overlay" onClick={stopListening}></div>
//           ) : (
//             <div className="overlay" onClick={startListening}></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceBot;

// All functionalities but messed up

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./VoiceBot.css";

// const VoiceBot = ({ videoRef, takeTestRef, goBackRef }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const recognition = useRef(null);
//   const speechSynthesis = useRef(window.speechSynthesis);
//   const hasGreeted = useRef(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isRecognitionActive = useRef(false);

//   useEffect(() => {
//     recognition.current = new window.webkitSpeechRecognition();
//     recognition.current.continuous = true;
//     recognition.current.interimResults = false;
//     recognition.current.onresult = onResult;
//     recognition.current.onend = onRecognitionEnd;

//     return () => {
//       if (recognition.current) {
//         recognition.current.abort();
//       }
//     };
//   }, [location.pathname]);

//   const onResult = (event) => {
//     const resultIndex = event.resultIndex;
//     const transcript = event.results[resultIndex][0].transcript
//       .trim()
//       .toLowerCase();

//     if (event.results[resultIndex].isFinal) {
//       console.log(`Recognized text: ${transcript}`);
//       if (transcript.includes("brain")) {
//         console.log("Wake word heard, processing command...");
//         handleCommandWithFuse(transcript.replace("brain", ""));
//       }
//     }
//   };

//   const startListening = () => {
//     if (!isRecognitionActive.current) {
//       setIsListening(true);
//       recognition.current.start();
//       isRecognitionActive.current = true;
//     }
//   };

//   const stopListening = () => {
//     if (isRecognitionActive.current) {
//       setIsListening(false);
//       recognition.current.stop();
//       isRecognitionActive.current = false;
//     }
//   };

//   const onRecognitionEnd = () => {
//     isRecognitionActive.current = false;
//     if (isListening) {
//       startListening();
//     }
//   };

//   const speak = (message) => {
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       if (isListening && !isRecognitionActive.current) {
//         startListening();
//       }
//     };

//     setIsSpeaking(true);
//     if (isRecognitionActive.current) {
//       stopListening(); // Adjusted to use stopListening
//     }
//     speechSynthesis.current.speak(utterance);
//   };

//   useEffect(() => {
//     if (isListening && !hasGreeted.current) {
//       speak("Hello, I'm Brane. How can I assist you today?");
//       hasGreeted.current = true;
//     }
//   }, [isListening]);

//   const goBack = () => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       speak("Can't go back any further.");
//     }
//   };

//   const goForward = () => {
//     // Unfortunately, there's no direct way to check if you can go forward in the history.
//     // You might need to manage this state manually based on user navigation.
//     navigate(1);
//   };

//   const playVideo = () => {
//     if (videoRef.current && !videoRef.current.paused) {
//       speak("Video is already playing.");
//     } else if (videoRef.current) {
//       videoRef.current.play();
//       speak("Playing video.");
//     } else {
//       speak("No video to play.");
//     }
//   };

//   const pauseVideo = () => {
//     if (videoRef.current && videoRef.current.paused) {
//       speak("Video is already paused.");
//     } else if (videoRef.current) {
//       videoRef.current.pause();
//       speak("Video paused.");
//     } else {
//       speak("No video to pause.");
//     }
//   };

//   const scrollAmount = window.innerHeight * 0.82;

//   const scrollUp = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollBy(0, -scrollAmount);
//       speak("Scrolled up.");
//     }
//   };

//   const scrollDown = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollBy(0, scrollAmount);
//       speak("Scrolled down.");
//     }
//   };

//   const scrollToTop = () => {
//     if (window.pageYOffset === 0) {
//       speak("Already at the top of the page.");
//     } else {
//       window.scrollTo(0, 0);
//       speak("Scrolled to the top of the page.");
//     }
//   };

//   const scrollToBottom = () => {
//     const maxScrollTop =
//       document.documentElement.scrollHeight - window.innerHeight;
//     if (window.pageYOffset >= maxScrollTop) {
//       speak("Already at the bottom of the page.");
//     } else {
//       window.scrollTo(0, document.body.scrollHeight);
//       speak("Scrolled to the bottom of the page.");
//     }
//   };

//   // const speak = (message) => {
//   //   const utterance = new SpeechSynthesisUtterance(message);
//   //   utterance.onend = () => {
//   //     setIsSpeaking(false);
//   //     console.log("Speaking ended.");
//   //     // Only restart recognition if we're still supposed to be listening
//   //     // if (isListening) {
//   //     //   if (restartRecognitionTimeout.current) {
//   //     //     clearTimeout(restartRecognitionTimeout.current);
//   //     //   }
//   //     //   restartRecognitionTimeout.current = setTimeout(() => {
//   //     //     console.log("Recognition restarted.");
//   //     //     recognition.current.start();
//   //     //   }, 100); // Delay to prevent immediate restart
//   //     // }
//   //     if (isListening && !recognition.current.starting) { // Check the flag before restarting
//   //       recognition.current.starting = true; // Set the flag when starting recognition
//   //       recognition.current.start();
//   //     }
//   //   };

//   //   setIsSpeaking(true);
//   //   console.log("Speaking started.");
//   //   recognition.current.stop(); // Stop recognition when the bot starts speaking
//   //   speechSynthesis.current.speak(utterance);
//   // };

//   // const onRecognitionEnd = () => {
//   //   console.log("Recognition ended.");
//   //   setIsRecognitionActive(false); // Update state when recognition ends
//   //   recognition.current.starting = false; // Reset the flag when recognition ends
//   //   // We now check if the recognition is already running before starting it again
//   //   if (isListening && !isSpeaking && !recognition.current?.starting) {
//   //     console.log("Restarting recognition.");
//   //     recognition.current.start();
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (isListening && !hasGreeted.current) {
//   //     speak("Hello, I'm Brane. How can I assist you today?");
//   //     hasGreeted.current = true;
//   //   } else if (isListening && !isSpeaking) {
//   //     recognition.current.start();
//   //   }
//   // }, [isListening, isSpeaking]);

//   // const startListening = () => {
//   //   console.log("Attempting to start listening.");
//   //   if (recognition.current && !recognition.current.starting) {
//   //     setIsListening(true);
//   //     recognition.current.starting = true; // Set the flag when starting recognition
//   //     recognition.current.start();
//   //     console.log("Listening started.");
//   //   }
//   // };

//   // const stopListening = () => {
//   //   console.log("Stopping listening.");

//   //   setIsListening(false);
//   //   recognition.current.stop();
//   //   if (speechSynthesis.current.speaking) {
//   //     speechSynthesis.current.cancel();
//   //   }
//   //   if (restartRecognitionTimeout.current) {
//   //     clearTimeout(restartRecognitionTimeout.current);
//   //   }
//   //   console.log("Listening stopped.");
//   // };
//   // Handle start and stop listening logic

//   useEffect(() => {
//     if (isListening && !hasGreeted.current) {
//       speak("Hello, I'm Brane. How can I assist you today?");
//       hasGreeted.current = true;
//     }
//   }, [isListening]);

//   // const handleCommandWithFuse = (command) => {
//   //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//   //   const results = fuse.search(command);
//   //   const foundCommand = results.length ? results[0].item : null;

//   //   if (foundCommand) {
//   //     console.log("Command found:", foundCommand.utterance);
//   //     speak(foundCommand.response);
//   //     if (foundCommand.route) {
//   //       navigate(foundCommand.route); // Navigate to the route specified in the command
//   //     }
//   //   } else {
//   //     console.log("No command found.");
//   //     speak("I'm not sure how to respond to that.");
//   //   }
//   // };

//   const handleCommandWithFuse = (command) => {
//     const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
//     const results = fuse.search(command);
//     const foundCommand = results.length ? results[0].item : null;

//     if (foundCommand) {
//       console.log("Command found:", foundCommand.utterance);

//       if (foundCommand.action) {
//         foundCommand.action();
//       } else if (foundCommand.route) {
//         navigate(foundCommand.route);
//       }

//       if (foundCommand.response) {
//         speak(foundCommand.response);
//       }
//     } else {
//       console.log("No command found.");
//       speak("I'm not sure how to respond to that.");
//     }
//   };

//   const commands = [
//     {
//       utterance: "Hello who are you ?",

//       response:
//         "Hi! This is Brane! your Voice bot from Brane Education How can I Assist you Today ?",
//     },

//     {
//       utterance: "Hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "hello",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Hi.",

//       response: "Hello! How can I assist you today?",
//     },

//     {
//       utterance: "Hey there",

//       response: "Hi! How can I assist you today?",
//     },

//     {
//       utterance: "Good morning Brane.",

//       response: "Hey Hiii! Good morning  ! How can I help you?",
//     },

//     {
//       utterance: "Good afternoon Brane.",

//       response: "Hey Hiii! Good after noon ! How can I help you?",
//     },

//     {
//       utterance: "Good evening Brane.",

//       response: "Hey Hiii! Good evening ! How can I help you?",
//     },

//     {
//       utterance: "can you please take me to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "go to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "please take me to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "Go to login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "open login page",
//       route: "/login",
//       routeDescription: "login page",
//       response: "Navigating to the login page.",
//     },

//     {
//       utterance: "can you please take me to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "take me to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "Go to signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "open signup page",
//       route: "/signup",
//       routeDescription: "signup page",
//       response: "Navigating to the signup page.",
//     },

//     {
//       utterance: "what are platform features",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "What does the platform offer",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the features of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Say me the services of platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "tell me the services offered by the platform",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "explain platform services",

//       response:
//         "Dashboard, Dynamic time table, Learning Networks, Little Masters, Video Based Dictionary, General Search.",
//     },

//     {
//       utterance: "Give me the Parent voice of Julia Harris",

//       response:
//         "Brane education has helped my son a lot in his studies. He improved a lot in his studies and is now able to score good marks in his exams",
//     },

//     {
//       utterance: "Play today's motivational video",

//       response: "I am playing the video",
//     },

//     {
//       utterance: "Play today's video",

//       response: "I am playing Motivational video",
//     },

//     {
//       utterance: "Leaders Voice",

//       response:
//         "This Voice-interactive AI Platform is a game Changer. It revolutionizes education.",
//     },

//     {
//       utterance: "Curriculum Supported by Brane Education",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Boards supported by the platform",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Curriculum",

//       response:
//         "we support multiple Boards let me say few Telangana State Board Andhra Pradesh Board Maharashtra Board Assam Board",
//     },

//     {
//       utterance: "Go to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "take me to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "roll back to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "move to landing page",

//       response: "Okay, I am taking you to the landing page.",

//       route: "/childpage",
//     },

//     {
//       utterance: "what is today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },

//     {
//       utterance: "Today's Inspirational quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },

//     {
//       utterance: "say me today's quote",

//       response:
//         "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

//       // route: "/childpage",
//     },
//     {
//       utterance: "go back",
//       response: "Going back.",
//       action: goBack, // Note the use of an action property
//     },
//     {
//       utterance: "go forward",
//       response: "Going forward.",
//       action: goForward,
//     },
//     {
//       utterance: "play video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "pause video",
//       // response: "Pausing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "start video",
//       // response: "Playing video.",
//       action: playVideo,
//     },
//     {
//       utterance: "stop video",
//       // response: "Playing video.",
//       action: pauseVideo,
//     },
//     {
//       utterance: "scroll up",
//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "scroll down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "go up",

//       // response: "Scrolling up.",
//       action: scrollUp,
//     },
//     {
//       utterance: "go down",
//       // response: "Scrolling down.",
//       action: scrollDown,
//     },
//     {
//       utterance: "scroll to top",
//       action: scrollToTop,
//     },
//     {
//       utterance: "scroll to bottom",
//       action: scrollToBottom,
//     },
//     {
//       utterance: "go back",
//       action: goBackRef?.current?.click, // Use goBackRef directly
//       response: "Going back.",
//     },
//     {
//       utterance: "take test",
//       action: takeTestRef?.current?.click, // Use takeTestRef directly
//       response: "Starting the test.",
//     },
//   ];
//   return (
//     <div className="speech-bot-container">
//       <div
//         className={`button-container ${
//           isListening ? "voicebotframeactive" : "voicebotframe"
//         }`}
//       >
//         <div onClick={isListening ? stopListening : startListening}>
//           <iframe
//             src={
//               isListening
//                 ? "https://lottie.host/?file=a89aca3f-5407-4052-82c3-2048afca7a9f/NpCdWzLSKD.json"
//                 : "https://lottie.host/?file=d2b6cc0e-fe95-4847-85b5-35365fca7e00/vTudpCuPZq.json"
//             }
//             width="120" // Set your desired width
//             height="120" // Set your desired height
//             title={isListening ? "Stop Animation" : "Start Animation"}
//             className={isListening ? "voicebotframeactive" : "voicebotframe"}
//           ></iframe>
//           {isListening ? (
//             <div className="overlay" onClick={stopListening}></div>
//           ) : (
//             <div className="overlay" onClick={startListening}></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceBot;
