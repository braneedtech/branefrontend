import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import generateOtp from "../../services/otp_generation_service";

const StepOne = ({ handleNext, setFieldValue, values, handleKeyPress }) => {
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
  const [isOTPMatched, setIsOTPMatched] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [isMobileExists, setIsMobileExists] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Initial cooldown time in seconds
  const otpInputRef = useRef(null); // Create a ref for the OTP input field

  const speakout = window.speechSynthesis;

  const startResendCooldown = () => {
    setResendCooldown(50); // Set the cooldown time to 50 seconds
    const timer = setInterval(() => {
      setResendCooldown((prevCooldown) => {
        if (prevCooldown === 1) {
          clearInterval(timer);
          return 0; // Reset cooldown when it reaches 0
        }
        return prevCooldown - 1;
      });
    }, 1000);
  };

  const handleMobileNumberChange = async (e) => {
    const mobileNumber = e.target.value;
    setFieldValue("parentsmobileno", mobileNumber);

    if (!/^\d{10}$/.test(mobileNumber)) {
      setPhoneNumberError("Please enter a valid 10-digit mobile number.");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8080/mobileno_matching",
          { parentsmobileno: mobileNumber }
        );

        if (response.data && response.data.match) {
          setIsMobileExists(true);
          setPhoneNumberError("Mobile number already exists.");
          const speaking = new SpeechSynthesisUtterance("Mobile number already exists.");
          speakout.speak(speaking);
        } else {
          setIsMobileExists(false);
          setPhoneNumberError(""); // No error, mobile number is valid
          const resp = await generateOtp(mobileNumber);
          if (resp && resp.sent) {
            setGeneratedOTP(resp.otp.toString());
            startResendCooldown();
          } else {
            alert("Failed to generate OTP, Please Try Again!!");
          }
        }
      } catch (error) {
        console.error("Error checking mobile number:", error);
        alert("Failed to check mobile number, Please Try Again!!");
      }
    }
  };

  const handleOTPChange = (e) => {
    const otpNumber = e.target.value;
    setFieldValue("parentsmobileotp", otpNumber);
    if (otpNumber.length === 4) {
      if (otpNumber === generatedOTP) {
        setIsOTPMatched(true);
        handleNext("step1"); // Proceed to the next step automatically
        const speaking = new SpeechSynthesisUtterance("OTP Matched");
        speakout.speak(speaking);
      } else {
        setIsOTPMatched(false);
      }
    } else {
      setIsOTPMatched(false);
    }
  };

  const handleResendOTP = async () => {
    const mobileNumber = values.parentsmobileno;
    const resp = await generateOtp(mobileNumber);
    if (resp && resp.sent) {
      setGeneratedOTP(resp.otp.toString());
      startResendCooldown();
      const speaking = new SpeechSynthesisUtterance(
        "OTP has been sent Please check."
      );
      speakout.speak(speaking);
    } else {
      alert("Failed to generate OTP, Please Try Again!!");
      const speaking = new SpeechSynthesisUtterance(
        "Failed to generate OTP, Please Try Again!"
      );
      speakout.speak(speaking);
    }
    setIsFieldsDisabled(false);
    setIsOTPMatched(false);
  };

  useEffect(() => {
    return () => {
      setResendCooldown(0);
    };
  }, []);

  useEffect(() => {
    // Automatically focus the OTP input field when it becomes visible
    if (
      values.parentsmobileno.length === 10 &&
      !isMobileExists &&
      otpInputRef.current
    ) {
      otpInputRef.current.focus();
    }
  }, [values.parentsmobileno.length, isMobileExists]); // Depend on mobile number length and mobile existence status

  return (
    <>
      <div className="signup__container__form__div__form__heading">
        Get Started Now
      </div>
      <article className="signup__container__form__div__form__sec step1container">
        <div className="signup__container__form__div__form__sec__input-container">
          <i className="bi bi-telephone icon"></i>
          <input
            className="signup__container__form__div__form__sec__input-container__input-field"
            type="text"
            id="parentsmobileno"
            name="parentsmobileno"
            onChange={handleMobileNumberChange}
            placeholder="Mobile Number"
            onKeyPress={handleKeyPress}
            maxLength={10}
            onFocus={() => {
              const speaking = new SpeechSynthesisUtterance(
                "Enter Mobile Number"
              );
              speakout.speak(speaking);
            }}
          />
        </div>
        {phoneNumberError && <small>{phoneNumberError}</small>}

        {values.parentsmobileno.length === 10 && !isMobileExists && (
          <div className="signup__container__form__div__form__sec__input-container">
            <i className="bi bi-telephone icon"></i>
            <input
              ref={otpInputRef} // Attach the ref here
              className="signup__container__form__div__form__sec__input-container__input-field-password"
              type="numeric"
              id="parentsmobileotp"
              name="parentsmobileotp"
              onChange={handleOTPChange}
              onKeyPress={handleKeyPress}
              placeholder="OTP"
              pattern="/^[0-9]*$/"
              maxLength={4}
              onFocus={() => {
                const speaking = new SpeechSynthesisUtterance("Enter OTP");
                speakout.speak(speaking);
              }}
              disabled={isOTPMatched && values.parentsmobileno.length === 10}
            />
            {values.parentsmobileno.length === 10 &&
              values.parentsmobileotp.length === 4 &&
              (isOTPMatched ? (
                <i
                  className="fa fa-check-circle password-icon"
                  style={{ color: "green", fontSize: "1.75rem" }}
                ></i>
              ) : (
                <i
                  className="fa fa-times-circle password-icon"
                  style={{ color: "red", fontSize: "1.75rem" }}
                ></i>
              ))}
          </div>
        )}
        {values.parentsmobileno.length === 10 &&
          !isOTPMatched &&
          !isMobileExists && (
            <div className="signup__container__form__div__resendotp">
              <span>
                Didn't Recieve OTP?{" "}
                {resendCooldown > 0 && `(${resendCooldown} s)`}
              </span>
              <button
                className="signup__container__form__div__button"
                style={{ fontSize: "0.75rem", marginLeft: "0.5rem" }}
                type="button"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
              >
                Resend OTP
              </button>
            </div>
          )}
      </article>

      {/* <button
        className="signup__container__form__div__button"
        type="button"
        onClick={() => handleNext("step1")}

      >
        Next
      </button> */}
      <button
        className="signupform-btn"
        type="button"
        onClick={() => handleNext("step1")}
        disabled={!isOTPMatched}
      >
        <span className="transition"></span>
        <span className="gradient"></span>
        <span className="label"> Next</span>
      </button>
    </>
  );
};

