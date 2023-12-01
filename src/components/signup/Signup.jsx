// import { useState } from "react";
// import {StepOne, StepOneSchema} from "./StepOne";
// import "./Signup.css";
// import { Formik, Form } from "formik";
// // import StepOneSchema from "../../validation-schema/SignUpSchema";
// const Signup = () => {
//     const [currentStep, setCurrentStep] = useState(1);
//     const totalSteps = 4;

//     const initialValues = {
//         parentsmobileno: "",
//         parentspassword: "",
//         parentsconfirmpassword: "",
//         parentsname: "",
//         parentssurname: "",
//         parentsalternateno: "",
//         parentsemail: "",
//         country: "",
//         pincode: "",
//         state: "",
//         city: "",
//         district: "",
//         address: "",
//         mothertongue: "",
//         child: [
//             {
//                 childname: "",
//                 childsurname: "",
//                 childdob: "",
//                 childgender: "",
//                 childnationality: "",
//                 childclass: "",
//                 childsyllabus: "",
//                 childschool: "",
//                 mediumofinstruction: "",
//                 firstlanguage: "",
//                 secondlanguage: "",
//                 thirdlanguage: "",
//                 childpassword: "",
//                 childconfirmpassword: "",
//                 childimageurl: "",
//             },
//         ],
//     };
//     const handleSubmit = () => {
//         console.log("data")
//     }
//     return (
//         <>
//             <div className="signup">
//                 <div className="signup__container">
//                     <div className="signup__container__form">
//                         <div className="signup__container__form__logo">
//                             <div className="signup__container__form__div">

//                                 <Formik
//                                     initialValues={initialValues}
//                                     validationSchema={
//                                         currentStep === 1
//                                             ? StepOneSchema : ""
//                                     }
//                                     onSubmit={handleSubmit}
//                                 >
//                                     {({ values, errors, touched }) => (
//                                         <Form className="signup__container__form__div__form">
//                                             {currentStep === 1 && (
//                                                 <StepOne
//                                                     // handleNext={handleNext}
//                                                     // isValid={isValid}
//                                                     // setFieldValue={setFieldValue}
//                                                     values={values}
//                                                     errors={errors}
//                                                     touched={touched}
//                                                     // handleKeyPress={handleKeyPress}
//                                                 />
//                                             )}

//                                             {/* {currentStep === 2 && (
//                     <StepTwo
//                       handleNext={handleNext}
//                       isValid={isValid}
//                       setFieldValue={setFieldValue}
//                       errors={errors}
//                       touched={touched}
//                       handleKeyPress={handleKeyPress}
//                     />
//                   )}
//                   {currentStep === 3 && (
//                     <StepThree
//                       handlePrevious={handlePrevious}
//                       handleNext={handleNext}
//                       isValid={isValid}
//                       setFieldValue={setFieldValue}
//                       values={values}
//                       errors={errors}
//                       touched={touched}
//                       handleKeyPress={handleKeyPress}
//                       StepThreeData = {signupData[0]?.StepThreeData}
//                     />
//                   )}

//                   {currentStep === 4 && (
//                     <StepFour
//                       handlePrevious={handlePrevious}
//                       handleSubmit={handleSubmit}
//                       isValid={isValid}
//                       setFieldValue={setFieldValue}
//                       values={values}
//                       errors={errors}
//                       resetForm={resetForm}
//                       touched={touched}
//                       StepFourData = {signupData[1]?.StepFourData}
//                     />
//                   )} */}
//                                         </Form>
//                                     )}
//                                 </Formik>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default Signup;
import React from 'react'

const Signup = () => {
  return (
    <div>
      
    </div>
  )
}

export default Signup
