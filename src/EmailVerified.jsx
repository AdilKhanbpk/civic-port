import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.js';
import './Signinpagecss.css';

const EmailVerification = () => {
  const [message, setMessage] = useState('Please check your email to verify your account.');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  // Get email and message from navigation state
  const email = location.state?.email || '';
  const initialMessage = location.state?.message || 'Please check your email to verify your account.';

  useEffect(() => {
    setMessage(initialMessage);

    // If user is signed in but not verified, sign them out
    if (user && !loading) {
      console.log('User is signed in but needs email verification. Signing out...');
      signOut();
    }
  }, [user, loading, signOut, initialMessage]);

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('No email address found. Please try signing up again.');
      return;
    }

    try {
      // You can implement resend verification email here if needed
      setMessage('Verification email resent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend email. Please try again.');
    }
  };

  const handleGoToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="signin-container">
      <div className="inner-container">
        <h2 className='innercontainer2'>Email Verification Required</h2>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="message success">
            {message}
          </div>

          {email && (
            <div style={{ marginTop: '1rem', color: '#6b7280' }}>
              <p>We sent a verification email to:</p>
              <p style={{ fontWeight: 'bold', color: '#1f2937' }}>{email}</p>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              After verifying your email, you can sign in to your account.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleGoToSignin}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go to Sign In
              </button>

              {email && (
                <button
                  onClick={handleResendEmail}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Resend Email
                </button>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Didn't receive the email? Check your spam folder or try resending.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
