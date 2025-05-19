import React, { useState } from 'react';
import './Request.css';

const DemolishingCertificate = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Property ownership documents (allotment letters, sale deeds)",
    "Request letter from the property owner",
    "NOC (No Objection Certificate) from the concerned authority",
    "Structural stability report from a certified engineer",
    "Approved demolition plan",
    "Utility disconnection letters (gas, electricity, water)",
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
      <p>To apply for a <b>Demolishing Certificate</b>, please provide the following documents:</p>
      <ul>
        <li>Property ownership documents (allotment letters, sale deeds)</li>
        <li>Request letter from the property owner</li>
        <li>NOC (No Objection Certificate) from the concerned authority</li>
        <li>Structural stability report from a certified engineer</li>
        <li>Approved demolition plan</li>
        <li>Utility disconnection letters (gas, electricity, water)</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
      </form>
    </div>
  );
};

export default DemolishingCertificate;
