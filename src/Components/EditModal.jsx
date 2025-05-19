import React, { useState, useEffect } from 'react';
import './EditModal.css';
import axios from 'axios';

const EditModal = ({ show, onClose, report }) => {
  // Initialize state at the top level - before any conditionals
  const [status, setStatus] = useState('open');
  const [schedule, setSchedule] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update state when report changes
  useEffect(() => {
    if (report) {
      setStatus(report?.status || 'open');
      setSchedule(report?.schedule || '');
    }
  }, [report]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('click', closeDropdown);
    }

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [showDropdown]);

  // If not showing or no report, don't render anything
  if (!show || !report) {
    return null;
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // Handle save action
  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`http://localhost:4000/reports/${report.id}`, {
        status,
        schedule,
      });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating report:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setShowDropdown(false);
  };

  // Handle dropdown toggle
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowDropdown(!showDropdown);
  };

  // Render the modal
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="imag2">
          {report.image ? (
            <img
              src={`http://localhost:4000/${report.image}`}
              alt="Request"
            />
          ) : (
            <div className="no-image">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="modal-content2">
          <div className="modal-header">
            <h2>{report.issue}</h2>
          </div>

          <div className="modal-body">
            <div className="info-section">
              <div className="info-item">
                <div className="info-icon location-icon"></div>
                <p><strong>Location:</strong> {report.location}</p>
              </div>

              <div className="info-row">
                <div className="info-item status-item">
                  <div className="info-icon status-icon"></div>
                  <div className="status-selector">
                    <strong>Status:</strong>
                    <div className="custom-select">
                      <div
                        className="select-selected"
                        onClick={toggleDropdown}
                      >
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                      {showDropdown && (
                        <div className="select-items">
                          <div
                            className={status === 'open' ? 'same-as-selected' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange('open');
                            }}
                          >
                            <span className="status-badge open">Open</span>
                          </div>
                          <div
                            className={status === 'Closed' ? 'same-as-selected' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange('Closed');
                            }}
                          >
                            <span className="status-badge closed">Closed</span>
                          </div>
                          <div
                            className={status === 'Dropped' ? 'same-as-selected' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange('Dropped');
                            }}
                          >
                            <span className="status-badge dropped">Dropped</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon user-icon"></div>
                  <p><strong>Reported By:</strong> {report.name}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon date-icon"></div>
                <p><strong>Reported On:</strong> {formatDate(report.created_at)}</p>
              </div>

              <div className="info-item description-item">
                <div className="info-icon description-icon"></div>
                <div>
                  <strong>Description:</strong>
                  <p className="description-text">{report.description}</p>
                </div>
              </div>
            </div>

            <div className="schedule-section">
              <div className="schedule-header">
                <div className="info-icon calendar-icon"></div>
                <h3>Schedule</h3>
              </div>

              <div className="schedule-content">
                <div className="date-picker">
                  <label htmlFor="schedule-date">Schedule On:</label>
                  <input
                    id="schedule-date"
                    type="date"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSave}
                  className={`savebutton ${isSaving ? 'saving' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
