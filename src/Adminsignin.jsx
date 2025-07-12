import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Components/Logo.jsx';
import axios from 'axios';
import './Signinpagecss.css'; // Use the same modern CSS as user signin

const AdminSigninpage = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/adminsignin', formData);
      const {Token , email } = response.data;
      localStorage.setItem('Token' , Token);
      localStorage.setItem('AdminEmail' , email);
      if (response.data.success) {
        navigate('/adminDashboard');
      } else {
        alert('Admin Signin failed');
        console.log(response.data);
        
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Invalid credentials');
      } else {
        alert('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="inner-container">
        {/* <div className="logo-section">
          <Logo />
        </div> */}

        <h2 className='innercontainer2'>Admin Sign In</h2>
        {/* <p className="subtitle">Access the administrative dashboard</p> */}

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your admin email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </button>
        </form>

        <div className="signup-link">
          <p>
            New Admin? <Link to="/adminsignup">Create Account</Link>
          </p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="signup-link">
          <p>
            Regular User? <Link to="/signin">User Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSigninpage;
