import React, { useState } from 'react';
import './Request.css';

const StreetLights = () => {
  const [file, setFile] = useState(null);

  const documents = [
    "Written application specifying the location of faulty street lights",
    "CNIC or other identification proof",
    "Address proof for the applicant's residence or business",
    "Photographs of non-functional street lights (optional)",
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
      <p>To request repair for <b>street lights</b> in your area, please provide the following documents:</p>
      <ul>
        <li>Written application specifying the location of faulty street lights</li>
        <li>CNIC or other identification proof"</li>
        <li>Address proof for the applicant's residence or business"</li>
        <li>Photographs of non-functional street lights (optional)"</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />
        <button type="submit">Upload Documents</button>
      </form>
    </div>
  );
};

export default StreetLights;
