import React, { useState, useRef, useEffect } from 'react';
import './NewRequestPage.css';
import { useAuth } from './contexts/AuthContext.js';
import { supabase } from './supabaseClient.js';
import axios from 'axios';

const NewRequestPage = () => {
  const [issueData, setIssueData] = useState({
    issue: '',
    location: '',
    description: '',
    imagePath: null,
    name: '',
    status: 'Open',
    userId: '',
    schedule: null,
    tehsil: '',
    documentPath: null, // Changed field to store document path only
  });

  const [fullName, setFullName] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState('');
  const fileInputRef = useRef(null);
  const { user, session } = useAuth();

  // Handle Document Upload
  const handleDocumentUpload = (file) => {
    setUploadedDocument(file);
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     alert(`Selected file: ${file.name}`);
  //   }
  //   setImageFile(file); 
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file); // Set image file
    } else {
      alert("Please select a valid image file (JPEG/PNG).");
    }
  };

  const handleDocumentChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedDocument(file); // Set document file
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleInputChange = (field, value) => {
    setIssueData((prevData) => ({ ...prevData, [field]: value || null }));
  };

    useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        console.log("User from Supabase Auth:", user);

        // Get user data from user metadata (stored during signup)
        const userMetadata = user.user_metadata || {};
        const firstName = userMetadata.first_name || '';
        const lastName = userMetadata.last_name || '';
        const tehsil = userMetadata.tehsil || '';
        const location = userMetadata.location || '';

        console.log("User metadata:", userMetadata);

        // Update the issueData state with the user's information
        setIssueData(prevData => ({
          ...prevData,
          name: `${firstName} ${lastName}`.trim(),
          userId: user.id,
          tehsil: tehsil,
          location: location, // Pre-fill location if available
        }));

        setFullName(`${firstName} ${lastName}`.trim());

        console.log("Updated issueData with user info:", {
          name: `${firstName} ${lastName}`.trim(),
          userId: user.id,
          tehsil: tehsil,
          location: location
        });

      } catch (error) {
        console.error('Error setting user data:', error);
      }
    };

    // Call the function to fetch the user's data when user is available
    fetchUserData();
  }, [user]);

  // useEffect(() => {
  //   fetchUserName();
  // }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Log the current issueData state
    console.log('Current issueData before submission:', issueData);
    console.log('Current user:', user);

    const formData = new FormData();
    formData.append('issue', issueData.issue);
    formData.append('location', issueData.location);
    formData.append('description', issueData.description);
    formData.append('name', issueData.name);
    formData.append('status', issueData.status);
    formData.append('userId', issueData.userId);
    // Only append schedule if it has a valid value
    if (issueData.schedule && issueData.schedule !== 'null' && issueData.schedule !== null) {
      formData.append('schedule', issueData.schedule);
    }
    formData.append('tehsil', issueData.tehsil);

    // Validate required fields (schedule is optional)
    if (!issueData.issue || !issueData.location || !issueData.description || !issueData.name || !issueData.userId || !issueData.tehsil) {
      alert('Please fill in all required fields. Missing: ' +
        [
          !issueData.issue && 'Issue',
          !issueData.location && 'Location',
          !issueData.description && 'Description',
          !issueData.name && 'Name',
          !issueData.userId && 'User ID',
          !issueData.tehsil && 'Tehsil'
        ].filter(Boolean).join(', ')
      );
      return;
    }

    if (!imageFile) {
      alert('Please select an image file.');
      return;
    }

    if (imageFile) {
      formData.append('image', imageFile); // Append image to formData
    }
    if (uploadedDocument) {
      formData.append('document', uploadedDocument); // Append document to formData
    }

    // Debug: Log what's being sent
    console.log('FormData being sent:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // Get the access token from Supabase session
      const accessToken = session?.access_token;

      if (!accessToken) {
        alert('Authentication required. Please sign in again.');
        return;
      }

      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/newrequest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Request added successfully:', response.data);
      alert('Request Added Successfully');

      setIssueData({
        issue: '',
        location: '',
        description: '',
        imagePath: null,
        name: '',
        status: 'open',
        userId: '',
        schedule: null,
        tehsil: '',
        documentPath: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        console.log('File input reset');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.data?.message) {
        alert(`Failed to submit request: ${error.response.data.message}`);
      } else {
        alert('Failed to submit the request. Please try again.');
      }
    }
  };


  //Render specific UI based on selected request
  const renderRequestUI = () => {
    switch (selectedRequest) {
      case 'Trash : Road side dust':
        return(
          <div className="NoNeed" >
            <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
          </div>
      );

      case 'Trash : Street dust':
        return(
        <div className="NoNeed" >
          <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
        </div>
    );

      case 'Trash : Bin Replacement':
        return(
          <div className="NoNeed" >
            <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
          </div>
      );

      case 'Trash : Waste water Blockage':
       return(
        <div className="NoNeed" >
          <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
        </div>
    );

      case 'Water Supply Problem':
       return(
        <div className="NoNeed" >
          <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
        </div>
    );

      case 'Side Walk Repair':
        return(
        <div className="NoNeed" >
          <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
        </div>
    )
    
      case 'Traffic signals Issue':
        return(
          <div className="NoNeed" >
            <h3 style={{marginTop:'50px' , fontSize:'22px'}}>No Documents Needed For This Request</h3>
          </div>
      )

      case 'Street Lights Repair':
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
                 <input type="file" accept=".pdf" onSubmit={handleSubmit} onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }} />
             </div>
           );    

      case 'Demolishing Certificate':
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
              <input type="file" accept=".pdf" onSubmit={handleSubmit} onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }} />
          </div>
        );
      

      case 'Limit Certificate':
        return (
          <div className="request-container">
            <h1>Upload Documents (Optional)</h1>
            <p>To apply for a <b>Limit Certificate</b>, please provide the following documents:</p>
            <ul>
              <li>Original property documents (sale deed, allotment letter)</li>        
              <li>Site plan showing the property’s boundaries</li>        
              <li>NOC from nearby property owners (if applicable)</li>        
              <li>Government-issued ID of the applicant</li>        
              <li>Request letter to the TMA</li>        
      
            </ul>
              <input type="file" accept=".pdf" onSubmit={handleSubmit} onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }}/>
          </div>
        );


      case 'Sanitation in Designated Area of TMA':
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
        <input type="file" accept=".pdf" onSubmit={handleSubmit} onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }} />

    </div>
     );

      case 'Grant of Trade License for Small Business':
        return (
          <div className="request-container">
            <h1>Upload Documents (Optional)</h1>
            <p>To apply for a <b>Trade license</b> for your business, please provide the following documents:</p>
            <ul>
              <li>Business registration documents</li>
              <li>NOC from the landlord (if rented premises)</li>
              <li>CNIC of the business owner</li>
              <li>Proof of ownership or rental agreement</li>
              <li>Taxpayer identification or proof of tax registration</li>
              <li>Written application for the license</li>
            </ul>
              <input type="file" accept=".pdf" onSubmit={handleSubmit} onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }}  />
          </div>
        );

      case 'Grant of NOC for Establishment of Fruits and Vegetable Markets':
        return (
    <div className="request-container">
      <h1>Upload Documents (Optional)</h1>
      <p>To apply for the NOC, please provide the following documents:</p>
      <ul>
       <li>Business registration or proof of business ownership</li>
       <li>Market layout plan approved by relevant authorities</li>
       <li>Property ownership or rental agreement</li>
       <li>CNIC of the applicant</li>
       <li>NOC from local residents or businesses near the proposed market site</li>
       <li>Environmental impact assessment or sanitation approval (if required)</li>
      </ul>
        <input type="file" accept=".pdf" onSubmit={handleSubmit}  onChange={(e) => {
    handleDocumentChange(e); // Call the original file change handler
    handleDocumentUpload(e.target.files[0]); // Call the document upload handler
  }}/>
    </div>
  );

      default:
        return <div className='PleaseSelect'>Please select a request type to see more details.</div>;
    }
  };

  return (
    <div className="NewRequestDIV">
      <div className="request-page-container">
        <form onSubmit={handleSubmit} className="form-wrapper" encType="multipart/form-data">
          <h2 className="form-heading">New Request</h2>
          <div className="FORMDIV">
            <div className="FORMDIV1">
              <div className="form-item">
                <label htmlFor="issue-select">Issue:</label>
                <select
                  required
                  id="issue-select"
                  value={issueData.issue}
                  onChange={(e) => {
                    handleInputChange('issue', e.target.value);
                    setSelectedRequest(e.target.value);
                  }}
                  className="form-select"
                >
                  <option value="" disabled>Select Request Type</option>
                  <option value="Trash : Road side dust">Trash : Road side dust</option>
                  <option value="Trash : Street dust">Trash : Street dust</option>
                  <option value="Trash : Bin Replacement">Trash : Bin Replacement</option>
                  <option value="Trash : Waste water Blockage">Trash : Waste water Blockage</option>
                  <option value="Water Supply Problem">Water Supply Problem</option>
                  <option value="Side Walk Repair">Side Walk Repair</option>
                  <option value="Traffic signals Issue">Traffic signals Issue</option>
                  <option value="Street Lights Repair">Street Lights Repair</option>
                  <option value="Demolishing Certificate">Demolishing Certificate</option>
                  <option value="Limit Certificate">Limit Certificate</option>
                  <option value="Sanitation in Designated Area of TMA">Sanitation in Designated Area of TMA</option>
                  <option value="Grant of Trade License for Small Business">Grant of Trade License for Small Business</option>
                  <option value="Grant of NOC for Establishment of Fruits and Vegetable Markets">
                    Grant of NOC for Establishment of Fruits and Vegetable Markets
                  </option>
                </select>
              </div>

              <div className="form-item">
                <label htmlFor="location-input">Location:</label>
                <input
                  required
                  type="text"
                  id="location-input"
                  value={issueData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location..."
                  className="form-input"
                />
              </div>

              <div className="form-item">
                <label htmlFor="image-upload">Image:</label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-file"
                  ref={fileInputRef}
                />
              </div>

              <div className="form-item">
                <label htmlFor="description-textarea">Description:</label>
                <textarea
                  required
                  id="description-textarea"
                  value={issueData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add description..."
                  className="form-textarea"
                />
              </div>

              <div className="form-item-4">
                <label htmlFor="name-display">Report By:</label>
                <p id="name-display">{issueData.name}</p>
              </div>
            </div>

            <div className="FORMDIV2">{renderRequestUI()}</div>
          </div>

          <button type="submit" className="submit-button">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default NewRequestPage;
