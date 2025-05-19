import React, { useState } from 'react';
import './Request.css';

const TradeLicense = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Business registration documents",
    "NOC from the landlord (if rented premises)",
    "CNIC of the business owner",
    "Proof of ownership or rental agreement",
    "Taxpayer identification or proof of tax registration",
    "Written application for the license",
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle file upload
    console.log('File uploaded:', file);
  };

  return (
    <div className="request-container">
      <h1>Upload Documents (Optional)</h1>
      <p>To apply for a <b>Trade license</b> for your business, please provide the following documents:</p>
      <ul>
        
        <li></li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Documents</button>
      </form>
    </div>
  );
};

export default TradeLicense;
