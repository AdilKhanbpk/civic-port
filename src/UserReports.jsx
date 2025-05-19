import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './UserReports.css';

const UserReports = () => {


    const [location, setLocation] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        const fetchUserRequests = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await axios.get(`http://localhost:4000/user-requests/${userId}`);
                console.log('Fetching requests for userId:', userId);
                setUserRequests(response.data);
            } catch (error) {
                console.error('Error fetching user requests:', error);
            }
        };
        fetchUserRequests();
    }, []);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            axios.get(`http://localhost:4000/user/${userEmail}`)
                .then(response => {
                    const { First_Name, Last_Name, Location } = response.data;
                    setLocation(Location);
                    setFullName(`${First_Name} ${Last_Name}`);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    navigate('/signin');
                });
        } else {
            navigate('/signin');
        }
    }, [navigate]);

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const overallReports = userRequests.length;
    const completedReports = userRequests.filter(request => request.status === 'Closed').length;

    return (
        <div className="userrequests">
            <h2 className="userrequests-title">
                Your Reports ({overallReports})
            </h2>

            <div className="allreports">
                {userRequests.length === 0 ? (
                    <div className="no-requests">
                        <h3>No requests found</h3>
                        <p>You haven't submitted any reports yet.</p>
                    </div>
                ) : (
                    <ul>
                        {userRequests.map(request => (
                            <li key={request.id}>
                                <div className="allcontent">
                                    <div className="imag12">
                                        {request.image ? (
                                            <img
                                                src={`http://localhost:4000/${request.image}`}
                                                alt="Request"
                                            />
                                        ) : (
                                            <div className="no-image">
                                                <span>No Image Available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="reqcontent">
                                        <div className="titleand">
                                            <h3>{request.issue}</h3>
                                            <p className={request.status.toLowerCase()}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </p>
                                        </div>

                                        <div className="request-details">
                                            <p><strong>Location:</strong> {request.location}</p>
                                            <p><strong>Reported On:</strong> {formatDate(request.created_at)}</p>

                                            <div className="scheduleon">
                                                <strong>Scheduled On:</strong>
                                                <span className={!request.schedule ? 'not-scheduled' : ''}>
                                                    {request.schedule ? formatDate(request.schedule) : 'Not Scheduled Yet'}
                                                </span>
                                            </div>

                                            <div className="description-section">
                                                <strong>Description:</strong>
                                                <p>{request.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
        // <div>
        //     <div className="logoandlogout">
        //       <Logo />
        //       <div className="location2">
        //         <h3 onClick={handleLogout}>Log Out</h3>
        //       </div>
        //     </div>
        //     <div className="locationdiv">
        //         <div className="userlocation1">
        //             <h1>Your Location</h1>
        //             <h3 className="location">{location}</h3>
        //         </div>
        //         <div className="reportsinfo">
        //             <div className="reportsnumber"><p>Your Reports Count :</p> <p className="Noofreports"> {overallReports}</p></div>
        //             <div className="reportscompleted"><p>Completed reports :</p> <p className="compreports"> {completedReports}</p></div>
        //         </div>
        //     </div>
        //     <div className="profilemain">
        //         <div className="profileinfo">
        //             <div className="profilename">
        //                 <img src="profile22.jfif" alt="" />
        //                 <h1>{fullName}</h1>
        //             </div>
        //             <div className="allreports">
        //                 {userRequests.length === 0 ? (
        //                     <h3 className="noreq">No requests found.</h3>
        //                 ) : (
        //                     <ul>
        //                         {userRequests.map(request => (
        //                             <li key={request.id}>
        //                                 <div className="allcontent">

        //                                    <div className="imag12">
        //                                    {request.image && <img src={`http://localhost:4000/uploads/${request.image}`} alt="Request" />}
        //                                    </div>
        //                                    <div className="reqcontent">
        //                                     <div className="titleand">
        //                                          <h3>{request.issue}</h3>
        //                                          <p className="openclose" style={{
        //                                             color: request.status === 'open' ? 'rgb(201, 72, 12)' : 'green',
        //                                             fontSize:"2.5vw",
        //                                             }}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</p>
        //                                    </div>
        //                                    <p><strong>Location:</strong> {request.location}</p>
        //                                    <p><strong>Reported On :</strong> {formatDate(request.created_at)}</p>
        //                                    <p className="scheduleon"><strong>Scheduled On :</strong> {request.schedule ? formatDate(request.schedule) : 'Not Scheduled Yet'}</p>
        //                                    <p><strong>Description:</strong> {request.description}</p>
        //                                    <br /> <br /><hr /><br />
        //                                    </div>
        //                                 </div>
        //                             </li>

        //                         ))}
        //                     </ul>
        //                 )}
        //             </div>
        //         </div>

        //     </div>
        //     <Footer />
        // </div>
};

export default UserReports;
