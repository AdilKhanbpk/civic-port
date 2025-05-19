import React from "react";
import { Link } from "react-router-dom";
import './Div.css'

const Div = () => {
    return(
        <div className="div">
                <div className="first">
                    <h3>Report Your Issue To Specific Department</h3>
                    <p>Send The Pictures Of Issue</p>
                    <Link to={'/signin'}><button>Report</button></Link>
                </div>
                <div className="Second">
                    <img src="Cleaning.jpg" alt="Cleaning" />
                </div>
                
        </div>
    )
}
export default Div;