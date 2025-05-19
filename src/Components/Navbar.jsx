import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [togglenavbar, settogglenavbar] = useState(false);
  const navRef = useRef(null);
  const menuBtnRef = useRef(null);

  const shownavbar = () => {
    const newState = !togglenavbar;
    settogglenavbar(newState);

    // Prevent scrolling when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Close menu when clicking outside
  const handleOutsideClick = (event) => {
    if (
      togglenavbar &&
      navRef.current &&
      !navRef.current.contains(event.target) &&
      !menuBtnRef.current.contains(event.target)
    ) {
      settogglenavbar(false);
      document.body.style.overflow = 'auto';
    }
  };

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    settogglenavbar(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (togglenavbar) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [togglenavbar]);

  return (
    <div className="navone">
      <div className="navbar" onClick={shownavbar} ref={menuBtnRef}>
        {togglenavbar ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
          </svg>
        )}
      </div>

      <div className={`nav ${togglenavbar ? 'show' : ''}`} ref={navRef}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-button actived' : 'nav-button')}
          onClick={handleLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'nav-button actived' : 'nav-button')}
          onClick={handleLinkClick}
        >
          About
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? 'nav-button actived' : 'nav-button')}
          onClick={handleLinkClick}
        >
          Services
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? 'nav-button actived' : 'nav-button')}
          onClick={handleLinkClick}
        >
          Contact
        </NavLink>

        {/* Login and Register buttons - only visible when sidebar is open */}
        {togglenavbar && (
          <>
            <div className="sidebar-separator"></div>
            <NavLink
              to="/signin"
              className="nav-button auth-button"
              onClick={handleLinkClick}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="nav-button auth-button"
              onClick={handleLinkClick}
            >
              Register
            </NavLink>
          </>
        )}


      </div>

      <div className="line2"><hr /></div>
    </div>
  );
};

export default Navbar;
