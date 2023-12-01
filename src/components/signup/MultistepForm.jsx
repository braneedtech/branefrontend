import React, { useState, useEffect } from "react";
import axios from 'axios';
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from './StepFour'
import "./signup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Carousel from "./3dcarousel";
import branelogo from "../../assets/brane-white.svg";
import swirlblue from "../../assets/swril-white.svg";
import TermsAndConditions from "./TermsAndConditions";
import { end_point } from "../../constants/urls";



const MultistepForm = () => {
  // const [signupData, setSignupData] = useState([]);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [showTerms, setShowTerms] = useState(true);  // State to control whether to show Terms and Conditions


  const [initialValues, setInitialValues] = useState({
    parentsmobileno: "",
    parentsmobileotp: "",
    parentspassword: "",
    parentsconfirmpassword: "",
    parentsname: "",
    parentssurname: "",
    parentsalternateno: "",
    parentsalternateotp: "",
    parentsemail: "",
    country: "",
    pincode: "",
    state: "",
    city: "",
    district: "",
    address: "",
    mothertongue: "",
    child: [
      {
        childname: "",
        childsurname: "",
        childdob: "",
        childgender: "",
        childnationality: "",
        childclass: "",
        childsyllabus: "",
        childschool: "",
        mediumofinstruction: "",
        firstlanguage: "",
        secondlanguage: "",
        thirdlanguage: "",
        childpassword: "",
        childconfirmpassword: "",
        childimageurl: "",
        childaudiourl: "",
      },
    ],
  });

  const setFieldValueCustom = (fieldName, fieldValue) => {
    setInitialValues((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue,
    }));
  };

  const handleKeyPress = (e) => {
    const digitPattern = /^[0-9]*$/;
    const key = String.fromCharCode(e.which);

    if (!digitPattern.test(key)) {
      e.preventDefault();
    }
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    setCurrentStep(1);  // After accepting terms, move to Step One
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleSubmit = async (e, childData) => {
    e.preventDefault()
    try {
      const combinedData = {
        ...initialValues,
        child: childData,
      };

      for (const field in combinedData) {
        setFieldValueCustom(field, combinedData[field]);
      }
      const response_signup = await axios.post(`${end_point}/signup_details`, { data: combinedData });
      navigate(`/subscription/${combinedData.parentsmobileno}`);
      setInitialValues({
        parentsmobileno: "",
        parentsmobileotp: "",
        parentspassword: "",
        parentsconfirmpassword: "",
        parentsname: "",
        parentssurname: "",
        parentsalternateno: "",
        parentsalternateotp: "",
        parentsemail: "",
        country: "",
        pincode: "",
        state: "",
        city: "",
        district: "",
        address: "",
        mothertongue: "",
        child: [
          {
            childname: "",
            childsurname: "",
            childdob: "",
            childgender: "",
            childnationality: "",
            childclass: "",
            childsyllabus: "",
            childschool: "",
            mediumofinstruction: "",
            firstlanguage: "",
            secondlanguage: "",
            thirdlanguage: "",
            childpassword: "",
            childconfirmpassword: "",
            childimageurl: "",
            childaudiourl: "",
          },
        ],
      });


    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    <section className="signup">
      <section className="signup__branelogo">
        <Link to="/">
          <img src={branelogo} alt="logo" />
        </Link>
      </section>
      <div className="signup__background">
        <img src={swirlblue} className="swirlbackground"></img>
      </div>




      {showTerms && (
        <TermsAndConditions onClose={() => setShowTerms(false)} onAccept={handleAcceptTerms} />
      )}



      {
        !showTerms && (
          <section className="signup__container">
            <article className="signup__container__form">
              <article className="signup__container__form__div">
                <article className="signup__container__form__div__steps">
                  <article className="signup__container__form__animation">
                    <div className="progress-container">
                      <ul>
                        {Array.from({ length: totalSteps }).map((_, index) => (
                          <li key={index} style={{ left: `${((index - 0.2) / (totalSteps - 1)) * 99}%`, background: index < currentStep - 1 ? "#2ce36a" : "#35008b", }}>{index + 1}</li>
                        ))}
                      </ul>

                      <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </article>
                </article>

                <form className="signup__container__form__div__form"
                // onSubmit={handleSubmit}
                >
                  {currentStep === 1 && (
                    <StepOne
                      handleNext={handleNext}
                      setFieldValue={setFieldValueCustom}
                      values={initialValues}
                      handleKeyPress={handleKeyPress}
                    />
                  )}

                  {currentStep === 2 && (
                    <StepTwo
                      handlePrevious={handlePrevious}
                      handleNext={handleNext}
                      setFieldValue={setFieldValueCustom}
                      values={initialValues}
                      handleKeyPress={handleKeyPress}
                    />
                  )}
                  {currentStep === 3 && (
                    <StepThree
                      setFieldValue={setFieldValueCustom}
                      values={initialValues}
                      handleNext={handleNext}
                      handlePrevious={handlePrevious}
                    />
                  )}

                  {currentStep === 4 && (
                    <StepFour
                      handlePrevious={handlePrevious}
                      handleSubmit={handleSubmit}
                      parentsPassword={initialValues.parentspassword}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                      handleKeyPress={handleKeyPress}
                    // StepFourData = {signupData[1]?.StepFourData}
                    />
                  )}
                </form>
                <div className="haveanaccount">Already Have An Account? <Link to='/login'>Sign In</Link></div>
              </article>
            </article>

          </section>
        )
      }

      <p className="FooterCopyright">© 2023 Brane Cognitives Pte. Ltd. All Rights Reserved.</p>
    </section>
  );
};

export default MultistepForm;
