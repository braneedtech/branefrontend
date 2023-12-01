import React, { useState, useEffect, useRef } from 'react';

// Import your custom SVG icons
import muteIcon from '../../assets/mute.svg';
import volumeUpIcon from '../../assets/volume-up.svg';

const Ourprojects = ({ updateVideoRef, homepage_ourprojects  }) => {
  const [feature1, feature2, feature3, feature4, feature5, feature6] = homepage_ourprojects;

  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start as muted
  const [isMouseOver, setIsMouseOver] = useState(false); // Add this state

  const videoContainerRef = useRef(null);

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  const handleVideoClick = () => {
    if (showVideo) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
    setShowVideo(!showVideo);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleMouseEnter = () => {
    // Start a timer to check for mouseover duration
    const mouseOverTimer = setTimeout(() => {
      if (!showVideo) {
        handleVideoClick();
      }
    }, 4000); // Adjust the duration as needed (4 seconds in this case)

    setIsMouseOver(true);

    return () => {
      // Clear the timer when the mouse leaves the element
      clearTimeout(mouseOverTimer);
      setIsMouseOver(false);
    };
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (showVideo && videoElement) {
      videoElement.play();
      videoElement.addEventListener('ended', handleVideoEnd);

      // Create an Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            // Element is in the viewport, play the video
            videoElement.play();
          } else {
            // Element is out of the viewport, pause the video
            videoElement.pause();
          }
        },
        { threshold: 0.5 } // Adjust the threshold as needed
      );

      // Start observing the video container
      observer.observe(videoContainerRef.current);

      // Cleanup the observer when the component is unmounted
      return () => {
        observer.disconnect();
      };
    }
  }, [showVideo]);

  const { description, thumbnail, title, longvideo } = feature1;

  const videoRef = useRef(null);

  useEffect(() => {
    updateVideoRef('ourProjectsVideo', videoRef);

    return () => {
      updateVideoRef('ourProjectsVideo', null);
    };
  }, [updateVideoRef]);

  return (
    <div
      className="homepage__ourprojects"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {showVideo ? (
        <div className="video-container" ref={videoContainerRef}>
          <video
            id="videoPlayer"
            ref={videoRef}
            style={{ width: '99vw' }}
            onClick={handleVideoClick}
            muted={isMuted} // Set muted attribute based on state
          >
            <source src={longvideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mute-toggle" onClick={handleMuteToggle}>
            {isMuted ? (
              <img src={muteIcon} alt="Mute" />
            ) : (
              <img src={volumeUpIcon} alt="Volume Up" />
            )}
          </div>
        </div>
      ) : (
        <div onClick={handleVideoClick} className="banner-image-container">
          <img className="banner-image" src={thumbnail} alt="Banner" />
          <p className="overlay-text">{title}</p>
          <p className="overlay-text-desc">{description}</p>
          {isMouseOver && <p>Hover over for 4 seconds to play video</p>}
          
        </div>
      )}
    </div>
  );
};

export default Ourprojects;
