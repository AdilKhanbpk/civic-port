import React, { useState, useEffect } from 'react';
import Logo from './Components/Logo';
import './Signuppage.css';
import { supabase } from './supabaseClient.js';
import { useAuth } from './contexts/AuthContext.js';
import { ClipLoader } from 'react-spinners';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

const Signuppage = () => {
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Contact_Number: '',
    Password: '',
    Tehsil: '',
    Location: '',
  });

  const [tehsils, setTehsils] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  useEffect(() => {
    const fetchTehsils = async () => {
      try {
        const { data, error } = await supabase
          .from('tehsils')
          .select('tehsil');

        if (error) throw error;

        console.log(data);
        setTehsils(data);
      } catch (error) {
        console.log('Error Fetching Tehsils:', error.message);
      }
    };
    fetchTehsils();
  }, []);

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
    setMessage('');

    try {
      // Sign up with Supabase Auth
      const { data, error } = await signUp(
        formData.Email,
        formData.Password,
        {
          first_name: formData.First_Name,
          last_name: formData.Last_Name,
          contact_number: formData.Contact_Number,
          tehsil: formData.Tehsil,
          location: formData.Location
        }
      );

      if (error) {
        throw error;
      }

      console.log('Signup Successful', data);

      // Reset form
      setFormData({
        First_Name: '',
        Last_Name: '',
        Email: '',
        Contact_Number: '',
        Password: '',
        Tehsil: '',
        Location: '',
      });

      // Redirect to email verification page immediately
      navigate('/email-verification', {
        state: {
          email: formData.Email,
          message: 'Account created successfully! Please check your email to verify your account before signing in.'
        }
      });

    } catch (error) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        setMessage('Email already exists. Please use a different email.');
      } else {
        setMessage(`Signup failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {loading ? (
        <div className="loader-container">
          <ClipLoader color="#10b981" loading={loading} size={60} />
        </div>
      ) : (
        <div className="inner-container2">
          <h2>Create Account</h2>
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-group">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-with-icon">
                  {/* <FaUser className="input-icon" /> */}
                  <input
                    id="firstName"
                    type="text"
                    required
                    placeholder="Enter first name"
                    name="First_Name"
                    value={formData.First_Name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-with-icon">
                  {/* <FaUser className="input-icon" /> */}
                  <input
                    id="lastName"
                    type="text"
                    required
                    placeholder="Enter last name"
                    name="Last_Name"
                    value={formData.Last_Name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="name-group">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  {/* <FaEnvelope className="input-icon" /> */}
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter email address"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Contact Number</label>
                <div className="input-with-icon">
                  {/* <FaPhone className="input-icon" /> */}
                  <input
                    id="phone"
                    type="text"
                    required
                    placeholder="Enter contact number"
                    name="Contact_Number"
                    value={formData.Contact_Number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                {/* <FaLock className="input-icon" /> */}
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Create a password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="tehsil">
              <label htmlFor="tehsil">Tehsil</label>
              <div className="input-with-icon">
                {/* <FaBuilding className="input-icon" /> */}
                <select
                  id="tehsil"
                  required
                  name="Tehsil"
                  value={formData.Tehsil}
                  onChange={handleChange}
                >
                  <option value="">Select Your Tehsil</option>
                  {tehsils.map((tehsil, index) => (
                    <option key={index} value={tehsil.tehsil}>
                      {tehsil.tehsil}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="input-with-icon">
                {/* <FaMapMarkerAlt className="input-icon" /> */}
                <input
                  id="location"
                  type="text"
                  required
                  placeholder="Enter your location"
                  name="Location"
                  value={formData.Location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="signup-link">
              Already have an account? <Link to="/signin">Sign In</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signuppage;