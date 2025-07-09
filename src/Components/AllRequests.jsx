import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { supabase } from '../supabaseClient.js';
import './AllRequests.css';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !session) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching all requests...');

        // Fetch requests directly from Supabase
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched requests:', data);
        setRequests(data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, session]);

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
                        request.status === 'Open' ? 'rgb(201, 72, 12)' :
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