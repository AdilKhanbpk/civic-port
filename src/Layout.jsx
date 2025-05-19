import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Logo from "./Components/Logo";
import Signin from "./Components/Signin";
import './Layout.css'

const Layout = () => {
  return (
    <div>
        <Logo/>
        <p className="firstpara">Connecting Citizens and Government</p>
        <Signin />
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
    </div>
  );
};

export default Layout;
