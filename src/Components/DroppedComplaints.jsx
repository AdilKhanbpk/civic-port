import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './UserReports.css';

const DroppedComplaints = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDroppedRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch dropped requests from the backend
        const response = await axios.get('http://localhost:4000/api/requests/dropped', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching dropped requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDroppedRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <div className="userrequests">
      <div className="userrequests-title">
        <p>Total Dropped Requests: {requests.length}</p>
      </div>
      <div className="allreports">
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <h3 className="noreq" style={{marginLeft:'60px' , fontSize:'22px'}}>No Dropped Requests Found.</h3>
        ) : (
          <ul>
            {requests.map((request) => (
              <li key={request.id}>
                <div className="allcontent">
                  <div className="imag12">
                    {request.image && (
                      <img
                        src={`http://localhost:4000/uploads/${request.image}`}
                        alt="Request"
                      />
                    )}
                  </div>
                  <div className="reqcontent">
                    <div className="titleand">
                      <h3>{request.issue}</h3>
                      <p
                        className="openclose"
                        style={{
                          color:
                            request.status === 'open'
                              ? 'rgb(201, 72, 12)'
                              : request.status === 'Dropped'
                              ? 'red'
                              : 'green',
                          fontSize: '22px',
                          fontWeight: 'bold',
                          marginLeft: '8px',
                        }}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </p>
                    </div>
                    <p>
                      <strong>Location:</strong> {request.location}
                    </p>
                    <p>
                      <strong>Reported On:</strong> {formatDate(request.created_at)}
                    </p>
                    <p className="scheduleon">
                      <strong>Description:</strong> {request.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DroppedComplaints;