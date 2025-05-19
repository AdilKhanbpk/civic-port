import React from "react";
import './Contact.css'
import Footer from "./Components/Footer";

const Contact = () =>{
    return(
        <div>
            <div className="contact">
            <h1>Contact Us</h1>
            <div className="box5"></div>
            <p className="ppp">We're here to help! If you have any questions, concerns, or need assistance,
                please don't hesitate to reach out to us. Whether you're reporting an issue or
                seeking information, our team is ready to support you.</p>  <br /> <br />

            <h3>Get In Touch</h3>
            <ul>
                <li className="conul"><strong>phone: </strong>  +923114477899</li>
                <li className="conul"><strong>Email: </strong> civicportal@gmail.com</li>
                <li className="conul"><strong>Office Address: </strong> TMA Topi, Tehsil Topi,</li>
                <li className="conul"><strong>Working Hours: </strong> Monday to Friday, 9:00 AM - 5:00 PM</li>

            </ul>
            <br /> <br />
            <h3>Report an Issue Online</h3>
            <p className="ppp">You can easily report any local issues directly through our platform. Simply
            [click here] to fill out our online form, and we'll ensure your concern is addressed promptly.</p>
            <br /> <br />

            <h3>Follow Us</h3>
            <p className="ppp">Stay updated with the latest news and developments by following us on social media:</p>
            <div className="social-links">
                <a href="#" className="social"><span>Facebook</span></a>
                <a href="#" className="social"><span>Twitter</span></a>
                <a href="#" className="social"><span>Instagram</span></a>
            </div>

            <br /> <br />

            <h3>Visit us</h3>
            <p className="ppp">Feel free to visit our office during working hours for any in-person inquiries.
                Our team is always ready to listen and assist with any local issues or questions you may have.</p>
            </div>
            <br /> <br /> <br /> <br />
            <Footer/>
        </div>
    )
}
export default Contact;