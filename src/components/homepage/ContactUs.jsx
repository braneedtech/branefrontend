import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import './about.css';
import contactusimg from '../../assets/contactusimg.svg';
import axios from "axios";
import { end_point } from "../../constants/urls";


const ContactUs = () => {
  const [contactUsData, setContactUsData] = useState({
    name: '',
    email: '',
    mobileno: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactUsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', contactUsData);
    try {
      const response = await axios.post(`${end_point}/contactus-details`, contactUsData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(response)
      if (response) {
        if (response?.data.success) {
          toast.success('Data Saved Successfully!', {
            position: 'top-right',
            autoClose: 3000, // Close the toast message after 3 seconds
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
          });

          // Clear input fields
          setContactUsData({
            name: '',
            email: '',
            mobileno: '',
            message: '',
          });
        }
      }
    } catch (error) {
      console.log(error)
    }


  };

  return (
    <>
      <Header
        homepage_header={{
          nav_links: ['Home', 'About', 'Contact', 'For Parents', 'Patents'],
          brane_logo:
            'https://braneeducation.s3.ap-south-1.amazonaws.com/Homepage_images/logo/brane-white.svg',
        }}
      />
      <section className="contactus">
        <section className="contactus__wrapper">
          <article className="contactus__wrapper__left">
            <div className="contactus__wrapper__left__heading">Contact Us</div>
            <form
              className="contactus__wrapper__left__form"
              onSubmit={handleSubmit}
            >
              <div className="contactus__wrapper__left__form__input">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={contactUsData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="contactus__wrapper__left__form__input">
                <input
                  type="email"
                  placeholder="Enter an email address"
                  name="email"
                  value={contactUsData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="contactus__wrapper__left__form__input">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  name="mobileno"
                  value={contactUsData.mobileno}
                  onChange={handleChange}
                />
              </div>
              <div className="contactus__wrapper__left__form__input">
                <textarea
                  placeholder="Message"
                  name="message"
                  value={contactUsData.message}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button type="submit">Submit</button>
              </div>
            </form>
          </article>
          <article className="contactus__wrapper__right">
            <img src={contactusimg} alt="Contact Us Image" />
          </article>
        </section>
      </section>
      <ToastContainer />
    </>
  );
};

export default ContactUs;
