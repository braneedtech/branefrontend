// import React, { useState, useEffect } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// // const isTabletMode = window.innerWidth<=768;
// // const isLaptopMode = window.innerWidth>768;
// // const settings = {
// //   dots: false,
// //   arrows: false,
// //   infinite: true,
// //   speed: 1000,
// //   autoplay: true,
// //   autoplaySpeed: 2000,
// //   // slidesToShow: 3,
// //   slidesToShow: isTabletMode ? 2: isLaptopMode ? 3:3,
// //   slidesToScroll: 1,
// // };

// const [windowWidth, setWindowWidth] = useState(window.innerWidth);
// useEffect(() => {
//   const handleResize = () => {
//     setWindowWidth(window.innerWidth);
//   };
//   window.addEventListener("resize", handleResize);
//   return () => {
//     window.removeEventListener("resize", handleResize);
//   };
// }, []); // Empty dependency array means this effect runs once after the initial render   const isTabletMode = windowWidth <= 768;   const isLaptopMode = windowWidth > 768 && windowWidth <= 1024;   const settings = {     dots: false,     arrows: false,     infinite: true,     speed: 1000,     autoplay: true,     autoplaySpeed: 2000,     slidesToShow: isTabletMode ? 2 : isLaptopMode ? 3 : 3, // Adjust based on screen size    slidesToScroll: 1,   };



// const ParentsVoice = ({ homepage_parents_voice }) => {


//   return (
//     <>
//       <section className="homepage__parentsvoice">
//         <article className="homepage__parentsvoice__section">
//           <article className="homepage__parentsvoice__section__title">
//             <h1>Parent's Voice</h1>
//           </article>
//           <Slider {...settings} className="homepage__parentsvoice__section__carousel">
//             {homepage_parents_voice.map((item, index) => (
//               <div key={index} className="homepage__parentsvoice__section__carousel-row">
//                 <div className="homepage__parentsvoice__section__carousel-row-card1">
//                   <div className="homepage__parentsvoice__section__carousel-row-card1-text">
//                     <div className="homepage__parentsvoice__section__carousel-row-card1-text-top" >
//                       <div className="homepage__parentsvoice__section__carousel-row-card1-image">
//                         <img src={item.image} width="55vw" height="55vh" alt={`Image ${index}`} />
//                       </div>
//                     </div>
//                     <div className="homepage__parentsvoice__section__carousel-row-card1-text-rightside">
//                       <div className="homepage__parentsvoice__section__carousel-row-card1-text-heading" >
//                         <h3 className="homepage__parentsvoice__section__carousel-row-card1-text-name">
//                           {item.parent_name}
//                         </h3>
//                         <h4 className="homepage__parentsvoice__section__carousel-row-card1-text-desc">
//                           Parent, {item.student_name}
//                         </h4>
//                       </div>
//                       <h5 className="homepage__parentsvoice__section__carousel-row-card1-text-review">
//                         {item.description}
//                       </h5>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </article>
//       </section>
//     </>
//   );
// }
// export default ParentsVoice;




import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// const cardColors = ["#ff7f50", "#6495ed", "#98fb98", "#dda0dd", "#ff4500"];
const cardColors = ["#c5b560", "#bb80b8", "#998bea","#dda0dd"];
const ParentsVoice = ({ homepage_parents_voice }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  const isTabletMode = windowWidth <= 768;
  const isLaptopMode = windowWidth > 768 && windowWidth <= 1024;

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: isTabletMode ? 2 : isLaptopMode ? 3 : 3,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className="homepage__parentsvoice">
        <article className="homepage__parentsvoice__section">
          <article className="homepage__parentsvoice__section__title">
            <h1>Parent's Voice</h1>
          </article>
          <Slider {...settings} className="homepage__parentsvoice__section__carousel">
            {homepage_parents_voice.map((item, index) => (
              <div key={index} className="homepage__parentsvoice__section__carousel-row">
              {/* // <div
              //   key={index}
              //   className="homepage__parentsvoice__section__carousel-row"
              //   style={{ backgroundColor: cardColors[index % cardColors.length] }}
              // > */}

                <div className="homepage__parentsvoice__section__carousel-row-card1"
                  style={{ backgroundColor: cardColors[index % cardColors.length] }}
                >
                  <div className="homepage__parentsvoice__section__carousel-row-card1-text">
                    <div className="homepage__parentsvoice__section__carousel-row-card1-text-top">
                      <div className="homepage__parentsvoice__section__carousel-row-card1-image">
                        <img src={item.image} width="55vw" height="55vh" alt={`Image ${index}`} />
                      </div>
                    </div>
                    <div className="homepage__parentsvoice__section__carousel-row-card1-text-rightside">
                      <div className="homepage__parentsvoice__section__carousel-row-card1-text-heading">
                        <h3 className="homepage__parentsvoice__section__carousel-row-card1-text-name">
                          {item.parent_name}
                        </h3>
                        <h4 className="homepage__parentsvoice__section__carousel-row-card1-text-desc">
                          Parent, {item.student_name}
                        </h4>
                      </div>
                      <h5 className="homepage__parentsvoice__section__carousel-row-card1-text-review">
                        {item.description}
                      </h5>
                    </div>
                  </div>
                </div>
               </div>
            ))}
          </Slider>
        </article>
      </section>
    </>
  );
};

export default ParentsVoice;