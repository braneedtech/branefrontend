const Ourpartners = ({ homepage_ourpartners }) => {
    const { amazon, google, microsoft, deloitte, apple, whatsapp, Netflix } = homepage_ourpartners;
    return (
      <>
        <section className='homepage__ourpartners'>
          <h1 className='homepage__ourpartners__heading'>Our Partners</h1>
          <article className="homepage__ourpartners__parent" >
            {/* <img src={amazon} alt="Amazon" /> */}
            <img src={google} alt="Google" />
            <div className="microsoftlogo">
            <img src={microsoft} alt="Microsoft" />
            </div>
            {/* <img src={deloitte} alt="Deloitte" /> */}
            <img src={apple} alt="apple" />
            <img src={whatsapp} alt="whatsapp" />
            {/* <img src={Netflix} alt="Netflix" /> */}
          </article>
        </section>
      </>
    );
}
export default Ourpartners;  