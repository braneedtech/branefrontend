import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const settings = {
  dots: false,
  infinite: true,
  speed: 700,
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  beforeChange: (current, next) => {},
};
const Boards = ({ homepage_boards }) => {
  const { boards_images } = homepage_boards;
  const imageStyle = {
    width: '60%', // Set a fixed width for all images
    height: 'auto', // Maintain aspect ratio
  };
  return (
    <section className="homepage__boards">
      <article className="homepage__boards__heading">
        We provide Content for Multiple Curriculum
      </article>
      <div className="slider__container">
        <Slider {...settings}>
          {boards_images.map((image, index) => (
            <div key={index} className="slide">
              <img src={image} alt={`Image ${index}`} style={imageStyle} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};
export default Boards;