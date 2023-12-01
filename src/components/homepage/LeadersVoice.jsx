import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import braneback from "../../assets/swril-blue-thick.svg";
import arrow from "../../assets/uparrow.svg";

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

function LeadersVoice({ homepage_leaders_voice, updateVideoRef }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const sliderRef = useRef(null);
  const autoplayManager = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [rotation, setRotation] = useState(
    Array(homepage_leaders_voice.length).fill(false)
  );
  const [direction, setDirection] = useState("up"); // Default direction

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleBeforeChange = (oldIndex, newIndex) => {
    // Check if the slider is transitioning from the last slide to the first slide
    const isWrappingToStart =
      oldIndex === homepage_leaders_voice.length - 1 && newIndex === 0;
    // Check if the slider is transitioning from the first slide to the last slide
    const isWrappingToEnd =
      oldIndex === 0 && newIndex === homepage_leaders_voice.length - 1;

    // Determine the direction of the slide change with wrap-around logic
    if (isWrappingToStart) {
      setDirection("up");
    } else if (isWrappingToEnd) {
      setDirection("down");
    } else {
      setDirection(newIndex > oldIndex ? "up" : "down");
    }

    // Pause the video in the old slide when changing slides
    if (videoRefs.current[oldIndex] && !videoRefs.current[oldIndex].paused) {
      videoRefs.current[oldIndex].pause();
    }
  };

  const handleAfterChange = (current) => {
    // Set the rotation state to true for the current slide
    setActiveSlide(current);
    setCurrentSlide(current);
     // Update the video reference for the active slide
     updateVideoRef('leadersVoiceVideo', videoRefs.current[current]);
    const newRotation = [...rotation];
    newRotation[current] = true; // Only the current slide will have the rotation state true
    setRotation(newRotation);
  };

  const handleVideoPlay = () => {
    if (autoplayManager.current) {
      autoplayManager.current.pause();
    }
  };

  const handleVideoPause = () => {
    if (autoplayManager.current) {
      autoplayManager.current.play();
    }
  };

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    centerPadding: "0",
    beforeChange: (oldIndex, newIndex) => {
      handleBeforeChange(oldIndex, newIndex);
      handleSlideChange(newIndex);
    },
    prevArrow: <PrevArrow />, // Use the custom previous arrow component
    nextArrow: <NextArrow />, // Use the custom next arrow component
    afterChange: handleAfterChange, // Use the new handler here
  };

  useEffect(() => {
    // Initialize the autoplay manager
    autoplayManager.current = sliderRef.current.innerSlider.autoPlay;

    // Add event listeners to each video element
    videoRefs.current.forEach((video) => {
      video.addEventListener("play", handleVideoPlay);
      video.addEventListener("pause", handleVideoPause);
    });

    // Cleanup: remove event listeners when component unmounts
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.removeEventListener("play", handleVideoPlay);
          video.removeEventListener("pause", handleVideoPause);
        }
      });
    };
  }, []);

  // Function to split the quote into words and wrap each word with a span
  const renderQuote = (quote, slideIndex) => {
    // Split the quote into words and map over it to return an array of spans
    return quote.split(' ').map((word, index) => (
      <React.Fragment key={`${slideIndex}-${index}`}>
        <span
          style={{
            animation: `fade-in 0.8s ${0.1 * (index + 1)}s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
            display: 'inline-block',
            opacity: 0,
            filter: 'blur(4px)',
            marginRight: '1px', // Add some space to the right of each word
          }}
        >
          {word}
        </span>{' '} {/* This space is important to keep words separate */}
      </React.Fragment>
    ));
  };


  return (
    <div className="homepage__leadersvoice">
      <div>
        <h1 className="heading">Leader's Voice</h1>
      </div>
      <div className="leader-carousel-container">
        <Slider ref={sliderRef} {...sliderSettings}>
          {homepage_leaders_voice.map((slide, index) => (
            <div key={slide.key}>
              <section className="content">
                <div className="slide">
                  <h2 className="text"> {renderQuote(slide.content.quote, currentSlide)}</h2>
                  <div className="videopart">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el; // Associate each video element with its ref
                      if (index === currentSlide) {
                        updateVideoRef('leadersVoiceVideo', el); // Update the ref for the current slide
                      }
                    }}
                    controls
                    poster={slide.content.thumbnail}
                  >
                    <source src={slide.content.video} type="video/mp4" />
                  </video>
                    <p className="caption">{slide.content.caption}</p>

                  </div>
                  {/* <img
                    src={braneback}
                    className={`vertical-swirlblue 
                      ${
                        index === currentSlide
                          ? `vertical-swirlblue-animate-${direction}`
                          : rotation[index]
                          ? "vertical-swirlblue-rotated"
                          : ""
                      }`
                    }
                    alt="swirl"
                  /> */}
                </div>
                
              </section>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default LeadersVoice;