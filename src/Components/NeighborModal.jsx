import React, { useState } from 'react';
import './NeighborModal.css';

const InviteNeighborsModal = ({ showModal, setShowModal }) => {
  const [userEmail, setUserEmail] = useState('');
  const [neighborEmail, setNeighborEmail] = useState('');

  const handleInvite = async () => {
    try {
      const response = await fetch('/api/sendInvite', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, neighborEmail }),
      });

      if (response.ok) {
        alert('Invitation sent!');
        setShowModal(false); // Close modal on success
      } else {
        alert('Failed to send invitation.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false); // Correctly close the modal
  };

  return (
    <div className={`modal ${showModal ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2>Invite a Neighbor</h2>
          <input
            type="email"
            placeholder="Your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <input
            type="email"
            placeholder="Neighbor's Email"
            value={neighborEmail}
            onChange={(e) => setNeighborEmail(e.target.value)}
          />
          <div className='buttonss'>
            <button onClick={handleInvite}>Send Invite</button>
            <button onClick={handleClose}>Close</button> {/* This now closes the modal */}
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
    </div>
  );
};

export default InviteNeighborsModal;
