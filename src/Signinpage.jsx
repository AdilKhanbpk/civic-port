import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Components/Logo.jsx';
import { useAuth } from './contexts/AuthContext.js';
import './Signinpagecss.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Signinpage = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {  //Checks If the User Is Loggedin Already
    console.log('Auth state changed:', { user, authLoading });

    // Only redirect if we're not loading and user is authenticated
    if (!authLoading && user) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/userDashboard');
    }
  }, [user, authLoading, navigate]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await signIn(formData.Email, formData.Password);

      if (error) {
        throw error;
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        setMessage('Please verify your email before signing in.');
        // Redirect to email verification page
        navigate('/email-verification', {
          state: {
            email: formData.Email,
            message: 'Please check your email and click the verification link before signing in.'
          }
        });
        return;
      }

      console.log('Signin Successful', data);
      setMessage('Signin successful! Redirecting...');

      // Clear form
      setFormData({
        Email: '',
        Password: '',
      });

      // Navigate to dashboard
      navigate('/userDashboard');

    } catch (error) {
      console.error('Signin error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setMessage('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setMessage('Please verify your email before signing in.');
        navigate('/email-verification', {
          state: {
            email: formData.Email,
            message: 'Please check your email and click the verification link to complete your registration.'
          }
        });
      } else {
        setMessage(`Signin failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="signin-container">
        <div className="inner-container">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div>Checking authentication...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signin-container">
      <div className="inner-container">
        <h2 className='innercontainer2'>Welcome Back</h2>
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              {/* <FaEnvelope className="input-icon" /> */}
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
              />
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
                placeholder="Enter your password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="forgot-password">
            {/* <Link to="#">Forgot Password?</Link> */}
          </div>
          <button type="submit" className="submit-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signinpage;
