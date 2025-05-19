import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Components/Logo.jsx';
import axios from 'axios';
import './Adminsignin.css'; 

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
    <div style={{display:'flex' , alignItems:'center' , justifyContent:'center' , height:'100vh' , width:'auto'}}>
      {/* <Logo /> */}
      <div className='mainbody'>
      <div className="admin-signin-container">
        <div className="admin-inner-container" >
          <h2>Admin Sign In</h2>
          <form className="admin-signin-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
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
            <div className="admin-form-group">
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
            <div className="admin-signup-link">
              New Admin? <Link to="/adminsignup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminSigninpage;
