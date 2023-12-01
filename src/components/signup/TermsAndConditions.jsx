// Your JSX component (TermsAndConditions.js)

import React, { useState } from 'react';
import "./signup.css";
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = ({ onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate()

  const handleAccept = () => {
    setAccepted(true);
    onAccept();  // Call the onAccept function passed as a prop
  };

  const handleDecline = () => {
    // Handle decline logic if needed
    navigate("/")
    onClose(); // Close the component in this example
  };

  return (
    <div className={`terms-and-conditions ${accepted ? 'hidden' : ''}`}>
      <div className="popup-header">
        <h2>Terms and Conditions</h2>
      </div>
      <div className="popup-content" style={{ overflowY: "auto" }}>
        <p>
          Welcome to [Your Education Platform]! By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <p>
          1. <strong>Acceptance of Terms:</strong> By using our services, you agree to these terms, our privacy policy, and any additional terms provided within the platform.
        </p>
        <p>
          2. <strong>User Responsibilities:</strong> Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </p>
        <p>
          3. <strong>Privacy:</strong> We respect your privacy. Please review our <a href="/privacy">Privacy Policy</a> to understand how we collect, use, and disclose information.
        </p>

      </div>
      <div className="buttons-container">
        <button className="accept-button" onClick={handleAccept}>Accept</button>
        <button className="decline-button" onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
