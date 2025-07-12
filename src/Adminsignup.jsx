import React, { useState , useEffect } from "react";
import axios from "axios";
import './Signuppage.css'; // Use the same modern CSS as user signup
import Logo from "./Components/Logo";
import { useNavigate, Link } from "react-router-dom";

const Adminsignup = () => {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Password: '',
    Tehsil: '',
    Secret_Key: ''
  });
  const [tehsils , settehsils] = useState([]);

  useEffect(() => {
    const fetchtehsils = async() => {
      try{
      const response = await axios.get('http://localhost:4000/api/gettehsils');
      settehsils(response.data)
    } catch(error){
         console.error('Error Fetching tehsils' , error);
         
    }
  }
fetchtehsils();
} , [])

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/adminsignup', formData);
      console.log('Signup Successful', response.data);

      if (response.status === 201) {
        navigate('/adminsignin');
      } else {
        alert('Signup failed');
      }
      setFormData({
        First_Name: '',
        Last_Name: '',
        Email: '',
        Password: '',
        Tehsil : '',
        Secret_Key: ''
      });
    } catch (error) {
      console.error('Admin signup error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response && error.response.status === 401) {
        alert('Invalid Secret Key');
      } else if (error.response && error.response.status === 400) {
        const message = error.response.data?.message || 'Email already exists';
        alert(message);
      } else if (error.response && error.response.status === 500) {
        const message = error.response.data?.message || 'Server error during registration';
        alert(`Server Error: ${message}`);
      } else {
        const message = error.response?.data?.message || 'Admin Signup Failed';
        alert(message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="inner-container">
        {/* <div className="logo-section">
          <Logo />
        </div> */}

        <h2 className='innercontainer2'>Admin Registration</h2>
        {/* <p className="subtitle">Create an administrative account</p> */}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="name-group">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="First_Name"
                placeholder="Enter your first name"
                value={formData.First_Name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="Last_Name"
                placeholder="Enter your last name"
                value={formData.Last_Name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="Email"
              placeholder="Enter your email address"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="Password"
              placeholder="Create a strong password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tehsil">Tehsil</label>
            <select
              id="tehsil"
              name="Tehsil"
              value={formData.Tehsil}
              onChange={handleChange}
              required
            >
              <option value=''>Select Your Tehsil</option>
              {tehsils.map((tehsil, index) =>
                <option key={index} value={tehsil.tehsil}>{tehsil.tehsil}</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="secretKey">Admin Secret Key</label>
            <input
              id="secretKey"
              type="password"
              name="Secret_Key"
              placeholder="Enter the admin secret key"
              value={formData.Secret_Key}
              onChange={handleChange}
              required
            />
            <small className="form-hint">
              Contact your system administrator for the secret key
            </small>
          </div>

          <button type="submit" className="submit-button">
            Create Admin Account
          </button>
        </form>

        <div className="signup-link">
          <p>
            Already have an admin account? <Link to="/adminsignin">Sign In</Link>
          </p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="signup-link">
          <p>
            Regular User? <Link to="/signup">User Registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Adminsignup;
