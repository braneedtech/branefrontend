const Ourfeatures = ({ homepage_ourfeatures }) => {
    return (
      <>
        <section className="homepage__ourfeatures">
          <article className="homepage__ourfeatures__section">
            <article data-aos='fade-right' data-aos-delay='10s' className="homepage__ourfeatures__section__heading">
              Why Choose Us?
            </article>
            <article className='homepage__ourfeatures__section__container'>
              {homepage_ourfeatures.map((feature, index) => (
                <article data-aos="fade-right" key={index} className="homepage__ourfeatures__section__container__card">
                  <div className="homepage__ourfeatures__section__container__card-top">
                    <div>
                      <img className="ourfeature__img" src={feature.image} alt={`Feature ${index + 1}`} data-aos="rotate-c" />
                    </div>
                    <div>
                      {feature.title}
                    </div>
                  </div>
                  <div className="homepage__ourfeatures__section__container__card-bottom">
                    {feature.description}
                  </div>
                </article>
              ))}
            </article>
          </article>
        </section>
      </>
    );
  }
  export default Ourfeatures;
  