export default StepOne;





// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import generateOtp from "../../services/otp_generation_service";

// const StepOne = ({ handleNext, setFieldValue, values, handleKeyPress }) => {
//   const [generatedOTP, setGeneratedOTP] = useState("");
//   const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
//   const [isOTPMatched, setIsOTPMatched] = useState(false);
//   const [phoneNumberError, setPhoneNumberError] = useState("");
//   const [isMobileExists, setIsMobileExists] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(0); // Initial cooldown time in seconds
//   const otpInputRef = useRef(null); // Create a ref for the OTP input field
//   const [otpSent, setOtpSent] = useState(false); // New state variable

//   const speakout = window.speechSynthesis;

//   const startResendCooldown = () => {
//     setResendCooldown(50); // Set the cooldown time to 50 seconds
//     const timer = setInterval(() => {
//       setResendCooldown((prevCooldown) => {
//         if (prevCooldown === 1) {
//           clearInterval(timer);
//           return 0; // Reset cooldown when it reaches 0
//         }
//         return prevCooldown - 1;
//       });
//     }, 1000);
//   };

//   const handleMobileNumberChange = async (e) => {
//     const mobileNumber = e.target.value;
//     setFieldValue("parentsmobileno", mobileNumber);

//     if (!/^\d{10}$/.test(mobileNumber)) {
//       setPhoneNumberError("Please enter a valid 10-digit mobile number.");
//     } else {
//       try {
//         const response = await axios.post(
//           "http://localhost:8080/mobileno_matching",
//           { parentsmobileno: mobileNumber }
//         );

//         if (response.data && response.data.match) {
//           setIsMobileExists(true);
//           setPhoneNumberError("Mobile number already exists.");
//         } else {
//           setIsMobileExists(false);
//           setPhoneNumberError(""); // No error, mobile number is valid
//           // const resp = await generateOtp(mobileNumber);
//           // if (resp && resp.sent) {
//           //   setGeneratedOTP(resp.otp.toString());
//           //   startResendCooldown();
//           // } else {
//           //   alert("Failed to generate OTP, Please Try Again!!");
//           // }
//           const resp = await generateOtp(mobileNumber);
//           if (resp && resp.sent) {
//             setGeneratedOTP(resp.otp.toString());
//             startResendCooldown();
//             setOtpSent(true); // OTP sent successfully
//           } else {
//             setOtpSent(false); // OTP sending failed
//           }
//         }
//       } catch (error) {
//         console.error("Error checking mobile number:", error);
//         alert("Failed to check mobile number, Please Try Again!!");
//       }
//     }
//   };

