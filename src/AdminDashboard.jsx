import React, { useState, useEffect } from 'react';
import Logo2 from './Components/Logo2';
import './AdminDashboard.css';
import { useNavigate } from "react-router-dom";
import AllRequestsAdmin from "./Components/AllRequestsAdmin";
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pageTitle, setPageTitle] = useState('All Requests');
  const [tehsilName, setTehsilName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getTehsil = () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          navigate('/adminsignin');
          return;
        }

        const decodedToken = jwtDecode(token);
        setTehsilName(decodedToken.Tehsil);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/adminsignin');
      }
    };

    getTehsil();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategoryChange = (category, title) => {
    setSelectedCategory(category);
    setPageTitle(title);

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('AdminEmail');
    navigate('/');
  };

  // Define button data with icons
  const categoryButtons = [
    {
      id: 'all',
      title: 'All Requests',
      icon: 'allnew.png'
    },
    {
      id: 'completed',
      title: 'Completed Requests',
      icon: 'completed.png'
    },
    {
      id: 'pending',
      title: 'Pending Requests',
      icon: 'pending.png'
    },
    {
      id: 'Dropped',
      title: 'Dropped Reports',
      icon: 'cross.png'
    },
    {
      id: 'scheduled',
      title: 'Scheduled Requests',
      icon: 'scheduled.png'
    },
    {
      id: 'not-scheduled',
      title: 'Not-Scheduled Requests',
      icon: 'not-scheduled.png'
    },
    {
      id: 'today',
      title: 'Today Tasks',
      icon: 'today.png'
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Mobile Navigation Toggle Button */}
      <button
        className={`admin-nav-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="admin-logo">
          <Logo2 />
        </div>
        <div className="admin-buttons-container">
          <h5>Tehsil: {tehsilName}</h5>
          <div className="admin-buttons">
            {categoryButtons.map(button => (
              <button
                key={button.id}
                className={selectedCategory === button.id ? 'active' : ''}
                onClick={() => handleCategoryChange(button.id, button.title)}
              >
                <img src={button.icon} alt={button.title} />
                {button.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-header">
          <h4>Administration Dashboard</h4>
          <div className="logout-container">
            <img
              src="logout.png"
              alt="logout"
              className="logout-img"
              onClick={handleLogout}
            />
            <span className="custom-tooltip">Logout</span>
          </div>
        </div>
        <div className="admin-main">
          <h3>{pageTitle}</h3>
          <AllRequestsAdmin selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
