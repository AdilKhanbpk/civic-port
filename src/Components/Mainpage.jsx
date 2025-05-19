import React from "react";
import { Link } from "react-router-dom";
import './Mainpage.css' 
const Mainpage = () => { 
    return(
        <div>
            <div className="Mainpage"> 
            <div className="firstdiv"> 
            <div className="line111"></div>
                <ul> <li>Use Civic Portal For Better Society </li></ul>
            </div>
            <div className="Seconddiv">
                <p className="seconddivp">How Does It Works?</p>
                <p>ClickAndFix is a solution that lets the residents to report problems, 
                    request repairs, gives feedback, and ask questions to their local government.
                     For  local governments,it helps manage tasks  efficiently and transparently,
                      ensuring  accountability and trust. Together, residents  and governments can
                       work to create cleaner,  safer, and happier communities.</p>

                       <br />
                       <div className="line12"></div>
            </div>

            {/* <div className="thirddiv">
                <h1>Create An <span>Account</span></h1>
                <Link to='/signup'><button className="btn1">Register Now</button></Link>

                <div className="btn12">
                <Link to='/signup'><button className="btn1">Register Now</button></Link> 
                <Link to='/adminsignup'><button className="btn2">Administration Sign Up</button></Link> 
                </div>
            </div> */}

            <div className="Forthdiv">
                <div className="text11">
                   <h1>Enhanced Reporting System</h1>
                   <p>The user-friendly interface allows residents to quickly capture and 
                    submit photos of issues like dirt or damage to The Organization Of The Specific Area. 
                    It ensures that users can easily connect with the specific organization responsible 
                    for addressing the problem</p>
                </div>
                <div className="img11">
                <img src={`${process.env.PUBLIC_URL}/ipad2.png`} alt="iPad" />
                </div>
                
            </div>

            <div className="line11"><br /><br /><hr /><br /><br /></div>
        </div>
        </div>
    )
}
export default Mainpage;