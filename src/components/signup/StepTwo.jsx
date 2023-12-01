import React, { useState,useRef } from "react";

const StepTwo = ({ values, setFieldValue, handleNext, handlePrevious }) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const confirmPasswordRef = useRef(null); // Ref for the confirm password input
  const isSecondStepEntered =
    values.parentspassword && values.parentsconfirmpassword;
  const speakout = window.speechSynthesis;

  const togglePasswordVisibility = (field) => {
    if (field === "parentspassword") {
      setShowPassword((prev) => !prev);
    } else if (field === "parentsconfirmpassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };
  const focusConfirmPassword = () => {
    confirmPasswordRef.current && confirmPasswordRef.current.focus();
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    if (!value) {
      newErrors[fieldName] = `Password is required`;
    } else {
      delete newErrors[fieldName];
    }

    if (fieldName === "parentsconfirmpassword") {
      if (value !== values.parentspassword) {
        newErrors.parentsconfirmpassword = "Passwords do not match";
      } else {
        delete newErrors.parentsconfirmpassword;
      }
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    // Use a regular expression to allow only numeric values
    const numericValue = value.replace(/\D/g, "");

    setFieldValue(fieldName, numericValue);
    validateField(fieldName, numericValue);
  };

  const handleNextClick = () => {
    const newErrors = { ...errors };
    let hasErrors = false;

    Object.keys(newErrors).forEach((fieldName) => {
      if (newErrors[fieldName]) {
        hasErrors = true;
      }
    });

    if (!hasErrors && isSecondStepEntered) {
      handleNext();
      const speaking = new SpeechSynthesisUtterance("Enter Parent Details");
      speakout.speak(speaking);
    }
  };

  return (
    <>
      <div className="signup__container__form__div__form__heading">
        Parent Password
      </div>
      <div className="signup__container__form__div__form__sec step2container">
        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-key icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field-password"
            type={showPassword ? "text" : "password"}
            name="parentspassword"
            value={values.parentspassword}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                focusConfirmPassword();
              }
            }}
            placeholder="Set 4-Digit Parent Pin"
            maxLength={4}
            required
            onFocus={() => {
              const speaking = new SpeechSynthesisUtterance("Set 4 Digit PIN");
              speakout.speak(speaking);
            }}
          />
          <i
            className={`bi bi-eye${showPassword ? "-slash" : ""} password-icon`}
            onClick={() => togglePasswordVisibility("parentspassword")}
          ></i>
        </div>
        {errors.parentspassword && (
          <small className="error">{errors.parentspassword}</small>
        )}

        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-key icon"></i>
          <input
            ref={confirmPasswordRef} // Attach the ref here
            className="signup__container__form__div__form__sec__input-container__input-field-password"
            type={showConfirmPassword ? "text" : "password"}
            name="parentsconfirmpassword"
            value={values.parentsconfirmpassword}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleNextClick();
              }
            }}
            placeholder="Re-enter Pin"
            maxLength={4}
            required
            onFocus={() => {
              const speaking = new SpeechSynthesisUtterance("Re-enter PIN");
              speakout.speak(speaking);
            }}
          />

          <i
            className={`bi bi-eye${
              showConfirmPassword ? "-slash" : ""
            } password-icon`}
            onClick={() => togglePasswordVisibility("parentsconfirmpassword")}
          ></i>
        </div>
        {errors.parentsconfirmpassword && (
          <small className="error">{errors.parentsconfirmpassword}</small>
        )}
      </div>
      {/* <button
        className="signup__container__form__div__button"
        onClick={handleNextClick}
        disabled={
          !isSecondStepEntered ||
          Object.keys(errors).length > 0 ||
          values.parentspassword !== values.parentsconfirmpassword
        }
      >
        Next</button> */}
      <button
        className="signupform-btn"
        type="button"
        onClick={handleNextClick}
        disabled={
          !isSecondStepEntered ||
          Object.keys(errors).length > 0 ||
          values.parentspassword !== values.parentsconfirmpassword
        }
      >
        <span className="transition"></span>
        <span className="gradient"></span>
        <span className="label"> Next</span>
      </button>
    </>
  );
};

export default StepTwo;
