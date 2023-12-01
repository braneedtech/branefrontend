import logo from "../../assets/footericon.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import twitter from "../../assets/twitter.png";

function Footer() {
  return (
    <>
      <section className="homepage__footer">
        <section className="homepage__footer__section">
          <article className="homepage__footer__section__materials">
            <h4>Study Materials</h4>
            <ul>
              <li>
                <a href="#">NCERT TextBooks</a>
              </li>
              <li>
                <a href="#">NCERT Solutions</a>
              </li>
              <li>
                <a href="#">CBSE Materials</a>
              </li>
              <li>
                <a href="#">State Boards</a>
              </li>
            </ul>
          </article>
          <article className="homepage__footer__section__community">
            <h4>Community</h4>
            <ul>
              <li>
                <a href="#">Learning Network</a>
              </li>
              <li>
                <a href="#">FAQ's</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </article>
          <article className="homepage__footer__section__company">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">What Makes Us Different?</a>
              </li>
              <li>
                <a href="#">Partners</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              
            </ul>
          </article>
          <article className="homepage__footer__section__contact">
            <h4>Contact Us</h4>
            <address>
              Corporate Office:
              Building 3A & 3B,
              Raheja Mindspace,
              HUDA Techno Enclave,
              HITEC City,
              Telangana 500081
            </address>
            <p>
              <a href="mailto:info@braneenterprises.com">info@braneenterprises.com</a>
            </p>
          </article>
        </section>
        <section className="homepage__footer__bottom">
          <article className="homepage__footer__bottom__logo">
            <img src={logo} alt="Logo" width="52" height="52" />
          </article>
          <article className="homepage__footer__bottom__rights">
            <span>@2023 Brane Education. All rights reserved</span> |
            <a href="#">Terms & Conditions</a> |
            <a href="#">Privacy Policy</a>
          </article>
          <article className="homepage__footer__bottom__socialmedia">
            <a href="#" className="twitter">
              <img src={twitter} alt="Twitter" width="20" height="20" />
            </a>
            <a href="#" className="facebook">
              <img src={facebook} alt="Facebook" width="12" height="20" />
            </a>
            <a href="#" className="instagram">
              <img src={instagram} alt="Instagram" width="20" height="20" />
            </a>
          </article>
        </section>
      </section>
    </>
  );
}

export default Footer;
