import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Components/Logo.jsx';
import axios from 'axios';
import './Signinpagecss.css';

const Signinpage = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {  //Checks If the User Is Loggedin Already
    const token = localStorage.getItem('token');
    if (token) {   
      navigate('/userDashboard');
    }
  }, [navigate]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/signin', formData);
      const { token, email , id } = response.data;
      localStorage.setItem('token', token); // Ensure token is stored correctly
      localStorage.setItem('userEmail', email);  
      localStorage.setItem('userId' , id)
      navigate('/userDashboard');  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  } 

  return (
    <div>
      {/* <Logo /> */}
      <div className="signin-container" >
        <div className="inner-container">
          <h2>Sign In</h2>
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" 
                required
                placeholder="Email Address"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="signup-link">
              New here? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signinpage;
