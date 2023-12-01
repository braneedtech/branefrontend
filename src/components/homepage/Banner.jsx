import { useNavigate } from "react-router-dom";
import bannervideo from "../../assets/bannervideo.mp4";
import Carousel from "../signup/3dcarousel";
const Banner = ({ homepage_banner }) => {
  const { banner_description, banner_animation, banner_quote } =
    homepage_banner;

  // Add a line break after "Empower" and after "Learning"
  const formattedBannerQuote = banner_quote.replace("Empower.", "Empower.\n");
  // .replace("Learning", "Learning\n");
  const handleNavigationClick = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    const navbarHeight = document.querySelector('.homepage__header').offsetHeight; // Replace with your actual navbar class
    const sectionId = e.currentTarget.getAttribute("href").slice(1); // Get the section ID from the href attribute
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionTop = section.getBoundingClientRect().top; // Get the top position of the section
      window.scrollBy({ 
        top: sectionTop - navbarHeight, // Offset by the navbar height
        behavior: "smooth"
      });
    }
  };
  const navigate = useNavigate()
  

  return (
    <>
      <section className="homepage__banner">
        <article className="homepage__banner__main">
          <article className="homepage__banner__main__content">
            <article className="homepage__banner__main__content__title">
              {formattedBannerQuote.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </article>

            <article className="homepage__banner__main__animation">
              <Carousel></Carousel>
            </article>
            <div className="bottompart">
              <article className="homepage__banner__main__content__description">
                {banner_description}
              </article>

              <article className="homepage__banner__main__content__button">
                <button onClick={()=>{
                  navigate("/login")
                }}>
                  Get Started{" "}
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
                <a  href="#next-section" className="navigate-to" onClick={handleNavigationClick}></a>
              </article>

            </div>
          </article>

          {/* <article className="homepage__banner__main__video">
            <video
              autoPlay
              loop
              muted
              style={{ width: "35vw" }}
            >
              <source src={banner_animation} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </article> */}
        </article>
      </section>
    </>
  );
};

export default Banner;
