import React, { useState } from 'react';

const Dashboard = () => {
  // State to manage selected values for each dropdown
  const [firstDropdown, setFirstDropdown] = useState('');
  const [secondDropdown, setSecondDropdown] = useState('');
  const [thirdDropdown, setThirdDropdown] = useState('');

  // Sample data for dropdown options
  const options = {
    firstOptions: ['Option 1A', 'Option 1B', 'Option 1C'],
    secondOptions: {
      'Option 1A': ['Option 2A1', 'Option 2A2', 'Option 2A3'],
      'Option 1B': ['Option 2B1', 'Option 2B2', 'Option 2B3'],
      'Option 1C': ['Option 2C1', 'Option 2C2', 'Option 2C3'],
    },
    thirdOptions: {
      'Option 2A1': ['Detail 1A1', 'Detail 1A2', 'Detail 1A3'],
      'Option 2A2': ['Detail 1A4', 'Detail 1A5', 'Detail 1A6'],
      'Option 2B1': ['Detail 1B1', 'Detail 1B2', 'Detail 1B3'],
      // ... add more details as needed
    },
  };

  const handleFirstDropdownChange = (value) => {
    setFirstDropdown(value);
    setSecondDropdown('');
    setThirdDropdown('');
  };

  const handleSecondDropdownChange = (value) => {
    setSecondDropdown(value);
    setThirdDropdown('');
  };

  const handleThirdDropdownChange = (value) => {
    setThirdDropdown(value);
  };

  return (
    <div>
      <label>First Dropdown:</label>
      <select onChange={(e) => handleFirstDropdownChange(e.target.value)} value={firstDropdown}>
        <option value="">Select</option>
        {options.firstOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {firstDropdown && (
        <div>
          <label>Second Dropdown:</label>
          <select onChange={(e) => handleSecondDropdownChange(e.target.value)} value={secondDropdown}>
            <option value="">Select</option>
            {options.secondOptions[firstDropdown].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {secondDropdown && (
        <div>
          <label>Third Dropdown:</label>
          <select onChange={(e) => handleThirdDropdownChange(e.target.value)} value={thirdDropdown}>
            <option value="">Select</option>
            {options.thirdOptions[secondDropdown].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {thirdDropdown && (
        <div>
          <h3>Details:</h3>
          <p>{options.thirdOptions[secondDropdown][thirdDropdown]}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
