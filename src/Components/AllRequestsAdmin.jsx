import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllRequestsAdmin.css';
import EditModal from './EditModal';

const AllRequestsAdmin = ({ selectedCategory }) => {
  const [requests, setRequests] = useState([]);
  const [userContacts, setUserContacts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [pdfUrls, setPdfUrls] = useState({}); // Store multiple PDFs if needed
  const [noDocumentsMessage, setNoDocumentsMessage] = useState({});

  useEffect(() => {
    const fetchRequestsAndContacts = async () => {
      try {
        const userToken = localStorage.getItem('token');
        const adminToken = localStorage.getItem('Token');
        const token = userToken || adminToken;

        if (!token) {
          throw new Error('No token found');
        }

        // Fetch requests
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL +'/adminrequests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedRequests = response.data;
        console.log('Requests:', fetchedRequests);


        const pdfPromises = fetchedRequests.map(async (request) => {
          if (request.document) {
            const pdfResponse = await axios.get(
              process.env.REACT_APP_BACKEND_URL +`/download-pdf/${request.id}`, // Use request.id
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Add Bearer token here
                  'Content-Type': 'application/json' // Add content type if necessary
                },
                responseType: 'blob',
              }
            );
            const pdfBlob = pdfResponse.data;
            const pdfUrl = URL.createObjectURL(pdfBlob);
            console.log(request.image);
            console.log(request.document);


            return { id: request.id, url: pdfUrl };
          }
          return { id: request.id, url: null }; // No document case
        });

        const pdfResults = await Promise.all(pdfPromises);
        const pdfUrlMap = {};
        const noDocuments = {};

        pdfResults.forEach((result) => {
          if (result.url) {
            pdfUrlMap[result.id] = result.url;
          } else {
            noDocuments[result.id]='No Documents Uploaded'; // Set the message for no documents
          }
        });

        setPdfUrls(pdfUrlMap);
        setNoDocumentsMessage(noDocuments); // Update state with no documents messages



        // Fetch contacts
        const contacts = {};
        for (const request of fetchedRequests) {
          if (request.userId) {
            const contactResponse = await axios.get(
              process.env.REACT_APP_BACKEND_URL +`/request-contact/${request.userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            contacts[request.userId] = contactResponse.data.contactNumber;
          } else {
            contacts[request.userId] = 'User ID is missing';
          }
        }

        setRequests(fetchedRequests);
        setUserContacts(contacts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsAndContacts();
  }, []);

  const handleEditClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openModal = (request) => {
    setSelectedReport(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
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

  const getPageTitle = () => {
    switch (selectedCategory) {
      case 'completed':
        return 'Completed Reports';
      case 'pending':
        return 'Pending Reports';
      case 'Dropped':
        return 'Dropped Reports';
      case 'scheduled':
        return 'Scheduled Reports';
      case 'not-scheduled':
        return 'Not-Scheduled Reports';
      case 'today':
        return "Today's Tasks";
      default:
        return 'All Reports';
    }
  };

  const getNoRequestsMessage = () => {
    switch (selectedCategory) {
      case 'completed':
        return 'No Completed Requests Found';
      case 'pending':
        return 'No Pending Requests Found';
        case 'Dropped':
          return'No Dropped Reports Found';
      case 'scheduled':
        return 'No Scheduled Requests Found';
      case 'not-scheduled':
        return 'No Not-Scheduled Requests Found';
      case 'today':
        return 'No Tasks for Today Found';
      default:
        return 'No Requests Found';
    }
  };

  const getReportCounts = () => {
    const totalCount = filteredRequests.length;
    const completedCount = filteredRequests.filter(r => r.status === 'Closed').length;

    // If a specific category is selected (not 'all'), show only that category count
    if (selectedCategory && selectedCategory !== 'all') {
      return (
        <span className="count-badge">{totalCount} {getPageTitle()}</span>
      );
    }

    // For 'all' or no category, show both total and completed
    return (
      <>
        <span className="count-badge">{totalCount} Reports</span>
        <span className="count-badge completed">{completedCount} Completed</span>
      </>
    );
  };

  const filteredRequests = requests.filter((request) => {
    console.log('Filtering request:', {
      id: request.id,
      status: request.status,
      schedule: request.schedule,
      selectedCategory
    });

    if (selectedCategory === 'completed') {
      return request.status === 'Closed';
    } else if (selectedCategory === 'pending') {
      return request.status === 'Open'; // Fixed: Use 'Open' instead of 'open'
    } else if (selectedCategory === 'Dropped'){
      return request.status === 'Dropped';
    }else if (selectedCategory === 'scheduled') {
      const hasSchedule = request.schedule && request.schedule !== null && request.schedule !== '';
      const isOpen = request.status === 'Open';
      console.log('Scheduled filter:', { hasSchedule, isOpen, schedule: request.schedule });
      return isOpen && hasSchedule; // Fixed: Use 'Open' instead of 'open'
    } else if (selectedCategory === 'not-scheduled') {
      const hasNoSchedule = !request.schedule || request.schedule === null || request.schedule === '';
      const isOpen = request.status === 'Open';
      return isOpen && hasNoSchedule; // Fixed: Use 'Open' instead of 'open'
    } else if (selectedCategory === 'today') {
      const today = new Date();
      if (!request.schedule) return false; // Handle null schedule
      const scheduleDate = new Date(request.schedule);
      return (
        request.status === 'Open' && // Fixed: Use 'Open' instead of 'open'
        scheduleDate.toDateString() === today.toDateString()
      );
    }
    return true;
  });

  console.log('Filtered requests count:', filteredRequests.length);
  console.log('Selected category:', selectedCategory);

  return (
    <div className='allrequests'>
      <div className="page-header">
        <h1 className="page-title">{getPageTitle()}</h1>
        <p className="page-subtitle">Manage and review all submitted reports</p>
        <div className="reports-count">
          {getReportCounts()}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="no-reports">
          <div className="no-reports-icon">📋</div>
          <h3>{getNoRequestsMessage()}</h3>
          <p>No reports match the current filter criteria.</p>
        </div>
      ) : (
        <div className='reports-grid'>
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className='report-card admin-report-card'
              onClick={() => openModal(request)}
            >
              <div className='card-image'>
                {request.image ? (
                  <img src={process.env.REACT_APP_BACKEND_URL +`/${request.image}`} alt="Report" />
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
                    <span className='detail-icon'>👤</span>
                    <span className='detail-text'>{request.name}</span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-icon'>📞</span>
                    <span className='detail-text'>{userContacts[request.userId] || 'Loading...'}</span>
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

                {/* <div className='card-footer admin-card-footer'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(request);
                    }}
                    className='edit-btn'
                  >
                    ✏️ Edit
                  </button>
                  <span className='view-details'>Click to view details →</span>
                </div> */}
              </div>
            </div>

          ))}
        </div>
      )}

      {/* Enhanced Modal with All Admin Details */}
      {showModal && selectedReport && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content admin-modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <div className='modal-image'>
                {selectedReport.image ? (
                  <img src={process.env.REACT_APP_BACKEND_URL +`/${selectedReport.image}`} alt="Report" />
                ) : (
                  <div className="modal-no-image">
                    <span>📷</span>
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
              <button className='modal-close' onClick={closeModal}>×</button>
            </div>

            <div className='modal-body admin-modal-body'>
              <div className='modal-title-section'>
                <h2>{selectedReport.issue}</h2>
                <button
                  onClick={() => handleEditClick(selectedReport)}
                  className='modal-edit-btn'
                >
                  ✏️ Edit Report
                </button>
              </div>

              <div className='modal-details admin-modal-details'>
                <div className='detail-row'>
                  <span className='detail-label'>Status:</span>
                  <span
                    className='status-badge modal-status'
                    style={{ backgroundColor: getStatusColor(selectedReport.status) }}
                  >
                    {selectedReport.status}
                  </span>
                </div>

                <div className='detail-row'>
                  <span className='detail-label'>Location:</span>
                  <span className='detail-value'>{selectedReport.location}</span>
                </div>

                <div className='detail-row'>
                  <span className='detail-label'>Tehsil:</span>
                  <span className='detail-value'>{selectedReport.tehsil}</span>
                </div>

                <div className='detail-row'>
                  <span className='detail-label'>Reporter Name:</span>
                  <span className='detail-value'>{selectedReport.name}</span>
                </div>

                <div className='detail-row'>
                  <span className='detail-label'>Contact Number:</span>
                  <span className='detail-value'>{userContacts[selectedReport.userId] || 'Loading...'}</span>
                </div>

                <div className='detail-row'>
                  <span className='detail-label'>Reported On:</span>
                  <span className='detail-value'>{formatDate(selectedReport.created_at)}</span>
                </div>

                {selectedReport.schedule && (
                  <div className='detail-row'>
                    <span className='detail-label'>Scheduled:</span>
                    <span className='detail-value'>{formatDate(selectedReport.schedule)}</span>
                  </div>
                )}

                <div className='detail-row'>
                  <span className='detail-label'>Document:</span>
                  <span className='detail-value'>
                    {selectedReport.document ? (
                      <a
                        href={process.env.REACT_APP_BACKEND_URL +`/${selectedReport.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='document-link'
                      >
                        📄 View Document
                      </a>
                    ) : (
                      <span className='no-document'>
                        {noDocumentsMessage[selectedReport.id] || 'No document available'}
                      </span>
                    )}
                  </span>
                </div>

                <div className='detail-row description-row'>
                  <span className='detail-label'>Description:</span>
                  <p className='detail-description'>{selectedReport.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keep the Edit Modal */}
      {selectedReport && (
        <EditModal
          show={showModal && selectedReport}
          onClose={handleCloseModal}
          report={selectedReport}
        />
      )}
    </div>
  );
};

export default AllRequestsAdmin;
