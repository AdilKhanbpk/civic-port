import React, { useState } from 'react';
import './Request.css';

const SanitationRequest = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Written request outlining the need for sanitation services",
    "Details of the area where services are required",
    "Identification proof (CNIC or other ID)",
    "Address verification documents for the designated area",
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
      <p>To apply for <b>sanitation services</b> in your area, please provide the following documents:</p>
      <ul>
        <li>Written request outlining the need for sanitation services</li>
        <li>Details of the area where services are required</li>
        <li>Identification proof (CNIC or other ID)</li>
        <li>Address verification documents for the designated area</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Documents</button>
      </form>
    </div>
  );
};

export default SanitationRequest;
