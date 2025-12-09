import React, { useEffect, useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './researcher.css';
import { getResearcherSummary } from './researcherService';

export default function ResearcherDashboard() {
  const [summary, setSummary] = useState({ totalSites: 0, pending: 0, approved: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('researcher_user') || '{}');

  useEffect(() => {
    if (user.user_id) {
      getResearcherSummary(user.user_id)
        .then(data => setSummary(data))
        .catch(err => console.error(err));
    }
  }, [user.user_id]);

  const handleUploadMedia = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File "${file.name}" selected for upload. (This is a simulation)`);
      }
    };
    input.click();
  };

  return (
    <div className="researcher-layout">
      <ResearcherSidebar />
      <main className="researcher-main">
        <header className="researcher-main-header">
          <div>
            <h1>Welcome back, {user.first_name || 'Researcher'}</h1>
            <p className="subtitle">Here's what's happening with your contributions today.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div className="notification-bell-container" style={{ position: 'relative' }}>
              <button
                className="notification-bell"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setUnreadCount(0);
                }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', position: 'relative' }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' }}>{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown" style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  width: '300px',
                  zIndex: 1000,
                  border: '1px solid #eee'
                }}>
                  <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Notifications</div>
                  <ul className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <li style={{ padding: '15px', textAlign: 'center', color: '#999' }}>No notifications</li>
                  </ul>
                </div>
              )}
            </div>
            <span className="date-badge">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section className="researcher-cards">
          <div className="card stat-card">
            <div className="stat-icon sites-icon">🏛️</div>
            <div className="stat-info">
              <h3>Total Sites</h3>
              <div className="card-value">{summary.totalSites}</div>
              <span className="stat-label">Contributed</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon pending-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending</h3>
              <div className="card-value" style={{ color: '#f39c12' }}>{summary.pending}</div>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon approved-icon">✅</div>
            <div className="stat-info">
              <h3>Approved</h3>
              <div className="card-value" style={{ color: '#27ae60' }}>{summary.approved}</div>
              <span className="stat-label">Published Live</span>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel quick-actions-panel">
            <h3>🚀 Quick Actions</h3>
            <div className="action-buttons">
              <button className="btn-primary action-btn" onClick={() => window.location.href = '/researcher/sites?action=add'}>
                <span className="icon">+</span> Add New Site
              </button>
              <button className="btn-outline action-btn" onClick={handleUploadMedia}>
                <span className="icon">📤</span> Upload Media
              </button>
              <button className="btn-outline action-btn" onClick={() => window.location.href = '/researcher/profile'}>
                <span className="icon">👤</span> Update Profile
              </button>
            </div>
          </section>

          <section className="panel notifications-panel">
            <h3>📅 Recent Activity</h3>
            <p style={{ color: '#666' }}>No recent activity to show.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
