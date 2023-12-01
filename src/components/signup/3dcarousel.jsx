import React, { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import branelogo from "../../assets/braneonlywhite.png";
import spinner from "../../assets/spinner.mp4";
import globe_brane from "../../assets/globe_brane.svg"
import { end_point } from "../../constants/urls";

function Carousel() {
  const odrag = useRef(null);
  const ospin = useRef(null);
  const ground = useRef(null);

  const [radius, setRadius] = useState(240);
  const [tX, setTX] = useState(0);
  const [tY, setTY] = useState(10);
  const [autoRotate] = useState(true);
  const [rotateSpeed] = useState(-60);
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState("");
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  useEffect(() => {
    // This timeout will add the 'visible' class to the logo after 1 second
    const timer = setTimeout(() => {
      setIsLogoVisible(true);
    }, 1000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      initCarousel();
    }
  }, [images]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${end_point}/carousel`);
      const data = await response.json();
      const res = data[0];
      setImages(res.images);
      setLogo(res.logo);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const initCarousel = () => {
    const imgWidth = 120;
    const imgHeight = 170;

    const aImg = ospin.current.getElementsByTagName("img");
    const aVid = ospin.current.getElementsByTagName("video");
    const aEle = [...aImg, ...aVid];

    ospin.current.style.width = imgWidth + "px";
    ospin.current.style.height = imgHeight + "px";
    ground.current.style.width = radius * 3 + "px";
    ground.current.style.height = radius * 3 + "px";

    for (let i = 0; i < aEle.length; i++) {
      
      aEle[i].style.transform =
        "rotateY(" +
        i * (360 / aEle.length) +
        "deg) translateZ(" +
        radius +
        "px)";
      aEle[i].style.transition = "transform 1s";
      aEle[i].style.transitionDelay = (aEle.length - i) / 4 + "s";
    }

    if (autoRotate) {
      const animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
      ospin.current.style.animation = `${animationName} ${Math.abs(
        rotateSpeed
      )}s infinite linear`;
    }

    applyTransform();
  };

  const applyTransform = () => {
    if (tY > 180) setTY(180);
    if (tY < 0) setTY(0);
    odrag.current.style.transform =
      "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
  };

  return (
    <div className="carousel-container">
      <div id="drag-container" ref={odrag}>
        <div id="spin-container" ref={ospin}>
          {images.map((src, index) => (
            <img key={index} src={src} alt="" />
          ))}
        </div>
        <div id="ground" ref={ground}></div>
        <div id="carousel-text">
          <img
            src={logo}
            className={`carousel-logo ${isLogoVisible ? "visible" : ""}`}
            id="carousel_logo"
          ></img>

          {/* <video
            src={spinner}
            autoplay
            muted
            loop
            // playsinline
            controls="true"
          ></video> */}
        </div>
      </div>
    </div>
  );
}
export default Carousel;
