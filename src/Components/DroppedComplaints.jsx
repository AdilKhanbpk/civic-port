import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { supabase } from '../supabaseClient.js';
import './AllRequests.css';

const DroppedComplaints = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchDroppedRequests = async () => {
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dropped requests...');

        // Fetch dropped requests directly from Supabase
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('status', 'Dropped')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched dropped requests:', data);
        setRequests(data || []);
      } catch (error) {
        console.error('Error fetching dropped requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDroppedRequests();
  }, [user, session]);

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

  return (
    <div className='allrequests'>
      <div className="page-header">
        <h1 className="page-title">Dropped Reports</h1>
        <p className="page-subtitle">View reports that have been dropped or cancelled</p>
        <div className="reports-count">
          <span className="count-badge dropped">{requests.length} Dropped Reports</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dropped reports...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="no-reports">
          <div className="no-reports-icon">🗑️</div>
          <h3>No Dropped Reports Found</h3>
          <p>There are currently no dropped reports in the system.</p>
        </div>
      ) : (
        <div className='reports-grid'>
          {requests.map((request) => (
            <div
              key={request.id}
              className='report-card'
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
                    <span className='detail-icon'>📅</span>
                    <span className='detail-text'>{formatDate(request.created_at)}</span>
                  </div>
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
                  <img src={process.env.REACT_APP_BACKEND_URL +`/${selectedRequest.image}`} alt="Report" />
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
};

export default DroppedComplaints;