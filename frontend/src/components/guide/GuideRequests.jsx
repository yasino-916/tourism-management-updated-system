import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        // Filter for requests that are assigned but not yet completed/cancelled
        // Or specifically ones waiting for guide acceptance if that's the flow
        // For now, show all active ones
        setRequests(data);
        setLoading(false);
      });
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const guideId = user?.user_id;

    if (window.confirm(`Are you sure you want to ${newStatus === 'accepted_by_guide' ? 'accept' : 'reject'} this request?`)) {
      try {
        await guideService.updateRequestStatus(requestId, newStatus, undefined, guideId);
        loadRequests();
      } catch (err) {
        console.error('Failed to update status:', err);
        alert('Failed to update status: ' + (err.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Assigned Requests</h1>
          <ThemeToggle />
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="guide-card">
            {requests.length === 0 ? (
              <p>No requests assigned to you at the moment.</p>
            ) : (
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Site</th>
                    <th>Date</th>
                    <th>Group Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.request_id}>
                      <td>{req.visitor_name}</td>
                      <td>{req.site_name}</td>
                      <td>{req.preferred_date}</td>
                      <td>{req.group_size || req.number_of_visitors}</td>
                      <td>
                        <span className={`status-badge status-${req.request_status}`}>
                          {req.request_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        {/* Logic: If status is 'assigned' (by admin), guide can Accept or Reject */}
                        {(req.request_status === 'assigned' || req.request_status === 'approved') && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              className="guide-btn btn-primary"
                              onClick={() => handleStatusChange(req.request_id, 'accepted_by_guide')}
                            >
                              Accept
                            </button>
                            <button
                              className="guide-btn btn-danger"
                              onClick={() => handleStatusChange(req.request_id, 'rejected_by_guide')}
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* If accepted, maybe mark as completed later? handled in schedule/reports usually */}
                        {req.request_status === 'accepted_by_guide' && (
                          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Accepted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
