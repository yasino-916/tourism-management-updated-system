import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './visitor.css';
import { Link } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';

export default function VisitorDashboard() {
  const [summary, setSummary] = useState({
    upcomingVisits: 0,
    pendingRequests: 0,
    completedVisits: 0
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('visitor_user'));
    if (userData) {
        setUser(userData);
        visitorService.getHistory(userData.user_id).then(requests => {
            if (!Array.isArray(requests)) {
                console.error("VisitorDashboard: Expected array, got", requests);
                return;
            }
            setSummary({
                upcomingVisits: requests.filter(r => r.request_status === 'approved').length,
                pendingRequests: requests.filter(r => r.request_status === 'pending').length,
                completedVisits: requests.filter(r => r.request_status === 'completed').length
            });
        }).catch(console.error);
    }
  }, []);

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Welcome, {user ? user.first_name : 'Visitor'}!</h1>
          
          {user && (
            <div className="dashboard-profile-display" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
              <ThemeToggle />
              <div style={{
                width: '60px', 
                height: '60px', 
                margin: '5px',
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '2px solid #fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundImage: user.image ? `url(${user.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#e6f7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#1890ff'
              }}>
                {!user.image && user.first_name.charAt(0)}
              </div>
            </div>
          )}
        </header>

        <section className="visitor-cards">
          <div className="card">
            <h3>Upcoming Visits</h3>
            <div className="card-value">{summary.upcomingVisits}</div>
          </div>
          <div className="card">
            <h3>Pending Requests</h3>
            <div className="card-value">{summary.pendingRequests}</div>
          </div>
          <div className="card">
            <h3>Completed Visits</h3>
            <div className="card-value">{summary.completedVisits}</div>
          </div>
        </section>

        <section className="mt-4">
          <h2>Quick Actions</h2>
          <div className="d-flex gap-3 mt-3">
            <Link to="/visitor/sites" className="btn btn-primary">Explore Sites</Link>
            <Link to="/visitor/history" className="btn btn-outline-primary">View History</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
