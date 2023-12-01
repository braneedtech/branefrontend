import { useState } from "react";
import axios from "axios";
import generateOtp from "../../services/otp_generation_service";
import fetchAddressDetails from "../../services/get_location_service";

const StepThree = ({ values, setFieldValue, handleNext, handlePrevious }) => {
  const [touched, setTouched] = useState({}); // Track touched fields
  const [errors, setErrors] = useState({});
  const isStepThreeEntered = values.parentsname && values.parentssurname &&
    values.parentsemail && values.country && values.state &&
    values.pincode && values.city && values.district &&
    values.address && values.mothertongue !== "none";
  const [showspinner, setShowSpinner] = useState(false)
  const validateStepThree = (values) => {
    const newErrors = {};

    if (!values.parentsname && touched.parentsname) {
      newErrors.parentsname = 'Name is required';
    } else {
      newErrors.parentsname = '';
    }

    if (!values.parentssurname && touched.parentssurname) {
      newErrors.parentssurname = 'Surname is required';
    } else {
      newErrors.parentssurname = '';
    }

    if (!values.parentsalternateno && touched.parentsalternateno) {
      newErrors.parentsalternateno = 'Alternate mobile number is required';
    } else if (!/^\d{10}$/.test(values.parentsalternateno) && touched.parentsalternateno) {
      newErrors.parentsalternateno = 'Enter only 10 digits';
    } else if (values.parentsalternateno === values.parentsmobileno && touched.parentsalternateno) {
      newErrors.parentsalternateno = 'Alternate mobile number should not match with parentsmobile';
    } else {
      newErrors.parentsalternateno = '';
    }

    if (!values.parentsemail && touched.parentsemail) {
      newErrors.parentsemail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(values.parentsemail) && touched.parentsemail) {
      newErrors.parentsemail = 'Invalid email';
    } else {
      newErrors.parentsemail = '';
    }

    if (!values.country && touched.country) {
      newErrors.country = 'Country is required';
    } else {
      newErrors.country = '';
    }

    if (!values.pincode && touched.pincode) {
      newErrors.pincode = 'Pin Code is required';
    } else {
      newErrors.pincode = '';
    }

    if (!values.state && touched.state) {
      newErrors.state = 'State is required';
    } else {
      newErrors.state = '';
    }

    if (!values.city && touched.city) {
      newErrors.city = 'City is required';
    } else {
      newErrors.city = '';
    }

    if (!values.district && touched.district) {
      newErrors.district = 'District is required';
    } else {
      newErrors.district = '';
    }

    if (!values.address && touched.address) {
      newErrors.address = 'Address is required';
    } else {
      newErrors.address = '';
    }

    if (!values.mothertongue || values.mothertongue === 'none') {
      newErrors.mothertongue = 'Mother Tongue is required';
    } else {
      newErrors.mothertongue = '';
    }

    for (const key in newErrors) {
      if (newErrors[key] === '') {
        delete newErrors[key];
      }
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    setFieldValue(fieldName, value);
    setTouched({ ...touched, [fieldName]: true }); // Mark field as touched
    validateStepThree({ ...values, [fieldName]: value }); // Pass updated values to validate
  };


  const [generatedOTP, setGeneratedOTP] = useState("");
  const [isOTPMatched, setIsOTPMatched] = useState(false);
  const [isalternatenoentered, setIsAlternateNoEntered] = useState(false);
  const speakout = window.speechSynthesis;

  const handleMobileNumberChange = async (e) => {
    const mobileNumber = e.target.value;
    setFieldValue("parentsalternateno", mobileNumber);

    if (mobileNumber.length === 10) {
      setIsAlternateNoEntered(true)
      const resp = await generateOtp(mobileNumber);

      if (resp) {
        if (resp.sent) {
          setGeneratedOTP(resp.otp.toString());
        }
      }
    } else {
      setGeneratedOTP("");
    }
  };

  const handleOTPChange = (e) => {
    const otpNumber = e.target.value;
    setFieldValue("parentsalternateotp", otpNumber);
    if (otpNumber.length === 4) {
      if (otpNumber === generatedOTP) {
        setIsOTPMatched(true);
        setIsFieldsDisabled(true); // Disable the input fields after OTP match
      } else {
        setIsOTPMatched(false);
      }
    } else {
      setIsOTPMatched(false); // Handle the case when OTP is not 4 digits
    }
  };

  const handleGetLocation = async () => {
    setShowSpinner(true)
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const address = await fetchAddressDetails(latitude, longitude);
        if (address) {
          setFieldValue("country", address.country);
          setFieldValue("state", address.state);
          setFieldValue("city", address.city);
          setFieldValue("pincode", address.pincode);
          setFieldValue("address", address.address);
          setFieldValue("district", address.district);
          setShowSpinner(false)
          const speaking = new SpeechSynthesisUtterance("Location Fetched successfully");
          speakout.speak(speaking);
        } else {
          alert("Failed to get address details. Please try again.");
          const speaking = new SpeechSynthesisUtterance("Failed to get address details. Please try again");
          speakout.speak(speaking);
        }
      } catch (error) {
        console.error("Error getting location", error);
        alert("An error occurred while getting the location. Please try again.");
      }
    } else {
      alert("Geolocation is not available in your browser.");
      const speaking = new SpeechSynthesisUtterance("Geolocation is not available in your browser.");
      speakout.speak(speaking);
    }
  };

  const handleNextClick = () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors && isStepThreeEntered) {
      setErrors({})
      handleNext()
      const speaking = new SpeechSynthesisUtterance("Enter your child details");
      speakout.speak(speaking);
    }
  };


  return (
    <>
      <div className="signup__container__form__div__form__heading">Parent Details</div>
      <article className="signup__container__form__div__form__sec" style={{maxHeight:"17rem"}}>
        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-person-fill icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="parentsname"
            name="parentsname"
            onChange={handleInputChange}
            value={values.parentsname}
            placeholder="Name"
            onFocus={() => {
              const speaking = new SpeechSynthesisUtterance("Enter Parent Name");
              speakout.speak(speaking);
            }}
          />
        </div>
        {(touched.parentsname && errors.parentsname) && (
          <small>{errors.parentsname}</small>
        )}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-person-fill icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="parentssurname"
            name="parentssurname"
            onChange={handleInputChange}
            value={values.parentssurname}
            placeholder="Surname"
          />
        </div>
        {(touched.parentssurname && errors.parentssurname) && (
          <small>{errors.parentssurname}</small>
        )}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-telephone icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="parentsalternateno"
            name="parentsalternateno"
            onChange={handleMobileNumberChange}
            placeholder="Alternate Mobile no (Optional)"
            maxLength={10}
          />
        </div>
        {(touched.parentsalternateno && errors.parentsalternateno) && (
          <small>{errors.parentsalternateno}</small>
        )}

        {isalternatenoentered && (
          <div className="signup__container__form__div__form__sec__input-container">
            <i className="bi bi-telephone icon"></i>
            <input
              className="signup__container__form__div__form__sec__input-container__input-field-password"
              type="text"
              id="parentsalternateotp"
              name="parentsalternateotp"
              onChange={handleOTPChange}
              placeholder="OTP"
              maxLength={4}
              disabled={isOTPMatched}
            />
            {values.parentsalternateno.length === 10 && values.parentsalternateotp.length === 4 && (
              isOTPMatched ? (
                <i className="fa fa-check-circle password-icon" style={{ color: "green", fontSize: "1.75rem" }}></i>
              ) : (
                <i className="fa fa-times-circle password-icon" style={{ color: "red", fontSize: "1.75rem" }}></i>
              )
            )}
          </div>
        )}

        {
          (touched.parentsalternateotp && errors.parentsalternateotp) && (
            <small>{errors.parentsalternateotp}</small>
          )
        }

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-envelope icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="email"
            id="parentsemail"
            name="parentsemail"
            onChange={handleInputChange}
            value={values.parentsemail}
            placeholder="Email Address"
            onFocus={() => {
              const speaking = new SpeechSynthesisUtterance("Enter Email");
              speakout.speak(speaking);
            }}
          />
        </div>
        {(touched.parentsemail && errors.parentsemail) && (
          <small>{errors.parentsemail}</small>
        )}
        <button
          type="button"
          className="signup__container__form__div__geolocationbtn"
          onClick={handleGetLocation}
          style={{ borderRadius: ".5rem" }}
        >
          <i className="bi bi-geo-alt-fill"></i>&nbsp;
          {
            showspinner ? 'Fetching Location ...': 'Click here to get Current Location'
          }
          &nbsp; &nbsp;
          {showspinner && <i className="fa fa-spinner fa-spin fa-2x"></i>}
        </button>

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-globe2 icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="country"
            name="country"
            onChange={handleInputChange}
            value={values.country}
            placeholder="Country"
          />
        </div>
        {(touched.country && errors.country) && <small>{errors.country}</small>}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-upc icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="pincode"
            name="pincode"
            onChange={handleInputChange}
            value={values.pincode}
            placeholder="Pincode"
          />
        </div>
        {(touched.pincode && errors.pincode) && <small>{errors.pincode}</small>}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-pin-map icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="state"
            name="state"
            onChange={handleInputChange}
            value={values.state}
            placeholder="State"
          />
        </div>
        {(touched.state && errors.state) && <small>{errors.state}</small>}
        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-buildings-fill icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="city"
            name="city"
            onChange={handleInputChange}
            value={values.city}
            placeholder="City"
          />
        </div>
        {(touched.city && errors.city) && <small>{errors.city}</small>}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-geo-fill icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="district"
            name="district"
            onChange={handleInputChange}
            value={values.district}
            placeholder="District"
          />
        </div>
        {(touched.district && errors.district) && <small>{errors.district}</small>}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-geo-alt-fill icon"></i>
          <textarea
            className="signup__container__form__div__form__sec__input-container__input-field"
            name="address"
            id="address"
            onChange={handleInputChange}
            value={values.address}
            placeholder="Address"
            required
          />
        </div>
        {(touched.address && errors.address) && <small>{errors.address}</small>}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-journal-text icon"></i>
          <select
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="mothertongue"
            name="mothertongue"
            onChange={handleInputChange}
            value={values.mothertongue}
            placeholder="Mother Tongue"
            required
          >
            <option value="none">Mother Tongue</option>
            <option value="telugu">Telugu</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
        {(touched.mothertongue && errors.mothertongue) && <small>{errors.mothertongue}</small>}
      </article>

      <article className="signup__container__form__div__form__buttons">
        <button
            className="signupform-btn"
            type="button"
            onClick={handlePrevious}
          >
            <span className="transition"></span>
            <span className="gradient"></span>
            <span className="label"> Previous</span>
          </button>

        <button
            className="signupform-btn"
            type="button"
            disabled={!isStepThreeEntered}
            onClick={handleNextClick}
          >
            <span className="transition"></span>
            <span className="gradient"></span>
            <span className="label"> Next</span>
          </button>
      </article>
    </>
  );
};

export default StepThree;
