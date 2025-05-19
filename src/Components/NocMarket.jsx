import React, { useState } from 'react';
import './Request.css';

const NocMarket = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Business registration or proof of business ownership",
    "Market layout plan approved by relevant authorities",
    "Property ownership or rental agreement",
    "CNIC of the applicant",
    "NOC from local residents or businesses near the proposed market site",
    "Environmental impact assessment or sanitation approval (if required)",
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
      <p>To apply for the NOC, please provide the following documents:</p>
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

export default NocMarket;
