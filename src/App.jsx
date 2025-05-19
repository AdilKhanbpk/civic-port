import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Signinpage from './Signinpage';
import Signuppage from './Signuppage';
import UserDashboard from './UserDashboard.jsx';
import Adminsignup from './Adminsignup.jsx';
import Adminsignin from './Adminsignin.jsx';
import AdminDashboard from './AdminDashboard.jsx';
// import Userprofile from './Userprofile.jsx';
import NewRequestPage from './Newrequestpage.jsx';
import ViewRequests from './ViewRequests.jsx';
import Layout from './Layout';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import MyAdmin from './Components/MyAdmin.jsx';
import './Home.css'; // Assuming you have global styles

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Main pages with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
        
          </Route>

          {/* Other routes */}
          <Route path="/signin" element={<Signinpage />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/adminsignup" element={<Adminsignup />} />
          <Route path="/adminsignin" element={<Adminsignin />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          {/* <Route path="/profile" element={<Userprofile />} /> */}
          <Route path="/newrequest" element={<NewRequestPage />} />
          <Route path="/allrequests" element={<ViewRequests />} />
          <Route path='myadmin' element={<MyAdmin/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;


//Responsiveness
//back button
//logout in allrequest