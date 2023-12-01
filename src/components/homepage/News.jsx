import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const settings = {
  dots: false,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade:true,
  autoplay: true,
  autoplaySpeed: 3000,
  beforeChange: (current, next) => {

  },
};
const News = ({ homepage_news }) => {
  const { Newsletter_images } = homepage_news;
  return (
    <section className="homepage__newscomponent">
      <article className="homepage__newscomponent__heading"></article>
      <div className="homepage__newscomponent__slider__container">
        <Slider {...settings}>
          {Newsletter_images.map((element, index) => (
            <img src={element} key={index} alt={`Image ${index}`} />
          ))}
        </Slider>
      </div>
    </section>
  );
};
export default News;
