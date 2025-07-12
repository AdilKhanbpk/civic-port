// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import './UserDashboard.css';
// import InviteNeighborsModal from './Components/NeighborModal'; // Import Modal
// import Logo2 from "./Components/Logo2";
// import Serviceprovider from "./Serviceprovider";
// import UserReports from "./UserReports";
// import AllRequests from "./Components/AllRequests";
// import DroppedComplaints from "./Components/DroppedComplaints";

// const UserDashboard = () => {
//   const [location, setLocation] = useState('');
//   const [activepage, setactivepage] = useState('complaint');
//   const [showNeighborModal, setShowNeighborModal] = useState(false); // For Modal
//   const navigate = useNavigate();

//   // Fetch user details and protected data
//   useEffect(() => {
//     const userEmail = localStorage.getItem('userEmail');
//     if (userEmail) {
//       axios.get(`http://localhost:4000/user/${userEmail}`)
//         .then(response => {
//           setLocation(response.data.Location);
//           console.log(response.data);
//         })
//         .catch(error => {
//           console.error('Error fetching location:', error);
//           localStorage.removeItem('token');
//           localStorage.removeItem('userEmail');
//           navigate('/signin');
//         });

//       fetchProtectedData();
//     } else {
//       navigate('/signin');
//     }
//   }, [navigate]);

//   const fetchProtectedData = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get('http://localhost:4000/protected', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Protected data:', response.data);
//     } catch (error) {
//       console.error('Error fetching protected data:', error);
//       localStorage.removeItem('token');
//       localStorage.removeItem('userEmail');
//       navigate('/signin');
//     }
//   };

//   // Open/close modal
//   const handleNeighborClick = () => {
//     setShowNeighborModal(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
//     navigate('/');
//   };

//   // Render different pages based on the activePage
//   return (
//     <div className="userdashboard">
//       <div className="dashboard1">
//         <div className="Logoo"><Logo2/></div>
//         <div className="Dashbuttons1">
//           <h5>User Dashboard</h5>
//           <div className="Dashbuttons2">
//             <button onClick={() => setactivepage('complaint')} > <img src="new.png" alt="new" />New Report</button>
//             <button onClick={() => setactivepage('mycomplaints')}> <img src="mynew.png" alt="myreports" style={{height:'35px' , width:'35px'}} />My Reports</button>
//             <button onClick={() => setactivepage('Dropped')}> <img src="cross.png" alt="cross" />Dropped Reports</button>
//             <button onClick={() => setactivepage('AllRequests')}> <img src="allnew.png" alt="overallreports" style={{width:'35px'}}/>Overall Reports</button>
//             <button onClick={handleNeighborClick}> <img src="invite.png" alt="invite" />Invite Neighbors</button>
//           </div>
//         </div>
//       </div>

//       <div className="dashboard2">
//         <div className="dashboard2-1">
//           <h4>Your Location: {location || 'Loading...'}</h4>
//           <div className="logout-container">
//             <p onClick={handleLogout}>
//               <img src="logout.png" alt="logout" className="logout-img" />
//               <span className="custom-tooltip">Logout</span>
//             </p>
//           </div>
//         </div>

//         <div className="dashboard2-2">
//           {/* Conditionally render components based on the activePage */}
//           {activepage === 'complaint' && <Serviceprovider />}
//           {activepage === 'mycomplaints' && <UserReports />}
//           {activepage === 'AllRequests' && <AllRequests />}
//           {activepage === 'Dropped' && <DroppedComplaints />}
//         </div>
//       </div>

//       {/* Modal is rendered outside of the button */}
//       {showNeighborModal && (
//         <InviteNeighborsModal
//           showModal={showNeighborModal}
//           setShowModal={setShowNeighborModal}
//         />
//       )}
//     </div>
//   );
// };

// export default UserDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.js";
import { supabase } from "./supabaseClient.js";
import "./UserDashboard.css";
import InviteNeighborsModal from "./Components/NeighborModal";
import Logo2 from "./Components/Logo2";
import Serviceprovider from "./Serviceprovider";
import UserReports from "./UserReports";
import AllRequests from "./Components/AllRequests";
import DroppedComplaints from "./Components/DroppedComplaints";

