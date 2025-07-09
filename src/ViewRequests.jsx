import React, { useEffect, useState } from 'react';
import './ViewRequests.css';
import Logo from './Components/Logo';
import AllRequests from './Components/AllRequests';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.js';

const ViewRequests = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  return ( 
    <div>
      <div className="logoandlogout">
        <Logo />
        <div className="location2">
          <button>
            <Link to={'/profile'}> <img src="profile.png" alt="Profile" /> </Link>
          </button>
          <h3 onClick={handleLogout}>Log Out</h3>
        </div>
      </div>  
      <div className='heading'>
        <h2>All Requests</h2>
      </div>
      <AllRequests/>
      </div>
  )};
      
export default ViewRequests;
