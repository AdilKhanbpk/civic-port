import React from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    onImageUpload(file);
  };

  return (
    <div className="image-uploader">
      <h2>Add Image</h2>
      <p>Please add a photo. It helps us to better identify your request.</p>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={() => onImageUpload(null)}>No Image</button>
    </div>
  );
};

export default ImageUploader;