const UserDashboard = () => {
  const [location, setLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [activePage, setActivePage] = useState("complaint");
  const [showNeighborModal, setShowNeighborModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { user, session, loading, signOut } = useAuth();

  useEffect(() => {
    console.log('UserDashboard: Auth state changed', { user, loading });

    // Redirect to signin if not authenticated
    if (!loading && !user) {
      console.log('UserDashboard: No user, redirecting to signin');
      navigate("/signin");
      return;
    }

    // Check if user email is verified
    if (user && !user.email_confirmed_at) {
      console.log('UserDashboard: User email not verified, redirecting to verification page');
      navigate('/email-verification', {
        state: {
          email: user.email,
          message: 'Please verify your email before accessing the dashboard.'
        }
      });
      return;
    }

    // Fetch user profile data when user is authenticated and verified
    if (user && session && user.email_confirmed_at) {
      fetchUserProfile();
    }
  }, [user, session, loading, navigate]);

  // Function to create user profile if it doesn't exist
  const createUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Creating user profile from metadata...');
      const userMetadata = user.user_metadata || {};

      const { data, error } = await supabase
        .from('usersdb')
        .insert({
          id: user.id,
          first_name: userMetadata.first_name || '',
          last_name: userMetadata.last_name || '',
          contact_number: userMetadata.contact_number || '',
          tehsil: userMetadata.tehsil || '',
          location: userMetadata.location || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      console.log('User profile created successfully:', data);

      // Update the state with the new profile
      if (data) {
        setUserProfile(data);
        setLocation(data.location || 'Not specified');
        setFullName(`${data.first_name} ${data.last_name}`.trim() || 'User');
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile for:', user.email);

      // Get user profile from Supabase
      const { data: profile, error } = await supabase
        .from('usersdb')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);

        // If profile doesn't exist (PGRST116 = no rows returned), create it automatically
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating profile from user metadata...');
          await createUserProfile();
          return;
        }

        // For other errors, just log and continue
        console.error('Other profile error:', error);
        return;
      }

      console.log('User profile:', profile);
      setUserProfile(profile);
      setLocation(profile.location || 'Not specified');
      setFullName(`${profile.first_name} ${profile.last_name}`.trim() || 'User');

    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Remove old fetchProtectedData - no longer needed with Supabase Auth

  const handleNeighborClick = () => {
    setShowNeighborModal(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleButtonClick = (button) => {
    if (button.action) {
      button.action();
    } else {
      setActivePage(button.id);
    }

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      const { error } = await signOut();

      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
        navigate("/");
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate("/");
    }
  };

  // Define an array of pages and corresponding components
  const pages = {
    complaint: <Serviceprovider />,
    mycomplaints: <UserReports />,
    AllRequests: <AllRequests />,
    Dropped: <DroppedComplaints />,
  };

  // Array to hold button information
  const buttons = [
    { id: "complaint", label: "New Report", icon: "new.png" },
    {
      id: "mycomplaints",
      label: "My Reports",
      icon: "mynew.png",
      iconStyle: { height: "35px", width: "35px" },
    },
    { id: "Dropped", label: "Dropped Reports", icon: "cross.png" },
    {
      id: "AllRequests",
      label: "Overall Reports",
      icon: "allnew.png",
      iconStyle: { width: "35px" },
    },
    {
      id: "invite",
      label: "Invite Neighbors",
      icon: "invite.png",
      action: handleNeighborClick,
    },
  ];

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="userdashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Show message if no user (shouldn't happen due to redirect, but just in case)
  if (!user) {
    return (
      <div className="userdashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="userdashboard">
      {/* Mobile Navigation Toggle Button */}
      {/* <button
        className={`user-nav-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button> */}

      {/* Sidebar */}
      <div className={`dashboard1 ${sidebarOpen ? 'show' : ''}`}>
        <div className="Logoo">
          <Logo2 />
        </div>
        <div className="Dashbuttons1">
          <h5>User Dashboard</h5>
          <div className="Dashbuttons2">
            {buttons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button)}
                className={activePage === button.id ? "active" : ""}
              >
                <img
                  src={button.icon}
                  alt={button.label}
                  style={button.iconStyle || {}}
                />
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard2">
        <div className="dashboard2-1-outer">
        <div className="dashboard2-1">
          <h4>Your Location: {location || "Loading..."}</h4>
          <div className="logout-container">
            <p onClick={handleLogout}>
              <img src="logout.png" alt="logout" className="logout-img" />
              <span className="custom-tooltip">Logout</span>
            </p>
          </div>
        </div>
        <button
        className={`user-nav-toggle ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
        </div>

        <div className="dashboard2-2">
          {/* Use the activePage state to render the correct component */}
          {pages[activePage]}
        </div>
      </div>

      {/* Modal */}
      {showNeighborModal && (
        <InviteNeighborsModal
          showModal={showNeighborModal}
          setShowModal={setShowNeighborModal}
        />
      )}
    </div>
  );
};

export default UserDashboard;

