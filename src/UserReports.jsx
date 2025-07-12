import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.js";
import { supabase } from "./supabaseClient.js";
import './Components/AllRequests.css';

const UserReports = () => {
    const [location, setLocation] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    const [userRequests, setUserRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, session } = useAuth();

    useEffect(() => {
        const fetchUserRequests = async () => {
            if (!user) return;

            try {
                // Fetch requests directly from Supabase
                const { data, error } = await supabase
                    .from('requests')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                console.log('Fetching requests for userId:', user.id);
                setUserRequests(data || []);
            } catch (error) {
                console.error('Error fetching user requests:', error);
            }
        };

        fetchUserRequests();
    }, [user]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;

            try {
                // Fetch user profile from Supabase
                const { data: profile, error } = await supabase
                    .from('usersdb')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (profile) {
                    setLocation(profile.location || 'Not specified');
                    setFullName(`${profile.first_name} ${profile.last_name}`);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return '#f59e0b'; // Amber
            case 'In Progress':
                return '#3b82f6'; // Blue
            case 'Closed':
                return '#10b981'; // Green
            case 'Dropped':
                return '#ef4444'; // Red
            default:
                return '#6b7280'; // Gray
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const overallReports = userRequests.length;
    const completedReports = userRequests.filter(request => request.status === 'Closed').length;

    return (
        <div className='allrequests'>
            <div className="page-header">
                <h1 className="page-title">My Reports</h1>
                <p className="page-subtitle">View and manage your submitted reports</p>
                <div className="reports-count">
                    <span className="count-badge">{overallReports} Reports</span>
                    <span className="count-badge completed">{completedReports} Completed</span>
                </div>
            </div>

            {userRequests.length === 0 ? (
                <div className="no-reports">
                    <div className="no-reports-icon">📋</div>
                    <h3>No Reports Found</h3>
                    <p>You haven't submitted any reports yet. <br/>Click "New Request" to submit your first report.</p>
                </div>
            ) : (
                <div className='reports-grid'>
                    {userRequests.map((request) => (
                        <div
                            key={request.id}
                            className='report-card'
                            onClick={() => openModal(request)}
                        >
                            <div className='card-image'>
                                {request.image ? (
                                    <img src={`http://localhost:4000/${request.image}`} alt="Report" />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <span>📷</span>
                                        <p>No Image</p>
                                    </div>
                                )}
                            </div>

                            <div className='card-content'>
                                <div className='card-header'>
                                    <h3 className='card-title'>{request.issue}</h3>
                                    <span
                                        className='status-badge'
                                        style={{ backgroundColor: getStatusColor(request.status) }}
                                    >
                                        {request.status}
                                    </span>
                                </div>

                                <div className='card-details'>
                                    <div className='detail-item'>
                                        <span className='detail-icon'>📍</span>
                                        <span className='detail-text'>{request.location}</span>
                                    </div>
                                    <div className='detail-item'>
                                        <span className='detail-icon'>🏛️</span>
                                        <span className='detail-text'>{request.tehsil}</span>
                                    </div>
                                    <div className='detail-item'>
                                        <span className='detail-icon'>📅</span>
                                        <span className='detail-text'>{formatDate(request.created_at)}</span>
                                    </div>
                                    {request.schedule && (
                                        <div className='detail-item'>
                                            <span className='detail-icon'>⏰</span>
                                            <span className='detail-text'>Scheduled: {formatDate(request.schedule)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className='card-description'>
                                    <p>{truncateText(request.description, 80)}</p>
                                </div>

                                <div className='card-footer'>
                                    <span className='view-details'>Click to view details →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedRequest && (
                <div className='modal-overlay' onClick={closeModal}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='modal-header'>
                            <div className='modal-image'>
                                {selectedRequest.image ? (
                                    <img src={`http://localhost:4000/${selectedRequest.image}`} alt="Report" />
                                ) : (
                                    <div className="modal-no-image">
                                        <span>📷</span>
                                        <p>No Image Available</p>
                                    </div>
                                )}
                            </div>
                            <button className='modal-close' onClick={closeModal}>×</button>
                        </div>

                        <div className='modal-body'>
                            <div className='modal-title-section'>
                                <h2>{selectedRequest.issue}</h2>
                            </div>

                            <div className='modal-details'>
                                <div className='detail-row'>
                                    <span className='detail-label'>Status:</span>
                                    <span
                                        className='status-badge modal-status'
                                        style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                                    >
                                        {selectedRequest.status}
                                    </span>
                                </div>

                                <div className='detail-row'>
                                    <span className='detail-label'>Location:</span>
                                    <span className='detail-value'>{selectedRequest.location}</span>
                                </div>

                                <div className='detail-row'>
                                    <span className='detail-label'>Tehsil:</span>
                                    <span className='detail-value'>{selectedRequest.tehsil}</span>
                                </div>

                                <div className='detail-row'>
                                    <span className='detail-label'>Reported On:</span>
                                    <span className='detail-value'>{formatDate(selectedRequest.created_at)}</span>
                                </div>

                                {selectedRequest.schedule && (
                                    <div className='detail-row'>
                                        <span className='detail-label'>Scheduled:</span>
                                        <span className='detail-value'>{formatDate(selectedRequest.schedule)}</span>
                                    </div>
                                )}

                                <div className='detail-row description-row'>
                                    <span className='detail-label'>Description:</span>
                                    <p className='detail-description'>{selectedRequest.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
