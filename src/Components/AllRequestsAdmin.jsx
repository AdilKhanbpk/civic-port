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
        const response = await axios.get('http://localhost:4000/adminrequests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedRequests = response.data;
        console.log('Requests:', fetchedRequests);


        const pdfPromises = fetchedRequests.map(async (request) => {
          if (request.document) {
            const pdfResponse = await axios.get(
              `http://localhost:4000/download-pdf/${request.id}`, // Use request.id
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
              `http://localhost:4000/request-contact/${request.userId}`,
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
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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

  const filteredRequests = requests.filter((request) => {
    if (selectedCategory === 'completed') {
      return request.status === 'Closed';
    } else if (selectedCategory === 'pending') {
      return request.status === 'open';
    } else if (selectedCategory === 'Dropped'){
      return request.status === 'Dropped';
    }else if (selectedCategory === 'scheduled') {
      return request.status === 'open' && request.schedule;
    } else if (selectedCategory === 'not-scheduled') {
      return request.status === 'open' && !request.schedule;
    } else if (selectedCategory === 'today') {
      const today = new Date();
      const scheduleDate = new Date(request.schedule);
      return (
        request.status === 'open' &&
        scheduleDate.toDateString() === today.toDateString()
      );
    }
    return true;
  });

  return (
    <div>
      <div className='allrequests1' style={{fontFamily:''}}>
        {loading ? (
          <p>Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className='norequest'>{getNoRequestsMessage()}</p>
        ) : (
          <div className='requests-list1' style={{ width: '100%' }}>
            <ul>
              {filteredRequests.map((request) => (
                <li key={request.id} className='request-item1'>
                  <div className='fullRequest'>
                    <div className='imag1'>
                      {request.image ? (
                        <img src={`http://localhost:4000/${request.image}`} alt="Issue" />
                      ) : (
                        <div className="no-image">
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
                    <div className='metadata1'>
                      <div className='titleandedit'>
                        <h3>{request.issue}</h3>
                        <button
                          onClick={() => handleEditClick(request)}
                          className='editbutton'
                        >
                          Edit
                        </button>
                      </div>

                      <div className="request-details">
                        <div className="detail-item">
                          <div className="detail-icon location-icon"></div>
                          <p><strong>Location:</strong> {request.location}</p>
                        </div>

                        <div className="detail-item">
                          <div className="detail-icon status-icon"></div>
                          <div className="status-container">
                            <strong>Status:</strong>
                            <span className={`status-badge ${request.status.toLowerCase()}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="request-dates">
                        <div className="date-item">
                          <div className="date-icon reported-icon"></div>
                          <p><strong>Reported:</strong> {formatDate(request.created_at)}</p>
                        </div>

                        <div className="date-item">
                          <div className="date-icon scheduled-icon"></div>
                          <p>
                            <strong>Scheduled:</strong>
                            <span className={!request.schedule ? 'not-scheduled' : ''}>
                              {request.schedule ? formatDate(request.schedule) : 'Not Scheduled Yet'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="reporter-section">
                        <div className="reporter-header">
                          <div className="reporter-icon"></div>
                          <h4>Reporter Information</h4>
                        </div>
                        <div className="reporter-details">
                          <p><strong>Name:</strong> {request.name}</p>
                          <p><strong>Contact:</strong> {userContacts[request.userId] || 'Fetching...'}</p>
                        </div>
                      </div>

                      <div className="document-section">
                        <div className="document-header">
                          <div className="document-icon"></div>
                          <h4>Documents</h4>
                        </div>
                        <div className="document-content">
                          {request.document ? (
                            <a
                              className="document-link"
                              href={`http://localhost:4000/${request.document}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          ) : (
                            <p className="no-document">
                              {noDocumentsMessage[request.id] || 'No document available'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="description-section">
                        <div className="description-header">
                          <div className="description-icon"></div>
                          <h4>Description</h4>
                        </div>
                        <p className="description-content">{request.description}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Render the modal outside the loop as a single instance */}
      {selectedReport && (
        <EditModal
          show={showModal}
          onClose={handleCloseModal}
          report={selectedReport}
        />
      )}
    </div>
  );
};

export default AllRequestsAdmin;
