import React, { useState } from 'react';
import './Request.css';

const LimitCertificate = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Original property documents (sale deed, allotment letter)",
    "Site plan showing the property’s boundaries",
    "NOC from nearby property owners (if applicable)",
    "Government-issued ID of the applicant",
    "Request letter to the TMA",
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
      <p>To apply for a <b>Limit Certificate</b>, please provide the following documents:</p>
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Documents</button>
      </form>
    </div>
  );
};

export default LimitCertificate;
