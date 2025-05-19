import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllRequests.css'; 

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const usertoken = localStorage.getItem('token'); //Handling Request From User Panel
        const admintoken = localStorage.getItem('Token') //handling Request From Admin panel

        const token = usertoken || admintoken;  
        const response = await axios.get('http://localhost:4000/requests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };


  return (
    <div className='allrequests'>
      <div className="userrequests-title">
            <p>OverAll Reports on Civic Portal</p>
           </div>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p style={{marginLeft:'30px' , fontSize:'22px', fontWeight:'bold'}}>There are no requests reported.</p>
      ) : (
        <div className='requests-list'>
          <ul>
            {requests.map((request) => (
              <li key={request.id} className='request-item'>
                <div className='imag'>
                  {request.image && <img src={`http://localhost:4000/${request.image}`} alt="Request" />}
                </div>
                <div className='metadata'>
                  <div className='titleand'>
                    <h3>{request.issue}</h3>
                    <p className='status' style={{
                      color:
                        request.status === 'open' ? 'rgb(201, 72, 12)' :
                        request.status === 'Dropped' ? 'red' : 'green',
                      fontSize: '22px',
                      fontWeight: 'bold',
                    }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                  </div>
                  <p><strong>Tehsil:</strong> {request.tehsil}</p>
                  <p><strong>Location:</strong> {request.location}</p>
                  <p><strong>Reported On:</strong> {formatDate(request.created_at)}</p>
                  <p><strong>Description:</strong> {request.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
};

export default AllRequests;