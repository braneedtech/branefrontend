import { useState } from "react";
import { end_point } from "../../../constants/urls";
import { useQuery } from "react-query";
import loader from "../../../assets/loading/loader.gif";
import brane_get_service from "../../../services/brane_get_service";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import sunimage from "../../../assets/DaySun.png";
import moonimage from "../../../assets/Moon.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrow from "../../../assets/uparrow.svg";

import SpeakerOff from "../../../assets/SpeakerOff.svg"
import SpeakerOn from "../../../assets/SpeakerOn.gif"




const DefaultPortfolioPage = () => {
  const { data, error, isLoading } = useQuery(
    [
      "default_portfolio_page_content",
      `${end_point}/portfolio_default_page_content`,
    ],
    brane_get_service
  );
  const [isSpeakOut, setIsSpeakOut] = useState(false)

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const greeting_message =
    currentHour >= 7 && currentHour <= 11
      ? "Good Morning"
      : currentHour >= 12 && currentHour <= 16
      ? "Good Afternoon"
      : "Good Evening";

      let default_data = {};
  if (!isLoading && error == null) {
    const { data: alias } = data;
    const [default_page_data] = alias;
    default_data = default_page_data;
  }

  let videos = []; // Initialize videos as an empty array
  const { student } = StudentDetailsCustomHook();

  if (!isLoading && error == null) {
    // Check if the response data has the expected structure
    if (data?.data?.[0]?.[0] && Array.isArray(data.data[0][0])) {
      videos = data.data[0][0]; // Access the array of video objects
    } else {
      // If data is not in the expected format, log an error or set a fallback
      console.error('Data is not in the expected format:', data);
    }
  }
// Custom arrow components
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev-arrow`}
      style={{ ...style, display: "block" }} // Ensure the custom arrow is displayed
      onClick={onClick}
    >
      <img src={arrow} alt="Previous" />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next-arrow`}
      style={{ ...style, display: "block" }} // Ensure the custom arrow is displayed
      onClick={onClick}
    >
      <img src={arrow} alt="Next" />
    </div>
  );
};
  // Settings for react-slick
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Use the custom previous arrow component
    nextArrow: <NextArrow />, // Use the custom next arrow component
  };
  const speakout = (text) => {
    const synth = window.speechSynthesis;
    if (!isSpeakOut) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      synth.speak(utterance);
    } else {
      synth.cancel(); // Stop speaking
    }
    setIsSpeakOut(!isSpeakOut);
  };


  return (
    <>
      {!isLoading ? (
        error != null ? (
          <p>{JSON.stringify(error.message)}</p>
        ) : (
          <>
          <div className="landing__rightbox__content__topcontent">
            <div className="landing__rightbox__content__topcontent__greeting">
              <div className="landing__rightbox__content__topcontent__greeting__img">
                <img
                  src={
                    currentHour >= 7 && currentHour <= 17
                      ? sunimage
                      : moonimage
                  }
                  alt="Greeting"
                />
              </div>
              <div className="landing__rightbox__content__topcontent__greeting__text">
                <div className="landing__rightbox__content__topcontent__greeting__text_1">
                  {greeting_message}
                </div>
                <div className="landing__rightbox__content__topcontent__greeting__text_2">
                  <p> {student?.student_name} </p>
                </div>
              </div>
            </div>
            <div className="landing__rightbox__content__topcontent__quote">
              <h6>Daily Inspiration :</h6>
              <div className="landing__rightbox__content__topcontent__quote__text1">
                <span> {default_data?.quotation}</span>
              </div>

              <div className="landing__rightbox__content__topcontent__quote__text4">
                <span> - {default_data?.author}</span>
              </div>
              <div className="landing__rightbox__content__topcontent__quote__icon"
                      onClick={()=>speakout(default_data?.quotation)}
                    >
                      {
                        isSpeakOut ? (
                          <img src={SpeakerOn} alt="Speaker On" srcset="" />
                        ) : (
                          <img src={SpeakerOff} alt="Speaker Off" srcset="" />
                        )
                      }
                    </div>
            </div>
          </div>
          <div className="landing__rightbox__content__bottomcontent__video">
      <p>This week's Inspiring personality</p>
      {Array.isArray(videos) && (
        <Slider {...settings}>
          {videos.map((video, index) => (
            <div key={index}>
              <video
                id={`video-${index}`}
                // className="video-js"
                controls
                preload="auto"
                width="340"
                height="190"
                poster={video.thumbnail_img}
                data-setup="{}"
                type="video/mp4"
              >
                <source src={video.video_link} type="video/mp4" />
                <p className="vjs-no-js">
                  To view this video please enable JavaScript, and consider
                  upgrading to a web browser that
                  <a
                    href="https://videojs.com/html5-video-support/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    supports HTML5 video
                  </a>
                </p>
              </video>
            </div>
          ))}
        </Slider>
      )}
    </div>
          </>
        )
      ) : (
        <img src={loader} className="loader" alt="Loading" width={200} height={200} />
      )}
    </>
  );
};

export default DefaultPortfolioPage;