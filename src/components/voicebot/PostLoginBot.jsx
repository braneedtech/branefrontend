import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import "./VoiceBot.css";
import chatbotimage from "../../assets/chatbotgif.gif";

const PostLoginBot = ({ videoRef, onCommandRecognized, triggerLogout, videoRefs }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const [hasGreeted, setHasGreeted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = false;
    recognition.current.onresult = onResult;
    recognition.current.onend = onRecognitionEnd;
    recognition.current.starting = false;

    // Simplified error handling, removed specific handling for 'no-speech'
    recognition.current.onerror = (event) => {
      console.error("Recognition error:", event.error);
      // Check if listening is true and the bot isn't speaking
      if (isListening && !isSpeaking) {
        // Restart recognition
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

    const recognitionCheckInterval = setInterval(checkRecognition, 400); // Check every 1 second

    return () => {
      clearInterval(recognitionCheckInterval);
    };
  }, [isListening, isSpeaking]);

  const restartRecognition = () => {
    if (recognition.current.starting) {
      console.log("Recognition is already starting or running.");
      return;
    }

    recognition.current.abort(); // Stop any existing recognition process
    recognition.current.starting = true;
    recognition.current.start();
    console.log("Recognition restarted.");
  };

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

  const customNavigate = (to, options) => {
    const currentPath = window.location.pathname; // Get the current path
    if (currentPath === to) {
      // Check if the current path is the same as the requested path
      speak(`You are already on that page.`);
    } else {
      historyStack.current.push(to);
      navigate(to, options);
    }
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

  // const playVideo = () => {
  //   if (videoRef.current) {
  //     videoRef.current.play();
  //     speak("Playing video.");
  //   } else {
  //     speak("No video to play.");
  //   }
  // };

  // const pauseVideo = () => {
  //   if (videoRef.current) {
  //     videoRef.current.pause();
  //     speak("Video paused.");
  //   } else {
  //     speak("No video to pause.");
  //   }
  // };
  const playVideo = () => {
    if (videoRef.current && !videoRef.current.paused) {
      speak("Video is already playing.");
    } else if (videoRef.current) {
      videoRef.current.play();
      speak("Playing video.");
    } else {
      speak("No video to play.");
    }
  };
  
  const pauseVideo = () => {
    if (videoRef.current && videoRef.current.paused) {
      speak("Video is already paused.");
    } else if (videoRef.current) {
      videoRef.current.pause();
      speak("Video paused.");
    } else {
      speak("No video to pause.");
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

  // const speak = (message) => {
  //   const utterance = new SpeechSynthesisUtterance(message);
  //   utterance.onend = () => {
  //     setIsSpeaking(false);
  //     console.log("Speaking ended.");
  //     // Only restart recognition if we're still supposed to be listening
  //     // if (isListening) {
  //     //   if (restartRecognitionTimeout.current) {
  //     //     clearTimeout(restartRecognitionTimeout.current);
  //     //   }
  //     //   restartRecognitionTimeout.current = setTimeout(() => {
  //     //     console.log("Recognition restarted.");
  //     //     recognition.current.start();
  //     //   }, 100); // Delay to prevent immediate restart
  //     // }
  //     if (isListening && !recognition.current.starting) { // Check the flag before restarting
  //       recognition.current.starting = true; // Set the flag when starting recognition
  //       recognition.current.start();
  //     }
  //   };

  //   setIsSpeaking(true);
  //   console.log("Speaking started.");
  //   recognition.current.stop(); // Stop recognition when the bot starts speaking
  //   speechSynthesis.current.speak(utterance);
  // };

  const speak = (message) => {
    console.log("speak function called with message:", message);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log("Speaking ended.");
      if (isListening && !recognition.current.starting) {
        console.log("Restarting recognition after speaking.");
        recognition.current.starting = true;
        recognition.current.start();
        console.log("Restarted recognition after speaking.");
      }
    };

    setIsSpeaking(true);
    console.log("Speaking started.");
    recognition.current.stop(); // Ensure to stop recognition before speaking
    speechSynthesis.current.speak(utterance);
  };

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
    if (isListening) {
      if (!hasGreeted) {
        speak("Hello, I'm Brane. How can I help you today?");
        setHasGreeted(true);
      } else {
        speak("Listening.");
      }
    }
  }, [isListening, hasGreeted]);

  // useEffect(() => {
  //   if (isListening && !hasGreeted.current) {
  //     speak("Hello, I'm Brane. How can I help you today?");
  //     hasGreeted.current = true;
  //   } else if (isListening && !isSpeaking && !recognition.current.starting) {
  //     restartRecognition();
  //   }
  // }, [isListening, isSpeaking]);

  const startListening = () => {
    if (!recognition.current.starting) {
      setIsListening(true);
      restartRecognition();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.current.abort();
    if (speechSynthesis.current.speaking) {
      speechSynthesis.current.cancel();
    }
  };

  // const handleCommandWithFuse = (command) => {
  //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
  //   const results = fuse.search(command);
  //   const foundCommand = results.length ? results[0].item : null;

  //   if (foundCommand) {
  //     console.log("Command found:", foundCommand.utterance);
  //     speak(foundCommand.response);
  //     if (foundCommand.route) {
  //       navigate(foundCommand.route); // Navigate to the route specified in the command
  //     }
  //   } else {
  //     console.log("No command found.");
  //     speak("I'm not sure how to respond to that.");
  //   }
  // };

  // const handleCommandWithFuse = (command) => {
  //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
  //   const results = fuse.search(command);
  //   const foundCommand = results.length ? results[0].item : null;

  //   if (foundCommand) {
  //     console.log("Command found:", foundCommand.utterance);

  //     if (foundCommand.utterance === "logout") {
  //       triggerLogout(true); // Trigger logout action
  //     }

  //     if (foundCommand.action) {
  //       foundCommand.action();
  //     } else if (foundCommand.route) {
  //       navigate(foundCommand.route);
  //     }
  //     if (foundCommand && foundCommand.action) {
  //       console.log(`Executing action for command: ${foundCommand.utterance}`);
  //       foundCommand.action();
  //     }

  //     // Speak after performing the action or navigation
  //     speak(foundCommand.response);
  //   } else {
  //     console.log("No command found.");
  //     speak("I'm not sure how to respond to that.");
  //   }
  // };

  // const handleCommandWithFuse = (command) => {
  //   const fuse = new Fuse(commands, { keys: ["utterance"], threshold: 0.4 });
  //   const results = fuse.search(command);
  //   const foundCommand = results.length ? results[0].item : null;
    
  
  //   if (foundCommand) {
  //     console.log("Command found:", foundCommand.utterance);
  
  //     if (foundCommand.utterance === "logout") {
  //       triggerLogout(true); // Trigger logout action
  //     }
  
  //     if (foundCommand.action) {
  //       console.log(`Executing action for command: ${foundCommand.utterance}`);
  //       foundCommand.action();
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
    console.log(currentPath);
  
    if (foundCommand) {
      console.log("Command found:", foundCommand.utterance);
  
      if (foundCommand.utterance === "logout") {
        triggerLogout(true);
      }
  
      if (foundCommand.route) {
        if (currentPath === foundCommand.route) {
          speak(`You are already on this page.`);
        } else {
          customNavigate(foundCommand.route);
        }
      } else if (foundCommand.action) {
        foundCommand.action();
      }
  
      // Speak the response only if it's a different route
      if (!foundCommand.route || currentPath !== foundCommand.route) {
        speak(foundCommand.response);
      }
    } else {
      console.log("No command found.");
      speak("I'm not sure how to respond to that.");
    }
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
      utterance: "Play today's motivational video",

      response: "I am playing the video",
    },

    {
      utterance: "Play today's video",

      response: "I am playing Motivational video",
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
      utterance: "Go to landing page",

      response: "Okay, I am taking you to the landing page.",

      route: "/portfolio",
    },

    {
      utterance: "take me to landing page",

      response: "Okay, I am taking you to the landing page.",

      route: "/portfolio",
    },

    // {
    //   utterance: "move to landing page",

    //   response: "Okay, I am taking you to the landing page.",

    //   route: "/childpage",
    // },

    // {
    //   utterance: "roll back to landing page",

    //   response: "Okay, I am taking you to the landing page.",

    //   route: "/childpage",
    // },

    // {
    //   utterance: "move to landing page",

    //   response: "Okay, I am taking you to the landing page.",

    //   route: "/childpage",
    // },

    {
      utterance: "what is today's quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

    },

    {
      utterance: "Today's Inspirational quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",

    },

    {
      utterance: "say me today's quote",

      response:
        "Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.",
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
    {
      utterance: "play video",
      // response: "Playing video.",
      action: playVideo,
    },
    {
      utterance: "pause video",
      // response: "Pausing video.",
      action: pauseVideo,
    },
    {
      utterance: "start video",
      // response: "Playing video.",
      action: playVideo,
    },
    {
      utterance: "stop video",
      // response: "Playing video.",
      action: pauseVideo,
    },
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
    {
      utterance: "go to dashboard",

     route: "/dashboard",

      response: "Here's the dashboard",
    },
    {
      utterance: "i want to access dashboard",

      route: "/dashboard",

      response: "Here's the dashboard",
    },
    {
      utterance: "open dashboard",

      route: "/dashboard",

      response: "Here's the dashboard",
    },
    {
      utterance: "go to my dashboard",

      route: "/dashboard",

      response: "Here's the dashboard",
    },
    {
      utterance: "i want to see my dashboard",

      route: "/dashboard",

      response: "Here's the dashboard",
    },
    {
      utterance: "go to universal search",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search",
    },
    {
      utterance: "I want to access universal search",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search",
    },
    {
      utterance: "I want to search something",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search",
    },
    {
      utterance: "I have some doubts",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search to know anything",
    },
    {
      utterance: "I want to search something",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search to know anything",
    },
    {
      utterance: "Open universal Search",

      route: "/portfolio/generalsearch",

      response: "Here's Universal Search to know anything",
    },
    {
      utterance: "Open my personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "go to personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "go to my personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "open my personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "i want to edit my personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "i want to update my personal information",

      route: "/portfolio/personalinfo",

      response: "Here's Your personal information. You can view or edit them.",
    },
    {
      utterance: "i want to access my profile information",

      route: "/portfolio/profileinfo",

      response: "Here's Your profile information. You can view or update them.",
    },
    {
      utterance: "open my profile information",

      route: "/portfolio/profileinfo",

      response:
        "Here's Your profile information. You can view or update them..",
    },
    {
      utterance: "i want to update my profile information",

      route: "/portfolio/profileinfo",

      response:
        "Here's Your profile information. You can view or update them..",
    },
    {
      utterance: "how to update my profile information",

      route: "/portfolio/profileinfo",

      response:
        "Here's Your profile information. You can view or update them..",
    },
    {
      utterance: "go to my profile information",

      route: "/portfolio/profileinfo",

      response:
        "Here's Your profile information. You can view or update them..",
    },
    {
      utterance: "open my certificates",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "go to my certificates",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "go to my certifications",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "open my certifications",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "how to view my certifications",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "how to see my certificates",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "how to see my certifications",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "show me my certifications",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "show me my certificates",

      route: "/portfolio/myaccount",

      response: "Here you can view your certificates",
    },
    {
      utterance: "go to dynamic timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "open dynamic timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "open dynamic timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "open my timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "go to my timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "show my timetable",

      route: "/portfolio/dynamic-timetable",

      response: "Here's your timetable.",
    },
    {
      utterance: "open learning network",

      route: "/portfolio/learning-network",

      response: "Here's Learning Network",
    },
    {
      utterance: "go to learning network",

      route: "/portfolio/learning-network",

      response: "Here's Learning Network",
    },
    {
      utterance: "i want to go to learning network",

      route: "/portfolio/learning-network",

      response: "Here's Learning Network",
    },
    {
      utterance: "open maths",

      route: "/portfolio/chapters/Maths",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "take me to maths",

      route: "/portfolio/chapters/Maths",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open maths subject",

      route: "/portfolio/chapters/Maths",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open mathematics",

      route: "/portfolio/chapters/Maths",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open practice test",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "take me to practice test",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "can you open practice test",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "can you open practice assessment",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "can you take me to practice assessment",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "take me to practice assessment",

      route: "/practice-test",

      response:
        "You can take the practice test now. select a level and continue to test",
    },
    {
      utterance: "what subjects are there",

      response:
        "You can Study Maths,English,Hindi,Social Science,Information technology.",
    },
    {
      utterance: "what subjects are available",

      response:
        "You can Study Maths,English,Hindi,Social Science,Information technology.",
    },
    {
      utterance: "what subjects are available to study",

      response:
        "You can Study Maths,English,Hindi,Social Science,Information technology.",
    },
    {
      utterance: "open English",

      route: "/portfolio/chapters/English",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "take me to English",

      route: "/portfolio/chapters/English",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open English subject",

      route: "/portfolio/chapters/English",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open English",

      route: "/portfolio/chapters/English",

      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Hindi",
      route: "/portfolio/chapters/Hindi",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "take me to Hindi",
      route: "/portfolio/chapters/Hindi",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Hindi subject",
      route: "/portfolio/chapters/Hindi",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Hindi language",
      route: "/portfolio/chapters/Hindi",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Social Science",
      route: "/portfolio/chapters/Social%20Science",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "take me to Social Science",
      route: "/portfolio/chapters/Social%20Science",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Social Science subject",
      route: "/portfolio/chapters/Social%20Science",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Social Science studies",
      route: "/portfolio/chapters/Social%20Science",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Information Technology",
      route: "/portfolio/chapters/Information%20Technology",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "take me to Information Technology",
      route: "/portfolio/chapters/Information%20Technology",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Information Technology subject",
      route: "/portfolio/chapters/Information%20Technology",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open IT",
      route: "/portfolio/chapters/Information%20Technology",
      response: "Select any chapter and topic now",
    },
    {
      utterance: "open Listening Skills",
      route: "/portfolio/specialskills/Listening%20Skills",
      response: "Here you can test and improve your listening skills",
    },
    {
      utterance: "take me to Listening Skills",
      route: "/portfolio/specialskills/Listening%20Skills",
      response: "Here you can test and improve your listening skills",
    },
    {
      utterance: "open Listening Skills page",
      route: "/portfolio/specialskills/Listening%20Skills",
      response: "Here you can test and improve your listening skills",
    },
    {
      utterance: "open Skills of Listening",
      route: "/portfolio/specialskills/Listening%20Skills",
      response: "Here you can test and improve your listening skills",
    },
    {
      utterance: "open Memory Skills",
      route: "/portfolio/specialskills/Memory%20Skills",
      response: "Here you can test and improve your memory skills",
    },
    {
      utterance: "take me to Memory Skills",
      route: "/portfolio/specialskills/Memory%20Skills",
      response: "Here you can test and improve your memory skills",
    },
    {
      utterance: "open Memory Skills page",
      route: "/portfolio/specialskills/Memory%20Skills",
      response: "Here you can test and improve your memory skills",
    },
    {
      utterance: "open Skills of Memory",
      route: "/portfolio/specialskills/Memory%20Skills",
      response: "Here you can test and improve your memory skills",
    },
    {
      utterance: "open Observation Skills",
      route: "/portfolio/specialskills/Observation%20Skills",
      response: "Here you can test and improve your observation skills",
    },
    {
      utterance: "take me to Observation Skills",
      route: "/portfolio/specialskills/Observation%20Skills",
      response: "Here you can test and improve your observation skills",
    },
    {
      utterance: "open Observation Skills page",
      route: "/portfolio/specialskills/Observation%20Skills",
      response: "Here you can test and improve your observation skills",
    },
    {
      utterance: "open Skills of Observation",
      route: "/portfolio/specialskills/Observation%20Skills",
      response: "Here you can test and improve your observation skills",
    },
    {
      utterance: "open Public Speaking",
      route: "/portfolio/specialskills/Public%20Speaking",
      response: "Here you can enhance your public speaking skills",
    },
    {
      utterance: "take me to Public Speaking",
      route: "/portfolio/specialskills/Public%20Speaking",
      response: "Here you can enhance your public speaking skills",
    },
    {
      utterance: "open Public Speaking page",
      route: "/portfolio/specialskills/Public%20Speaking",
      response: "Here you can enhance your public speaking skills",
    },
    {
      utterance: "open Skills of Public Speaking",
      route: "/portfolio/specialskills/Public%20Speaking",
      response: "Here you can enhance your public speaking skills",
    },
    {
      utterance: "open Emotional Intelligence",
      route: "/portfolio/specialskills/Emotional%20Intelligence",
      response: "Here you can develop and assess your emotional intelligence",
    },
    {
      utterance: "take me to Emotional Intelligence",
      route: "/portfolio/specialskills/Emotional%20Intelligence",
      response: "Here you can develop and assess your emotional intelligence",
    },
    {
      utterance: "open Emotional Intelligence page",
      route: "/portfolio/specialskills/Emotional%20Intelligence",
      response: "Here you can develop and assess your emotional intelligence",
    },
    {
      utterance: "open Skills of Emotional Intelligence",
      route: "/portfolio/specialskills/Emotional%20Intelligence",
      response: "Here you can develop and assess your emotional intelligence",
    },
    {
      utterance: "open Problem Solving Skills",
      route: "/portfolio/specialskills/Problem%20Solving%20Skills",
      response: "Here you can test and enhance your problem-solving skills",
    },
    {
      utterance: "take me to Problem Solving Skills",
      route: "/portfolio/specialskills/Problem%20Solving%20Skills",
      response: "Here you can test and enhance your problem-solving skills",
    },
    {
      utterance: "open Problem Solving Skills page",
      route: "/portfolio/specialskills/Problem%20Solving%20Skills",
      response: "Here you can test and enhance your problem-solving skills",
    },
    {
      utterance: "open Skills of Problem Solving",
      route: "/portfolio/specialskills/Problem%20Solving%20Skills",
      response: "Here you can test and enhance your problem-solving skills",
    },

    {
      utterance: "open Baseball",
      route: "/portfolio/sports/Baseball",
      response:
        "Here you can learn about the rules, history, champions, and academy centers to level up your game",
    },
    {
      utterance: "take me to Baseball",
      route: "/portfolio/sports/Baseball",
      response:
        "Here you can learn about the rules, history, champions, and academy centers to level up your game",
    },
    {
      utterance: "open Baseball page",
      route: "/portfolio/sports/Baseball",
      response:
        "Here you can learn about the rules, history, champions, and academy centers to level up your game",
    },
    {
      utterance: "open Baseball information",
      route: "/portfolio/sports/Baseball",
      response:
        "Here you can learn about the rules, history, champions, and academy centers to level up your game",
    },
    {
      utterance: "open Hockey",
      route: "/portfolio/sports/Hockey",
      response: "Here you can explore information about hockey",
    },
    {
      utterance: "take me to Hockey",
      route: "/portfolio/sports/Hockey",
      response: "Here you can explore information about hockey",
    },
    {
      utterance: "open Hockey page",
      route: "/portfolio/sports/Hockey",
      response: "Here you can explore information about hockey",
    },
    {
      utterance: "open Hockey information",
      route: "/portfolio/sports/Hockey",
      response: "Here you can explore information about hockey",
    },
    {
      utterance: "open Gymnastics",
      route: "/portfolio/sports/Gymnastics",
      response: "Here you can explore information about gymnastics",
    },
    {
      utterance: "take me to Gymnastics",
      route: "/portfolio/sports/Gymnastics",
      response: "Here you can explore information about gymnastics",
    },
    {
      utterance: "open Gymnastics page",
      route: "/portfolio/sports/Gymnastics",
      response: "Here you can explore information about gymnastics",
    },
    {
      utterance: "open Gymnastics information",
      route: "/portfolio/sports/Gymnastics",
      response: "Here you can explore information about gymnastics",
    },
    {
      utterance: "open Cricket",
      route: "/portfolio/sports/Cricket",
      response: "Here you can explore information about cricket",
    },
    {
      utterance: "take me to Cricket",
      route: "/portfolio/sports/Cricket",
      response: "Here you can explore information about cricket",
    },
    {
      utterance: "open Cricket page",
      route: "/portfolio/sports/Cricket",
      response: "Here you can explore information about cricket",
    },
    {
      utterance: "open Cricket information",
      route: "/portfolio/sports/Cricket",
      response: "Here you can explore information about cricket",
    },
    {
      utterance: "open Basketball",
      route: "/portfolio/sports/Basketball",
      response: "Here you can explore information about basketball",
    },
    {
      utterance: "take me to Basketball",
      route: "/portfolio/sports/Basketball",
      response: "Here you can explore information about basketball",
    },
    {
      utterance: "open Basketball page",
      route: "/portfolio/sports/Basketball",
      response: "Here you can explore information about basketball",
    },
    {
      utterance: "open Basketball information",
      route: "/portfolio/sports/Basketball",
      response: "Here you can explore information about basketball",
    },
    {
      utterance: "open Soccer",
      route: "/portfolio/sports/Soccer",
      response: "Here you can explore information about soccer",
    },
    {
      utterance: "take me to Soccer",
      route: "/portfolio/sports/Soccer",
      response: "Here you can explore information about soccer",
    },
    {
      utterance: "open Soccer page",
      route: "/portfolio/sports/Soccer",
      response: "Here you can explore information about soccer",
    },
    {
      utterance: "open Soccer information",
      route: "/portfolio/sports/Soccer",
      response: "Here you can explore information about soccer",
    },
    {
      utterance: "open Softball",
      route: "/portfolio/sports/Softball",
      response: "Here you can explore information about softball",
    },
    {
      utterance: "take me to Softball",
      route: "/portfolio/sports/Softball",
      response: "Here you can explore information about softball",
    },
    {
      utterance: "open Softball page",
      route: "/portfolio/sports/Softball",
      response: "Here you can explore information about softball",
    },
    {
      utterance: "open Softball information",
      route: "/portfolio/sports/Softball",
      response: "Here you can explore information about softball",
    },
    {
      utterance: "open Swimming",
      route: "/portfolio/sports/Swimming",
      response: "Here you can explore information about swimming",
    },
    {
      utterance: "take me to Swimming",
      route: "/portfolio/sports/Swimming",
      response: "Here you can explore information about swimming",
    },
    {
      utterance: "open Swimming page",
      route: "/portfolio/sports/Swimming",
      response: "Here you can explore information about swimming",
    },
    {
      utterance: "open Swimming information",
      route: "/portfolio/sports/Swimming",
      response: "Here you can explore information about swimming",
    },
    {
      utterance: "open Tennis",
      route: "/portfolio/sports/Tennis",
      response: "Here you can explore information about tennis",
    },
    {
      utterance: "take me to Tennis",
      route: "/portfolio/sports/Tennis",
      response: "Here you can explore information about tennis",
    },
    {
      utterance: "open Tennis page",
      route: "/portfolio/sports/Tennis",
      response: "Here you can explore information about tennis",
    },
    {
      utterance: "open Tennis information",
      route: "/portfolio/sports/Tennis",
      response: "Here you can explore information about tennis",
    },
    {
      utterance: "open Track and Field",
      route: "/portfolio/sports/Track%20and%20Field",
      response: "Here you can explore information about track and field",
    },
    {
      utterance: "take me to Track and Field",
      route: "/portfolio/sports/Track%20and%20Field",
      response: "Here you can explore information about track and field",
    },
    {
      utterance: "open Track and Field page",
      route: "/portfolio/sports/Track%20and%20Field",
      response: "Here you can explore information about track and field",
    },
    {
      utterance: "open Track and Field information",
      route: "/portfolio/sports/Track%20and%20Field",
      response: "Here you can explore information about track and field",
    },
    {
      utterance: "open Volleyball",
      route: "/portfolio/sports/Volleyball",
      response: "Here you can explore information about volleyball",
    },
    {
      utterance: "take me to Volleyball",
      route: "/portfolio/sports/Volleyball",
      response: "Here you can explore information about volleyball",
    },
    {
      utterance: "open Volleyball page",
      route: "/portfolio/sports/Volleyball",
      response: "Here you can explore information about volleyball",
    },
    {
      utterance: "open Volleyball information",
      route: "/portfolio/sports/Volleyball",
      response: "Here you can explore information about volleyball",
    },
    {
      utterance: "open Physical Health",
      route: "/portfolio/health/Physical%20Health",
      response: "Here you can explore information about physical health",
    },
    {
      utterance: "take me to Physical Health",
      route: "/portfolio/health/Physical%20Health",
      response: "Here you can explore information about physical health",
    },
    {
      utterance: "open Physical Health page",
      route: "/portfolio/health/Physical%20Health",
      response: "Here you can explore information about physical health",
    },
    {
      utterance: "open Physical Health information",
      route: "/portfolio/health/Physical%20Health",
      response: "Here you can explore information about physical health",
    },
    {
      utterance: "open Mental Health",
      route: "/portfolio/health/Mental%20Health",
      response: "Here you can explore information about mental health",
    },
    {
      utterance: "take me to Mental Health",
      route: "/portfolio/health/Mental%20Health",
      response: "Here you can explore information about mental health",
    },
    {
      utterance: "open Mental Health page",
      route: "/portfolio/health/Mental%20Health",
      response: "Here you can explore information about mental health",
    },
    {
      utterance: "open Mental Health information",
      route: "/portfolio/health/Mental%20Health",
      response: "Here you can explore information about mental health",
    },
    {
      utterance: "open Nutrition",
      route: "/portfolio/health/Nutrition",
      response: "Here you can explore information about nutrition",
    },
    {
      utterance: "take me to Nutrition",
      route: "/portfolio/health/Nutrition",
      response: "Here you can explore information about nutrition",
    },
    {
      utterance: "open Nutrition page",
      route: "/portfolio/health/Nutrition",
      response: "Here you can explore information about nutrition",
    },
    {
      utterance: "open Nutrition information",
      route: "/portfolio/health/Nutrition",
      response: "Here you can explore information about nutrition",
    },
    {
      utterance: "open Exercise",
      route: "/portfolio/health/Exercise",
      response: "Here you can explore information about exercise",
    },
    {
      utterance: "take me to Exercise",
      route: "/portfolio/health/Exercise",
      response: "Here you can explore information about exercise",
    },
    {
      utterance: "open Exercise page",
      route: "/portfolio/health/Exercise",
      response: "Here you can explore information about exercise",
    },
    {
      utterance: "open Exercise information",
      route: "/portfolio/health/Exercise",
      response: "Here you can explore information about exercise",
    },
    {
      utterance: "open Organization Skills",
      route: "/portfolio/lifeskills/Organization%20Skills",
      response: "Here you can develop and enhance your organization skills",
    },
    {
      utterance: "take me to Organization Skills",
      route: "/portfolio/lifeskills/Organization%20Skills",
      response: "Here you can develop and enhance your organization skills",
    },
    {
      utterance: "open Organization Skills page",
      route: "/portfolio/lifeskills/Organization%20Skills",
      response: "Here you can develop and enhance your organization skills",
    },
    {
      utterance: "open Skills of Organization",
      route: "/portfolio/lifeskills/Organization%20Skills",
      response: "Here you can develop and enhance your organization skills",
    },
    {
      utterance: "open Leadership Skills",
      route: "/portfolio/lifeskills/Leadership%20Skills",
      response: "Here you can develop and strengthen your leadership skills",
    },
    {
      utterance: "take me to Leadership Skills",
      route: "/portfolio/lifeskills/Leadership%20Skills",
      response: "Here you can develop and strengthen your leadership skills",
    },
    {
      utterance: "open Leadership Skills page",
      route: "/portfolio/lifeskills/Leadership%20Skills",
      response: "Here you can develop and strengthen your leadership skills",
    },
    {
      utterance: "open Skills of Leadership",
      route: "/portfolio/lifeskills/Leadership%20Skills",
      response: "Here you can develop and strengthen your leadership skills",
    },
    {
      utterance: "open Cultural Competence",
      route: "/portfolio/lifeskills/Cultural%20Competence",
      response: "Here you can enhance your cultural competence skills",
    },
    {
      utterance: "take me to Cultural Competence",
      route: "/portfolio/lifeskills/Cultural%20Competence",
      response: "Here you can enhance your cultural competence skills",
    },
    {
      utterance: "open Cultural Competence page",
      route: "/portfolio/lifeskills/Cultural%20Competence",
      response: "Here you can enhance your cultural competence skills",
    },
    {
      utterance: "open Skills of Cultural Competence",
      route: "/portfolio/lifeskills/Cultural%20Competence",
      response: "Here you can enhance your cultural competence skills",
    },
    {
      utterance: "open Time Management",
      route: "/portfolio/lifeskills/Time%20Management",
      response: "Here you can learn and improve your time management skills",
    },
    {
      utterance: "take me to Time Management",
      route: "/portfolio/lifeskills/Time%20Management",
      response: "Here you can learn and improve your time management skills",
    },
    {
      utterance: "open Time Management page",
      route: "/portfolio/lifeskills/Time%20Management",
      response: "Here you can learn and improve your time management skills",
    },
    {
      utterance: "open Skills of Time Management",
      route: "/portfolio/lifeskills/Time%20Management",
      response: "Here you can learn and improve your time management skills",
    },
    {
      utterance: "open Language Lab",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Stay tuned for exciting language learning content!",
    },
    {
      utterance: "take me to Language Lab",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Stay tuned for exciting language learning content!",
    },
    {
      utterance: "open Language Lab page",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Stay tuned for exciting language learning content!",
    },
    {
      utterance: "open Language Lab information",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Stay tuned for exciting language learning content!",
    },
    {
      utterance: "open Digital Video Dictionary",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned!",
    },
    {
      utterance: "take me to Digital Video Dictionary",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned!",
    },
    {
      utterance: "open Digital Video Dictionary page",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned!",
    },
    {
      utterance: "open Digital Video Dictionary information",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned!",
    },
    {
      utterance: "open Check your Vocabulary",
      route: "/portfolio/language-lab",
      response: "This tool will be coming soon as part of the Language Lab. Enhance your vocabulary with us!",
    },
    {
      utterance: "take me to Check your Vocabulary",
      route: "/portfolio/language-lab",
      response: "This tool will be coming soon as part of the Language Lab. Enhance your vocabulary with us!",
    },
    {
      utterance: "open Check your Vocabulary page",
      route: "/portfolio/language-lab",
      response: "This tool will be coming soon as part of the Language Lab. Enhance your vocabulary with us!",
    },
    {
      utterance: "open Check your Vocabulary information",
      route: "/portfolio/language-lab",
      response: "This tool will be coming soon as part of the Language Lab. Enhance your vocabulary with us!",
    },
    {
      utterance: "open Learn Two Words for a Day",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned for daily word learning!",
    },
    {
      utterance: "take me to Learn Two Words for a Day",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned for daily word learning!",
    },
    {
      utterance: "open Learn Two Words for a Day page",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned for daily word learning!",
    },
    {
      utterance: "open Learn Two Words for a Day information",
      route: "/portfolio/language-lab",
      response: "This feature will be coming soon as part of the Language Lab. Stay tuned for daily word learning!",
    },
    {
      utterance: "open Communication Skills",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Improve your communication skills with our upcoming content!",
    },
    {
      utterance: "take me to Communication Skills",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Improve your communication skills with our upcoming content!",
    },
    {
      utterance: "open Communication Skills page",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Improve your communication skills with our upcoming content!",
    },
    {
      utterance: "open Communication Skills information",
      route: "/portfolio/language-lab",
      response: "This section will be coming soon. Improve your communication skills with our upcoming content!",
    },
                    
    {
      utterance: "expand academics",
      response: "Expanding Academics section.",
      action: () => onCommandRecognized("Academics"),
    },
    {
      utterance: "logout",
      response: "Logging you out.",
      action: () => triggerLogout(true),
    },
    {
      utterance: "press logout",
      response: "Logging you out.",
      action: () => triggerLogout(true),
    },
  ];

  return (
    <div className="speech-bot-container">
      <div
        className={`button-container ${
          isListening ? "voicebotframeactive" : "voicebotframe"
        }`}
      >
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

export default PostLoginBot;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./VoiceBot.css";

// const PostLoginBot = ({ videoRef}) => {
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

//     recognition.current.onerror = (event) => {
//       console.error("Recognition error:", event.error);
//       if (isListening && !isSpeaking) {
//         restartRecognition();
//       }
//     };

//     return () => {
//       if (recognition.current) {
//         recognition.current.abort();
//       }
//     };
//   }, []);

// //   useEffect(() => {
// //     const checkRecognition = () => {
// //       if (isListening && !isSpeaking && !recognition.current.starting) {
// //         console.log("Restarting recognition because it's not active.");
// //         recognition.current.starting = true;
// //         recognition.current.start();
// //         console.log("Restarted recognition.");
// //       }
// //     };

// //     const recognitionCheckInterval = setInterval(checkRecognition, 100); // Check every .5 second

// //     return () => {
// //       clearInterval(recognitionCheckInterval);
// //     };
// //   }, [isListening, isSpeaking]);

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
//       recognition.current.abort(); // Ensure any ongoing recognition is stopped
//       recognition.current.starting = true;
//       recognition.current.start();
//     }
//   };

//     // Restart recognition when bot finishes speaking and isListening is true
//     useEffect(() => {
//       if (!isSpeaking && isListening) {
//         restartRecognition();
//       }
//     }, [isSpeaking, isListening]);

//     const onResult = (event) => {
//         const resultIndex = event.resultIndex;
//         const transcript = event.results[resultIndex][0].transcript
//           .trim()
//           .toLowerCase();

//         if (event.results[resultIndex].isFinal) {
//           console.log(`Recognized text: ${transcript}`);
//           if (transcript.includes("brain")) {
//             console.log("Wake word heard, processing command...");
//             handleCommandWithFuse(transcript.replace("brain", ""));
//           }
//         }
//       };

//       const onRecognitionEnd = () => {
//         recognition.current.starting = false;
//         if (isListening && !isSpeaking) {
//           restartRecognition();
//         }
//       };

//       useEffect(() => {
//         if (isListening && !hasGreeted) {
//           speak("Hello, I'm Brane. How can I help you today?");
//           setHasGreeted(true);
//         }
//       }, [isListening, hasGreeted]);

//   // useEffect(() => {
//   //   if (isListening && !hasGreeted.current) {
//   //     speak("Hello, I'm Brane. How can I help you today?");
//   //     hasGreeted.current = true;
//   //   } else if (isListening && !isSpeaking && !recognition.current.starting) {
//   //     restartRecognition();
//   //   }
//   // }, [isListening, isSpeaking]);

//   // Updated startListening function
//   const startListening = () => {
//     setIsListening(true);
//     if (!recognition.current.starting) {
//       restartRecognition();
//     }
//   };

//   // Updated stopListening function
//   const stopListening = () => {
//     setIsListening(false);
//     if (speechSynthesis.current.speaking) {
//       speechSynthesis.current.cancel();
//     }
//     recognition.current.abort();
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

//     // {
//     //   utterance: "move to landing page",

//     //   response: "Okay, I am taking you to the landing page.",

//     //   route: "/childpage",
//     // },

//     // {
//     //   utterance: "roll back to landing page",

//     //   response: "Okay, I am taking you to the landing page.",

//     //   route: "/childpage",
//     // },

//     // {
//     //   utterance: "move to landing page",

//     //   response: "Okay, I am taking you to the landing page.",

//     //   route: "/childpage",
//     // },

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
//     {
//         utterance: "go to dashboard",

//         route: "/dashboard",

//         response: "Here's the dashboard",
//       },
//       {
//         utterance: "i want to access dashboard",

//         route: "/dashboard",

//         response: "Here's the dashboard",
//       },
//       {
//         utterance: "open dashboard",

//         route: "/dashboard",

//         response: "Here's the dashboard",
//       },
//       {
//         utterance: "go to my dashboard",

//         route: "/dashboard",

//         response: "Here's the dashboard",
//       },
//       {
//         utterance: "i want to see my dashboard",

//         route: "/dashboard",

//         response: "Here's the dashboard",
//       },
//       {
//         utterance: "go to universal search",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search",
//       },
//       {
//         utterance: "I want to access universal search",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search",
//       },
//       {
//         utterance: "I want to search something",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search",
//       },
//       {
//         utterance: "I have some doubts",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search to know anything",
//       },
//       {
//         utterance: "I want to search something",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search to know anything",
//       },
//       {
//         utterance: "Open universal Search",

//         route: "/portfolio/generalsearch",

//         response: "Here's Universal Search to know anything",
//       },
//       {
//         utterance: "Open my personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "go to personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "go to my personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "open my personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "i want to edit my personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "i want to update my personal information",

//         route: "/portfolio/personalinfo",

//         response: "Here's Your personal information. You can view or edit them.",
//       },
//       {
//         utterance: "i want to access my profile information",

//         route: "/portfolio/profileinfo",

//         response: "Here's Your profile information. You can view or update them.",
//       },
//       {
//         utterance: "open my profile information",

//         route: "/portfolio/profileinfo",

//         response: "Here's Your profile information. You can view or update them..",
//       },
//       {
//         utterance: "i want to update my profile information",

//         route: "/portfolio/profileinfo",

//         response: "Here's Your profile information. You can view or update them..",
//       },
//       {
//         utterance: "how to update my profile information",

//         route: "/portfolio/profileinfo",

//         response: "Here's Your profile information. You can view or update them..",
//       },
//       {
//         utterance: "go to my profile information",

//         route: "/portfolio/profileinfo",

//         response: "Here's Your profile information. You can view or update them..",
//       },
//       {
//         utterance: "open my certificates",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "go to my certificates",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "go to my certifications",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "open my certifications",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "how to view my certifications",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "how to see my certificates",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "how to see my certifications",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "show me my certifications",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "show me my certificates",

//         route: "/portfolio/myaccount",

//         response: "Here you can view your certificates",
//       },
//       {
//         utterance: "go to dynamic timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "open dynamic timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "open dynamic timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "open my timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "go to my timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "show my timetable",

//         route: "/portfolio/dynamic-timetable",

//         response: "Here's your timetable.",
//       },
//       {
//         utterance: "open learning network",

//         route: "/portfolio/learning-network",

//         response: "Here's Learning Network",
//       },
//       {
//         utterance: "go to learning network",

//         route: "/portfolio/learning-network",

//         response: "Here's Learning Network",
//       },
//       {
//         utterance: "i want to go to learning network",

//         route: "/portfolio/learning-network",

//         response: "Here's Learning Network",
//       },

//   ];

//   return (
//     <div className="speech-bot-container">
//       <div
//         className={`button-container ${
//           isListening ? "voicebotframeactive" : "voicebotframe"
//         }`}
//       >
//         <button onClick={isListening ? stopListening : startListening}>
//           {isListening ? "Stop" : "Start"} Animation POst Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostLoginBot;
