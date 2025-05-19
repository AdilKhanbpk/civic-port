import React from "react";
import { Link } from "react-router-dom";
import './Signin.css'

const Signin = () => {
  return (
    <div className="Buttons">
      <Link to="/signin">
        <button className="Resident">Login</button>
      </Link>
      <Link to="/signup">
        <button className="Administration">Register</button>
      </Link>
    </div>
  );
};

export default Signin;


