import React from "react";
import './Services.css';
import Footer from "./Components/Footer";

const Services = () =>{
    return(
        <div>
            <div className="services">
            <h1>Our Services</h1>
            <div className="box4"></div>
                   <p>At <span>Civic Portal</span>, we provide a platform for the residents of
                     Tehsil Topi to report and track the resolution of various local issues. 
                     Our goal is to improve the everyday lives of our community members by
                     addressing common problems promptly and effectively.</p> <br/>  <br/>

                   <h3 className="hh3">Street Light Repair</h3>
                   <p>Dim or non-functional streetlights can be more than just an
                      inconvenience—they can be a safety hazard. Report any issues with 
                      streetlights in your area, and our team will ensure they are repaired
                       swiftly.</p> <br/><br/>

                    <h3 className="hh3">Dustbin Replacement</h3> 
                    <p>Proper waste management is crucial for a clean and healthy environment. 
                        If you notice a damaged or missing dustbin in your vicinity, let us know, 
                        and we'll arrange for a replacement.</p><br/><br/>

                    <h3 className="hh3">Sidewalk Repair</h3> 
                    <p>Cracked or uneven sidewalks can cause accidents and hinder mobility. 
                        Report any sidewalk damage, and we'll coordinate repairs to keep our 
                        pathways safe and accessible for everyone.</p>  <br/><br/>
                    
                    <h3 className="hh3">Pothole Repair</h3>   
                    <p>Potholes not only damage vehicles but also pose a danger to pedestrians 
                        and cyclists. If you come across any potholes on the roads of Tehsil Topi, 
                        report them through our platform, and we’ll take action to fix them.</p>  <br/><br/>
                     
                    <h3 className="hh3">Drainage Issues</h3> 
                    <p>Blocked or overflowing drains can lead to waterlogging and health hazards. 
                        Report drainage problems in your area, and we'll ensure that they are 
                        addressed promptly</p><br/><br/>

                    <h3 className="hh3">Public Space Maintenance</h3>  
                    <p>Parks, playgrounds, and other public spaces are essential for community well-being.
                         If you notice any maintenance issues, such as broken equipment or unclean areas,
                          inform us, and we'll work on restoring them to their best condition.</p> <br/><br/><br/><br/> 
                      
            </div>
            <Footer/>
        </div>
    )
}
export default Services;