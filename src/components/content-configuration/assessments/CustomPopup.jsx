import React from "react";

function CustomPopup({ message, confirmText, cancelText, onConfirm, onCancel }) {
  return (
    <div className="custom-popup">
      <div className="popup-content">
        <p>{message}</p>
        <div className="popup-buttons">
          <button onClick={onConfirm}>{confirmText}</button>
          <button onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}

export default CustomPopup;
