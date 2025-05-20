import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
    return(
        <footer className="Footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h2>Civic Portal</h2>
              <p>Connecting citizens and government to build better communities together. Report issues, track progress, and see the change.</p>
              <div className="contact">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Main Street, City Center</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>+1 234 567 8900</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>info@civicportal.com</span>
                </div>
              </div>
            </div>

            <div className="footer-section links">
              <h2>Quick Links</h2>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/signin">User Login</Link></li>
                <li><Link to="/signup">User Register</Link></li>
              </ul>
            </div>

            <div className="footer-section admin-links">
              <h2>Administration</h2>
              <p>Are you a municipal administrator? Access your dashboard here.</p>
              <div className="admin-buttons">
                <Link to="/adminsignin" className="admin-btn signin-btn">Admin Login</Link>
                <Link to="/adminsignup" className="admin-btn signup-btn">Admin Register</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-icons">
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedinIn /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
            </div>
            <div className="copyright">
              <p>&copy; 2024 Civic Portal All Rights Reserved.</p>
            </div>
          </div>
        </footer>
    );
};

export default Footer;