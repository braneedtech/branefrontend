import React, { useState } from "react";
import TakeImage from "./TakeImage";
import AudioRecorder from "./AudioRecorder";

const StepFour = ({
  handlePrevious,
  handleSubmit,
  parentsPassword,
  initialValues,
  setInitialValues,
  handleKeyPress,
}) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const initialChildData = {
    childname: "",
    childsurname: "",
    childdob: "",
    childgender: "",
    childnationality: "",
    childclass: "None",
    childsyllabus: "None",
    mediumofinstruction: "None",
    firstlanguage: "None",
    secondlanguage: "None",
    thirdlanguage: "None",
    childpassword: "",
    childconfirmpassword: "",
    childimageurl: "",
    childaudiourl: "",
  };
  const [values, setValues] = useState(initialValues);
  const [audioBlob, setAudioBlob] = useState(null);
  const handleAudioBlob = (audioBlob) => {
    setAudioBlob(audioBlob);
  };
  const validateForm = () => {
    const isValid = !hasErrors();
    setIsFormValid(isValid);
  };
  const [touched, setTouched] = useState({ child: [{}] }); // Initialize touched state for child fields

  const [showPassword, setShowPassword] = useState([false]);
  const [showConfirmPassword, setShowConfirmPassword] = useState([false]);

  const speakout = window.speechSynthesis;

  const handleChange = (index, fieldName, fieldValue) => {
    const updatedChild = [...values.child];
    updatedChild[index][fieldName] = fieldValue;
    setValues((prevValues) => ({
      ...prevValues,
      child: updatedChild,
    }));

    if (fieldName === "childimageurl") {
      const updatedInitialValues = { ...initialValues };
      updatedInitialValues.child[index].childimageurl = fieldValue;
      setInitialValues(updatedInitialValues);
    }

    if (fieldName === "childaudiourl") {
      const updatedInitialValues = { ...initialValues };
      updatedInitialValues.child[index].childaudiourl = fieldValue;
      setInitialValues(updatedInitialValues);
    }

    setTouched((prevTouched) => {
      const updatedTouched = [...prevTouched.child];
      updatedTouched[index] = { ...updatedTouched[index], [fieldName]: true };
      return {
        ...prevTouched,
        child: updatedTouched,
      };
    });
    validateForm();
  };
  const calculateAge = (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  };
  const getRequiredAgeForClass = (selectedClass) => {
    switch (selectedClass) {
      case "classI":
        return { min: 4, max: 8 };
      case "classII":
        return { min: 5, max: 9 };
      case "classIII":
        return { min: 6, max: 10 };
      case "classIV":
        return { min: 7, max: 11 };
      case "classV":
        return { min: 8, max: 12 };
      case "classVI":
        return { min: 9, max: 13 };
      case "classVII":
        return { min: 10, max: 14 };
      case "classVIII":
        return { min: 11, max: 15 };
      case "classIX":
        return { min: 12, max: 16 };
      case "classX":
        return { min: 13, max: 17 };
      default:
        return 0;
    }
  };

  const togglePasswordVisibility = (field, index) => {
    if (field === "childpassword") {
      const updatedShowPassword = [...showPassword];
      updatedShowPassword[index] = !updatedShowPassword[index];
      setShowPassword(updatedShowPassword);
    } else if (field === "childconfirmpassword") {
      const updatedShowConfirmPassword = [...showConfirmPassword];
      updatedShowConfirmPassword[index] = !updatedShowConfirmPassword[index];
      setShowConfirmPassword(updatedShowConfirmPassword);
    }
  };

  const handleAddChild = () => {
    if (values.child.length < 5) {
      // Limit the number of children to 5 or your desired maximum
      const updatedChild = [...values.child, { ...initialChildData }];
      setShowPassword([...showPassword, false]);
      setShowConfirmPassword([...showConfirmPassword, false]);
      setValues({ ...values, child: updatedChild });
      setTouched((prevTouched) => ({
        ...prevTouched,
        child: [...prevTouched.child, {}],
      }));
    }
  };

  const handleRemoveChild = (index) => {
    if (values.child.length === 1) {
      return;
    }

    const updatedChild = [...values.child];
    updatedChild.splice(index, 1);

    const updatedInitialValues = [...initialValues.child];
    updatedInitialValues.splice(index, 1); // Remove the corresponding child from initialValues

    const updatedShowPassword = [...showPassword];
    updatedShowPassword.splice(index, 1);
    const updatedShowConfirmPassword = [...showConfirmPassword];
    updatedShowConfirmPassword.splice(index, 1);
    setValues({ ...values, child: updatedChild });
    setInitialValues({ ...initialValues, child: updatedInitialValues }); // Update initialValues
    setShowPassword(updatedShowPassword);
    setShowConfirmPassword(updatedShowConfirmPassword);

    setTouched((prevTouched) => {
      const updatedTouched = [...prevTouched.child];
      updatedTouched.splice(index, 1);
      return {
        ...prevTouched,
        child: updatedTouched,
      };
    });
  };

  const validateField = (index, fieldName, fieldValue) => {
    let error = null;
    switch (fieldName) {
      case "childname":
        error = fieldValue ? "" : "Child's name is required";
        break;
      case "childsurname":
        error = fieldValue ? "" : "Child's surname is required";
        break;
      case "childdob":
        const age = calculateAge(fieldValue);
        const { min, max } = getRequiredAgeForClass(
          values.child[index].childclass
        );

        if (age < min || age > max) {
          // Show alert only if it hasn't been shown yet
          if (!alertShown) {
            alert(
              `Child must be between ${min} and ${max} years old for the selected class`
            );
            setAlertShown(true); // Set the flag to true after showing the alert
          }
        }
        error = ""; // Set error to an empty string to prevent displaying an error message
        break;
      case "childgender":
        error =
          fieldValue && fieldValue !== "None"
            ? ""
            : "Child's gender is required";
        break;
      // case "childnationality":
      //   error = fieldValue ? "" : "Child's nationality is required";
      //   break;
      case "childclass":
        error =
          fieldValue && fieldValue !== "None" ? "" : "Please select a class";
        break;
      case "childsyllabus":
        error =
          fieldValue && fieldValue !== "None" ? "" : "Please select a syllabus";
        break;
      case "mediumofinstruction":
        error =
          fieldValue && fieldValue !== "None"
            ? ""
            : "Please select a medium of instruction";
        break;
      case "firstlanguage":
        error =
          fieldValue && fieldValue !== "None"
            ? ""
            : "Please select First Language";
        break;
      case "secondlanguage":
        error =
          fieldValue && fieldValue !== "None"
            ? ""
            : "Please select Second Language";
        break;
      case "thirdlanguage":
        error =
          fieldValue && fieldValue !== "None"
            ? ""
            : "Please select Third Language";
        break;
      case "childpassword":
        error = fieldValue
          ? /^\d{4}$/.test(fieldValue)
            ? ""
            : "Password must be a 4-digit pin"
          : "Required";
        break;
      case "childconfirmpassword":
        error = fieldValue
          ? /^\d{4}$/.test(fieldValue)
            ? fieldValue === values.child[index].childpassword
              ? ""
              : "Passwords do not match"
            : "Password must be a 4-digit pin"
          : "Required";
        break;
      default:
        error = null;
    }
    return error;
  };

  const validateChild = (childData, index) => {
    const errors = {};
    for (const fieldName in childData) {
      if (childData.hasOwnProperty(fieldName)) {
        const fieldValue = childData[fieldName];
        const error = validateField(index, fieldName, fieldValue);
        if (error) {
          errors[fieldName] = error;
        }
      }
    }
    return errors;
  };

  const [passwordErrors, setPasswordErrors] = useState([]);
  const validatePasswords = () => {
    const childPasswords = values.child.map((child) => child.childpassword);
    const parentPassword = parentsPassword;
    const errors = [];

    // Check if any child password matches the parent's password
    if (childPasswords.includes(parentPassword)) {
      errors.push("Password should not match with parents password");
    }

    for (let index = 0; index < childPasswords.length; index++) {
      const childPassword = childPasswords[index];

      // Check if the child password matches with other child passwords
      for (let i = index + 1; i < childPasswords.length; i++) {
        if (childPassword === childPasswords[i]) {
          errors.push("Password should not match with other child passwords");
          break; // No need to continue checking for this password
        }
      }
    }

    setPasswordErrors(errors);

    return errors.length > 0;
  };

  const handleBlur = (index, fieldName) => {
    // Mark the field as touched when it's blurred
    setTouched((prevTouched) => {
      const updatedTouched = [...prevTouched.child];
      updatedTouched[index] = { ...updatedTouched[index], [fieldName]: true };
      return {
        ...prevTouched,
        child: updatedTouched,
      };
    });
  };

  const hasErrors = () => {
    const childErrors = values.child.map((childData, index) => {
      const errors = validateChild(childData, index);
      return Object.keys(errors).length > 0;
    });

    const passwordErrors = validatePasswords(); // Check for password errors

    return childErrors.some((hasError) => hasError) || passwordErrors;
  };

  const customHandleSubmit = (e) => {
    const childData = values.child;
    e.preventDefault();
    if (!hasErrors() && !validatePasswords()) {
      handleSubmit(e, values.child);
      const speaking = new SpeechSynthesisUtterance("Signup Successful");
      speakout.speak(speaking);
    }
  };

  return (
    <>
      {/* <div className="signup__container__form__div__form__heading">Child Details</div> */}
      {values.child.map((childData, index) => (
        <article
          className="signup__container__form__div__form__sec__main"
          title={`Child ${index + 1} Details`}
          key={index}
        >
          <article className="signup__container__form__div__form__sec__title">
            <div>{`Child ${index + 1} Details`}</div>
            <div>
              {values.child.length > 1 && (
                <button type="button" onClick={() => handleRemoveChild(index)}>
                  Remove child
                </button>
              )}
            </div>
          </article>
          <article
            className="signup__container__form__div__form__sec"
            style={{ maxHeight: "15rem" }}
          >
            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-person-fill icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field"
                placeholder="Name"
                name={`child[${index}].childname`}
                type="text"
                value={childData.childname || ""}
                onChange={(e) =>
                  handleChange(index, "childname", e.target.value)
                }
                onBlur={() => handleBlur(index, "childname")}
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance("Child Name");
                  speakout.speak(speaking);
                }}
              />
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childname"] && (
                <small>
                  {validateField(index, "childname", childData.childname)}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-person-fill icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field"
                placeholder="Surname"
                name={`child[${index}].childsurname`}
                type="text"
                value={childData.childsurname || ""}
                onChange={(e) =>
                  handleChange(index, "childsurname", e.target.value)
                }
                onBlur={() => handleBlur(index, "childsurname")}
              />
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childsurname"] && (
                <small>
                  {validateField(index, "childsurname", childData.childsurname)}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              {/* <i className="bi bi-calendar-event-fill icon"></i>   */}
              <input
                className="signup__container__form__div__form__sec__input-container__dobinput-field"
                placeholder="Date of Birth (dd/mm/yyyy)"
                name={`child[${index}].childdob`}
                type="date"
                value={childData.childdob || ""}
                onChange={(e) =>
                  handleChange(index, "childdob", e.target.value)
                }
                onBlur={() => handleBlur(index, "childdob")}
              />
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childdob"] && (
                <small>
                  {validateField(index, "childdob", childData.childdob)}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-people-fill icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].childgender`}
                onChange={(e) =>
                  handleChange(index, "childgender", e.target.value)
                }
                onBlur={() => handleBlur(index, "childgender")}
                required
              >
                <option value="None">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childgender"] && (
                <small>
                  {validateField(index, "childgender", childData.childgender)}
                </small>
              )}

            {/* <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-globe2 icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field"
                placeholder="Nationality"
                name={`child[${index}].childnationality`}
                type="text"
                value={childData.childnationality || ""}
                onChange={(e) =>
                  handleChange(index, "childnationality", e.target.value)
                }
                onBlur={() => handleBlur(index, "childnationality")}
              />
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childnationality"] && (
                <small>
                  {validateField(
                    index,
                    "childnationality",
                    childData.childnationality
                  )}
                </small>
              )} */}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-book-half icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].childclass`}
                onChange={(e) =>
                  handleChange(index, "childclass", e.target.value)
                }
                onBlur={() => handleBlur(index, "childclass")}
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance("Select Class");
                  speakout.speak(speaking);
                }}
                required
              >
                <option value="None">Select Class</option>
                <option value="classI">classI</option>
                <option value="classII">classII</option>
                <option value="classIII">classIII</option>
                <option value="classIV">classIV</option>
                <option value="classV">classV</option>
                <option value="classVI">classVI</option>
                <option value="classVII">classVII</option>
                <option value="classVIII">classVIII</option>
                <option value="classIX">classIX</option>
                <option value="classX">classX</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childclass"] && (
                <small>
                  {validateField(index, "childclass", childData.childclass)}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-journal-bookmark-fill icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].childsyllabus`}
                onChange={(e) =>
                  handleChange(index, "childsyllabus", e.target.value)
                }
                onBlur={() => handleBlur(index, "childsyllabus")}
                required
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance(
                    "Select Syllabus"
                  );
                  speakout.speak(speaking);
                }}
              >
                <option value="None">Select Syllabus</option>
                <option value="cbse">CBSE</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childsyllabus"] && (
                <small>
                  {validateField(
                    index,
                    "childsyllabus",
                    childData.childsyllabus
                  )}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-building icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field"
                placeholder="School/College Name (Optional)"
                name={`child[${index}].childschool`}
                type="text"
                value={childData.childschool || ""}
                onChange={(e) =>
                  handleChange(index, "childschool", e.target.value)
                }
                onBlur={() => handleBlur(index, "childschool")}
              />
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childschool"] && (
                <small>
                  {validateField(index, "childschool", childData.childschool)}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-book-fill icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].mediumofinstruction`}
                onChange={(e) =>
                  handleChange(index, "mediumofinstruction", e.target.value)
                }
                onBlur={() => handleBlur(index, "mediumofinstruction")}
                required
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance(
                    "Select Medium"
                  );
                  speakout.speak(speaking);
                }}
              >
                <option value="None">Medium Of Instruction</option>
                <option value="english">English</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["mediumofinstruction"] && (
                <small>
                  {validateField(
                    index,
                    "mediumofinstruction",
                    childData.mediumofinstruction
                  )}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-journal-text icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].firstlanguage`}
                onChange={(e) =>
                  handleChange(index, "firstlanguage", e.target.value)
                }
                onBlur={() => handleBlur(index, "firstlanguage")}
                required
              >
                <option value="None">First Language</option>
                <option value="telugu">Telugu</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["firstlanguage"] && (
                <small>
                  {validateField(
                    index,
                    "firstlanguage",
                    childData.firstlanguage
                  )}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-journal-text icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].secondlanguage`}
                onChange={(e) =>
                  handleChange(index, "secondlanguage", e.target.value)
                }
                onBlur={() => handleBlur(index, "secondlanguage")}
                required
              >
                <option value="None">Second Language</option>
                <option value="telugu">Telugu</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["secondlanguage"] && (
                <small>
                  {validateField(
                    index,
                    "secondlanguage",
                    childData.secondlanguage
                  )}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-journal-text icon"></i>
              <select
                className="signup__container__form__div__form__sec__input-container__input-field"
                name={`child[${index}].thirdlanguage`}
                onChange={(e) =>
                  handleChange(index, "thirdlanguage", e.target.value)
                }
                onBlur={() => handleBlur(index, "thirdlanguage")}
                required
              >
                <option value="None">Third Language</option>
                <option value="telugu">Telugu</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["thirdlanguage"] && (
                <small>
                  {validateField(
                    index,
                    "thirdlanguage",
                    childData.thirdlanguage
                  )}
                </small>
              )}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-key icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field-password"
                placeholder="Child Account PIN"
                name={`child[${index}].childpassword`}
                type={showPassword[index] ? "text" : "password"} // Use the showPassword state to toggle visibility
                maxLength={4}
                value={childData.childpassword || ""}
                onChange={(e) =>
                  handleChange(index, "childpassword", e.target.value)
                }
                onBlur={() => handleBlur(index, "childpassword")}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance("Child PIN");
                  speakout.speak(speaking);
                }}
              />
              <i
                className={`bi bi-eye${
                  showPassword[index] ? "-slash" : ""
                } password-icon`}
                onClick={() => togglePasswordVisibility("childpassword", index)}
              ></i>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childpassword"] && (
                <small>
                  {validateField(
                    index,
                    "childpassword",
                    childData.childpassword
                  )}
                </small>
              )}
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childpassword"] &&
              passwordErrors.map((error, index) => (
                <small key={index} className="error-pmessage">
                  {error}
                </small>
              ))}

            <div className="signup__container__form__div__form__sec__input-container">
              <i className="bi bi-key icon"></i>
              <input
                className="signup__container__form__div__form__sec__input-container__input-field-password"
                placeholder="Re-enter PIN"
                name={`child[${index}].childconfirmpassword`}
                type={showConfirmPassword[index] ? "text" : "password"} // Use the showConfirmPassword state to toggle visibility
                maxLength={4}
                value={childData.childconfirmpassword || ""}
                onChange={(e) =>
                  handleChange(index, "childconfirmpassword", e.target.value)
                }
                onBlur={() => handleBlur(index, "childconfirmpassword")}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  const speaking = new SpeechSynthesisUtterance(
                    "Reenter Child PIN"
                  );
                  speakout.speak(speaking);
                }}
              />
              <i
                className={`bi bi-eye${
                  showConfirmPassword[index] ? "-slash" : ""
                } password-icon`}
                onClick={() =>
                  togglePasswordVisibility("childconfirmpassword", index)
                }
              ></i>
            </div>
            {touched.child &&
              touched.child[index] &&
              touched.child[index]["childconfirmpassword"] && (
                <small>
                  {validateField(
                    index,
                    "childconfirmpassword",
                    childData.childconfirmpassword
                  )}
                </small>
              )}
            <TakeImage
              mobileno={initialValues?.parentsmobileno}
              childno={index + 1}
              handleChange={handleChange}
            />
            <AudioRecorder
              mobileno={initialValues?.parentsmobileno}
              childno={index + 1}
              handleChange={handleChange}
              onAudioBlobChange={handleAudioBlob}
            />
          </article>
        </article>
      ))}
      {/* {values.child.length === 1 && (
        <p style={{ fontSize: ".8rem" }}>
          At least one child form is required.
        </p>
      )} */}
      {values.child.length < 5 && (
        <button
          style={{
            background: "#007DFA",
            marginBottom: ".4375rem",
            marginTop: ".5rem",
          }}
          className="signup__container__form__div__button"
          type="button"
          onClick={handleAddChild}
        >
          Add Child
        </button>
      )}
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
          onClick={customHandleSubmit}
          disabled={!isFormValid}
        >
          <span className="transition"></span>
          <span className="gradient"></span>
          <span className="label"> Submit</span>
        </button>
      </article>
    </>
  );
};

export default StepFour;
