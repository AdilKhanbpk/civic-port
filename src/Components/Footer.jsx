import React from "react";
import './Footer.css'
const Footer = () => {
    return( 
        <div className="Footer">
          <div className="SocialMedia">
            <div className="Connect">
                <h2>Connect With Us</h2>
                </div>
            <div className="facebook">
                <img src="facebook111.png" alt="" className="img" />
                <h3>Facebook</h3>
                </div>
            <div className="insta">
                <img src="instagram.png" alt="" className="img" />
                <h3>Instagram</h3>
                </div>
            <div className="twitter">
                <img src="twitter.png" alt="" className="img" />
                <h3>Twitter</h3
                ></div>
          </div>
          <div className="Copyright">
            <h2>@2024ClickAndFix</h2>
            <h2>All Rights Reserved</h2>
          </div>
        </div>
    )}
export default Footer;