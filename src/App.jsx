import "./App.css";
import { useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/homepage/HomePage.jsx";
import Portfolio from "./components/content-configuration/portfolio/Portfolio.jsx";
import DefaultPortfolioPage from "./components/content-configuration/portfolio/DefaultPortfolioPage";
import ChaptersTopics from "./components/content-configuration/portfolio/ChaptersTopics";
import TakeaClassPage from "./components/content-configuration/learning/TakeaClassPage";
import GamePlayer from "./components/content-configuration/learning/GamePlayer";
import Pdf from "./components/content-configuration/learning/PdfLecture";
import { StudentDetails } from "./components/context-api/StudentDetails";
import { useState } from "react";
import AssessmentsAPICall from "./components/content-configuration/assessments/AssessmentsAPICall";
import Signinform from "./components/signin/Signinform";
import MobileSignin from "./components/signin/Mobilesignin";
import FaceIDComponent from "./components/signin/FaceID";
import AudioRecorderSignin from "./components/signin/RecorderSignin";
import MultistepForm from "./components/signup/MultistepForm";
import Ppt from "./components/content-configuration/learning/PPTLecture";
import { Subject_Chapter_Topic } from "./components/context-api/Subject_Chapter_Topic";
import MyCertificates from "./components/content-configuration/portfolio/MyCertificates";
import GeneralSearch from "./components/generalsearch/GeneralSearch";
import Sports from "./components/content-configuration/sports/Sports";
import SportsPage from "./components/content-configuration/sports/SportsPage";
import SpecialSkills from "./components/content-configuration/specialskills/SpecialSkills";
import SpecialSkillsPage from "./components/content-configuration/specialskills/SpecialSkillsPage";
import Health from "./components/content-configuration/health/Health";
import LifeSkills from "./components/content-configuration/lifeskills/LifeSkills";
import ImproveSkills from "./components/content-configuration/specialskills/ImproveSkills";
import SpVideoContainer from "./components/content-configuration/specialskills/SpVideoContainer";
import LevelsComponent from "./components/content-configuration/specialskills/LevelsComponent";
import InstructionsScreen from "./components/content-configuration/specialskills/InstructionsScreen";
import LevelResultsDashboard from "./components/content-configuration/specialskills/levelResults";
import PersonalInfo from "./components/content-configuration/portfolio/PersonalInfo";
import ProfileInformation from "./components/content-configuration/portfolio/ProfileInformation";
import OverallResults from "./components/content-configuration/specialskills/OverallResults";
import VideoWithPoll from "./components/content-configuration/learning/VideoWithPoll";
import Level2 from "./components/content-configuration/assessments/Level2";
import Level3 from "./components/content-configuration/assessments/Level3";
import Level4 from "./components/content-configuration/assessments/Level4";
import ImproveSkillsDefaultComponent from "./components/content-configuration/specialskills/ImproveSkillsDefaultComponent";
import Examscreen from "./components/content-configuration/assessments/Examscreen";
import Instructions from "./components/content-configuration/assessments/Instructions";
import APICallComponentL2L3L4 from "./components/content-configuration/assessments/APICallComponentL2L3L4.jsx";
import SpeechBot from "./components/voicebot/VoiceBot.jsx";
import DashboardComponent from "./components/dashboard/DashboardComponent.jsx";

import PracticeExamscreen from "./components/content-configuration/practicetest/PracticeExamscreen.jsx";
import LevelOnePractice from "./components/content-configuration/practicetest/LevelOnePractice.jsx";
import LevelTwoPractice from "./components/content-configuration/practicetest/LevelTwoPractice.jsx";
import PracticeInstructions from "./components/content-configuration/practicetest/PracticeInstructions.jsx";
import LifeskillsPage from "./components/content-configuration/lifeskills/LifeskillsPage.jsx";
import PhysicalHealth from "./components/content-configuration/health/PhysicalHealth.jsx";
import ExpertsVideos from "./components/content-configuration/health/ExpertsVideos.jsx";
import HealthContainer from "./components/content-configuration/health/HealthContainer.jsx";
import PhyHealthComponent from "./components/content-configuration/health/PhyHealthComponent.jsx";
import DynamicTimeTable from "./components/dynamic-timetable/DynamicTimeTable.jsx";
import LearningNetwork from "./components/learning-network/LearningNetwork.jsx";
import AboutUs from "./components/homepage/AboutUs.jsx";
import ContactUs from "./components/homepage/ContactUs.jsx";
import PostLoginBot from "./components/voicebot/PostLoginBot.jsx";

import Questions_Generator from "./components/content-configuration/learning/Questions_Generator.jsx";
import LanguageLab from './components/language-lab/LanguageLab.jsx'
import SubscriptionDetails from './components/content-configuration/portfolio/SubscriptionDetails.jsx'
import SubscriptionPage from './components/subscription/SubscriptionPage.jsx'
import FineArts from "./components/finearts/FineArts.jsx";
import PlatformSupports from "./components/platform-supports/PlatformSupports.jsx";


function App() {
  const [student, setStudent] = useState({});
  const updateStudent = (newValue) => {
    setStudent(newValue);
  };
  // This ref object will hold references to multiple videos
  const videoRefs = useRef(new Map());
  const videoRef = useRef(null);

  // Function to update a specific video reference
  const updateVideoRef = (id, ref) => {
    if (ref) {
      console.log(`Adding/updating video ref for ID: ${id}`);
      videoRefs.current.set(id, ref);
    } else {
      console.log(`Removing video ref for ID: ${id}`);
      videoRefs.current.delete(id);
    }
  };
  const [subjectcontext, setSubjectContext] = useState({});
  const updateSubjectContext = (newValue) => {
    setSubjectContext(newValue);
  };

  // Add state to track user authentication
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const updateLoginStatus = (status) => {
    setIsUserLoggedIn(status);
  };

  // Updated logic to determine whether to show SpeechBot or PostLoginBot
  const showSpeechBot =
    // !isUserLoggedIn &&
    location.pathname === "/" ||
    location.pathname === "/#" ||
    location.pathname === "/login" ||
    location.pathname === "/login/" ||
    location.pathname === "/login/mobile" ||
    location.pathname === "/login/faceid" ||
    location.pathname === "/login/voiceid" ||
    location.pathname === "/signup" ||
    location.pathname === "/aboutus" ||
    location.pathname === "/contactus";

  const showAfterLoginBot = isUserLoggedIn;
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [triggerLoginFlag, setTriggerLoginFlag] = useState(false);
  const [triggerRecord, setTriggerRecord] = useState(false);
  const [triggerRecordAudio, setTriggerRecordAudio] = useState(false);

  const triggerLogin = () => {
    setTriggerLoginFlag(true);
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      // Clear the stored values when the user is logged in
      setMobileNumber("");
      setPin("");
      setTriggerLoginFlag(false);
    }
  }, [isUserLoggedIn]); // Dependency array to trigger this effect when isUserLoggedIn changes
  useEffect(() => {
    if (triggerRecordAudio) {
      // Logic to reset the state after a certain condition or time
      // For example, you can reset after a delay
      const timeoutId = setTimeout(() => {
        setTriggerRecordAudio(false);
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timeoutId);
    }
  }, [triggerRecordAudio]);
  const [activeKey, setActiveKey] = useState(null);
  const expandAccordionItem = (itemName) => {
    if (itemName === "Academics") {
      setActiveKey("0");
      console.log("Expanding Academics, Active Key set to 0");
    }
    // Add more conditions for other items
  };
  // useEffect(() => {
  //   if (activeKey !== null) {
  //     const timer = setTimeout(() => {
  //       setActiveKey(null);
  //       console.log("Active Key reset to null");
  //     }, 5000); // 5000 milliseconds = 5 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [activeKey]);
  const [triggerLogout, setTriggerLogout] = useState(false);
  useEffect(() => {
    if (triggerLogout) {
      // Reset the trigger after a short delay
      const timer = setTimeout(() => {
        setTriggerLogout(false);
      }, 1000); // Adjust the delay as needed

      return () => clearTimeout(timer);
    }
  }, [triggerLogout]);

  return (
    <>
      <StudentDetails.Provider value={{ student, updateStudent }}>
        <Subject_Chapter_Topic.Provider
          value={{ subjectcontext, updateSubjectContext }}
        >
          <Routes>
            <Route
              path="/"
              element={<HomePage updateVideoRef={updateVideoRef} />}
            ></Route>
            <Route path="/aboutus" element={<AboutUs />}></Route>
            <Route path="/contactus" element={<ContactUs />}></Route>

            <Route path="/login" element={<Signinform />}>
              <Route
                index
                element={
                  <MobileSignin
                    phoneNumber={mobileNumber}
                    pin={pin}
                    triggerLogin={triggerLoginFlag}
                    updateLoginStatus={updateLoginStatus}
                    setTriggerLoginFlag={setTriggerLoginFlag}
                  />
                }
              />
              <Route
                path="mobile"
                element={
                  <MobileSignin
                    phoneNumber={mobileNumber}
                    pin={pin}
                    triggerLogin={triggerLoginFlag}
                    updateLoginStatus={updateLoginStatus}
                    setTriggerLoginFlag={setTriggerLoginFlag}
                  />
                }
              />
              <Route
                path="faceid"
                element={
                  <FaceIDComponent updateLoginStatus={updateLoginStatus} />
                }
              />
              <Route
                path="voiceid"
                element={
                  <AudioRecorderSignin
                    updateLoginStatus={updateLoginStatus}
                    triggerRecord={triggerRecordAudio}
                  />
                }
              />
            </Route>
            <Route path="/signup" element={<MultistepForm />}></Route>
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  updateLoginStatus={updateLoginStatus}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                  triggerLogout={triggerLogout}
                />
              }
            >
              <Route index element={<DefaultPortfolioPage />}></Route>
              <Route
                path="/portfolio/generalsearch"
                element={<GeneralSearch />}
              ></Route>
              <Route
                path="/portfolio/chapters/:subject"
                element={<ChaptersTopics />}
              ></Route>
              <Route
                path="/portfolio/sports/:sports"
                element={<Sports />}
              ></Route>
              <Route
                path="/portfolio/specialskills/:specialskills"
                element={<SpecialSkills />}
              ></Route>
              <Route
                path="/portfolio/health/:health"
                element={<Health />}
              ></Route>
              <Route
                path="/portfolio/lifeskills/:lifeskill"
                element={<LifeSkills />}
              ></Route>
              <Route
                path="/portfolio/myaccount"
                element={<MyCertificates />}
              ></Route>
              <Route
                path="/portfolio/personalinfo"
                element={<PersonalInfo />}
              ></Route>
              <Route
                path="/portfolio/profileinfo"
                element={<ProfileInformation />}
              ></Route>

              {/*  */}
              <Route
                path="/portfolio/dynamic-timetable"
                element={<DynamicTimeTable />}
              ></Route>
              <Route
                path="/portfolio/learning-network"
                element={<LearningNetwork />}
              ></Route>
              <Route
                path="/portfolio/language-lab"
                element={<LanguageLab />}
              ></Route>
              <Route
                path="/portfolio/platform-supports"
                element={<PlatformSupports />}
              ></Route>

              <Route
                path="/portfolio/fine-arts"
                element={<FineArts />}
              ></Route>
              <Route
                path="/portfolio/subscription"
                element={<SubscriptionDetails />}
              ></Route>
            </Route>

            <Route path="/lifeskillspage" element={<LifeskillsPage videoRef={videoRef} />}></Route>
            <Route path="/sportspage" element={<SportsPage />}></Route>
            <Route
              path="/dashboard"
              element={
                <DashboardComponent updateLoginStatus={updateLoginStatus} />
              }
            ></Route>
            <Route path="/takelesson" element={<TakeaClassPage />}>
              <Route index element={<VideoWithPoll videoRef={videoRef} />}></Route>
              <Route
                path="/takelesson/lecture/:url"
                element={<VideoWithPoll videoRef={videoRef} />}
              ></Route>
              <Route
                path="/takelesson/syllabus of topic/:url"
                element={<Pdf />}
              ></Route>
              <Route
                path="/takelesson/pdf/:url"
                element={<Pdf />}
              ></Route>
              <Route
                path="/takelesson/definitions/:url"
                element={<Ppt />}
              ></Route>
              <Route
                path="/takelesson/learning through gaming/:url"
                element={<GamePlayer />}
              ></Route>
              <Route
                path="/takelesson/question generator"
                element={<Questions_Generator />}
              ></Route>
            </Route>
            <Route path="/levels" element={<LevelsComponent />}></Route>
            <Route path="/skills" element={<InstructionsScreen />}></Route>
            <Route path="/specialskills-improve" element={<ImproveSkills />}>
              <Route index element={<ImproveSkillsDefaultComponent />}></Route>
              <Route
                path="/specialskills-improve/:videourl"
                element={<SpVideoContainer />}
              ></Route>
            </Route>

            <Route path="/physical-health" element={<PhysicalHealth />}>
              <Route index element={<HealthContainer />}></Route>
              <Route
                path="/physical-health/:item"
                element={<PhyHealthComponent />}
              ></Route>
            </Route>
            <Route
              path="/health-experts-videos"
              element={<ExpertsVideos />}
            ></Route>

            <Route path="/overall-results" element={<OverallResults />}></Route>
            <Route
              path="/display-level-results"
              element={<LevelResultsDashboard />}
            ></Route>
            <Route path="/assessments" element={<Examscreen />}></Route>
            <Route
              path="/level-1-assessment"
              element={<AssessmentsAPICall />}
            ></Route>
            <Route path="/level-2-assessment" element={<Level2 />}></Route>
            <Route
              path="/assessment-instructions"
              element={<APICallComponentL2L3L4 />}
            ></Route>
            <Route
              path="/level-Instructions"
              element={<Instructions />}
            ></Route>

            <Route
              path="/practice-instructions"
              element={<PracticeInstructions />}
            ></Route>
            <Route
              path="/practice-test"
              element={<PracticeExamscreen />}
            ></Route>

            <Route path="/subscription/:mobileno" element={<SubscriptionPage />}></Route>

          </Routes>
        </Subject_Chapter_Topic.Provider>
      </StudentDetails.Provider>
      {showSpeechBot && (
        <SpeechBot
          videoRefs={videoRefs}
          setMobileNumber={setMobileNumber}
          setPin={setPin}
          triggerLogin={triggerLogin}
          setTriggerRecordAudio={setTriggerRecordAudio} // new prop
        />
      )}
      {showAfterLoginBot && (
        <PostLoginBot
          videoRefs={videoRefs}
          onCommandRecognized={expandAccordionItem}
          triggerLogout={setTriggerLogout} // Passing the setter function
          videoRef={videoRef}
        />
      )}
    </>
  );
}
export default App;