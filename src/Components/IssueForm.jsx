import React from 'react';
import ImageUploader from './ImageUploader';
import './IssueForm.css';

const issues = [
  'Trash and recycling: Road side dust',
  'Trash and recycling: Street dust',
  'Trash and recycling: Bin Replacement',
  'Trash and recycling: Waste water Blockage',
  'Side Walk Repair',
  'Traffic signals Issue',
  'Road Repair',
  'Street Lights Repair'
];

const IssueForm = ({ issueData, onInputChange, onSubmit }) => {
  const handleIssueChange = (e) => {
    onInputChange('issue', e.target.value);
  };

  const handleLocationChange = (e) => {
    onInputChange('location', e.target.value);
  };

  const handleImageUpload = (image) => {
    onInputChange('image', image);
  };

  const handleDescriptionChange = (e) => {
    onInputChange('description', e.target.value);
  };

  return (
    <div className="issue-form">
      <h2>Submit Your Request</h2>
      <div className="form-group">
        <label htmlFor="issue">Select an Issue</label>
        <select id="issue" value={issueData.issue} onChange={handleIssueChange}>
          <option value="">Select an issue</option>
          {issues.map((issue, index) => (
            <option key={index} value={issue}>
              {issue}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          type="text"
          value={issueData.location}
          onChange={handleLocationChange}
          placeholder="Enter location..."
        />
      </div>
      <div className="form-group">
        <label>Upload Image</label>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={issueData.description}
          onChange={handleDescriptionChange}
          placeholder="Add description..."
        />
      </div>
      <button onClick={onSubmit}>Submit Request</button>
    </div>
  );
};

export default IssueForm;