//   const handleOTPChange = (e) => {
//     const otpNumber = e.target.value;
//     setFieldValue("parentsmobileotp", otpNumber);
//     if (otpNumber.length === 4) {
//       if (otpNumber === generatedOTP) {
//         setIsOTPMatched(true);
//         handleNext("step1"); // Proceed to the next step automatically
//         const speaking = new SpeechSynthesisUtterance("OTP Matched");
//         speakout.speak(speaking);
//       } else {
//         setIsOTPMatched(false);
//       }
//     } else {
//       setIsOTPMatched(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     const mobileNumber = values.parentsmobileno;
//     // const resp = await generateOtp(mobileNumber);
//     // if (resp && resp.sent) {
//     //   setGeneratedOTP(resp.otp.toString());
//     //   startResendCooldown();
//     //   const speaking = new SpeechSynthesisUtterance(
//     //     "OTP has been sent Please check."
//     //   );
//     //   speakout.speak(speaking);
//     // } else {
//     //   alert("Failed to generate OTP, Please Try Again!!");
//     //   const speaking = new SpeechSynthesisUtterance(
//     //     "Failed to generate OTP, Please Try Again!"
//     //   );
//     //   speakout.speak(speaking);
//     // }
//     // setIsFieldsDisabled(false);
//     // setIsOTPMatched(false);
//     const resp = await generateOtp(mobileNumber);
//     if (resp && resp.sent) {
//       setGeneratedOTP(resp.otp.toString());
//       startResendCooldown();
//       setOtpSent(true); // OTP resent successfully
//     } else {
//       setOtpSent(false); // OTP resend failed
//     }
//   };

//   useEffect(() => {
//     return () => {
//       setResendCooldown(0);
//     };
//   }, []);

//   useEffect(() => {
//     // Automatically focus the OTP input field when it becomes visible
//     if (
//       values.parentsmobileno.length === 10 &&
//       !isMobileExists &&
//       otpInputRef.current
//     ) {
//       otpInputRef.current.focus();
//     }
//   }, [values.parentsmobileno.length, isMobileExists]); // Depend on mobile number length and mobile existence status

//   return (
//     <>
//       <div className="signup__container__form__div__form__heading">
//         Get Started Now
//       </div>
//       <article className="signup__container__form__div__form__sec step1container">
//         <div className="signup__container__form__div__form__sec__input-container">
//           <i className="bi bi-telephone icon"></i>
//           <input
//             className="signup__container__form__div__form__sec__input-container__input-field"
//             type="text"
//             id="parentsmobileno"
//             name="parentsmobileno"
//             onChange={handleMobileNumberChange}
//             placeholder="Mobile Number"
//             onKeyPress={handleKeyPress}
//             maxLength={10}
//             onFocus={() => {
//               const speaking = new SpeechSynthesisUtterance(
//                 "Enter Mobile Number"
//               );
//               speakout.speak(speaking);
//             }}
//           />
//         </div>
//         {phoneNumberError && <small>{phoneNumberError}</small>}

//         {values.parentsmobileno.length === 10 && !isMobileExists && otpSent && (
//           <div className="signup__container__form__div__form__sec__input-container">
//             <i className="bi bi-telephone icon"></i>
//             <input
//               ref={otpInputRef} // Attach the ref here
//               className="signup__container__form__div__form__sec__input-container__input-field-password"
//               type="numeric"
//               id="parentsmobileotp"
//               name="parentsmobileotp"
//               onChange={handleOTPChange}
//               onKeyPress={handleKeyPress}
//               placeholder="OTP"
//               pattern="/^[0-9]*$/"
//               maxLength={4}
//               onFocus={() => {
//                 const speaking = new SpeechSynthesisUtterance("Enter OTP");
//                 speakout.speak(speaking);
//               }}
//               disabled={isOTPMatched && values.parentsmobileno.length === 10}
//             />
//             {values.parentsmobileno.length === 10 &&
//               values.parentsmobileotp.length === 4 &&
//               (isOTPMatched ? (
//                 <i
//                   className="fa fa-check-circle password-icon"
//                   style={{ color: "green", fontSize: "1.75rem" }}
//                 ></i>
//               ) : (
//                 <i
//                   className="fa fa-times-circle password-icon"
//                   style={{ color: "red", fontSize: "1.75rem" }}
//                 ></i>
//               ))}
//           </div>
//         )}
//         {values.parentsmobileno.length === 10 &&
//           !isOTPMatched &&
//           !isMobileExists && (
//             <div className="signup__container__form__div__resendotp">
//               <span>
//                 Didn't Recieve OTP?{" "}
//                 {resendCooldown > 0 && `(${resendCooldown} s)`}
//               </span>
//               <button
//                 className="signup__container__form__div__button"
//                 style={{ fontSize: "0.75rem", marginLeft: "0.5rem" }}
//                 type="button"
//                 onClick={handleResendOTP}
//                 disabled={resendCooldown > 0}
//               >
//                 Resend OTP
//               </button>
//             </div>
//           )}
//       </article>

//       {/* <button
//         className="signup__container__form__div__button"
//         type="button"
//         onClick={() => handleNext("step1")}

//       >
//         Next
//       </button> */}
//       <button
//         className="signupform-btn"
//         type="button"
//         onClick={() => handleNext("step1")}
//         disabled={!isOTPMatched}
//       >
//         <span className="transition"></span>
//         <span className="gradient"></span>
//         <span className="label"> Next</span>
//       </button>
//     </>
//   );
// };

// export default StepOne;
