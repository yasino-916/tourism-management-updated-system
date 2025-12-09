import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';

export default function GuideDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    completed: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('guide_user'));
    if (userData) {
      setUser(userData);
      guideService.getAssignedRequests(userData.user_id).then(requests => {
        const today = new Date().toISOString().split('T')[0];
        setStats({
          pending: requests.filter(r => r.request_status === 'approved' || r.request_status === 'assigned').length,
          today: requests.filter(r => r.preferred_date === today && r.request_status === 'accepted_by_guide').length,
          completed: requests.filter(r => r.request_status === 'completed').length
        });
      });
    }
  }, []);

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Welcome, {user ? user.first_name : 'Site Agent'}</h1>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Here is your daily overview.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  position: 'relative'
                }}
                title="Notifications"
              >
                🔔
                {unread && <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  background: '#ff4d4f',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}></span>}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: '-10px',
                  width: '320px',
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '0',
                  zIndex: 1000,
                  border: '1px solid #eee',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fafafa' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>Notifications</h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <li style={{ padding: '15px', textAlign: 'center', color: '#999' }}>No notifications</li>
                    ) : (
                      notifications.map(notif => (
                        <li key={notif.id} style={{ padding: '15px', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem', display: 'flex', gap: '10px' }}>
                          <div style={{ fontSize: '1.2rem' }}>{notif.icon}</div>
                          <div>
                            <strong style={{ display: 'block', marginBottom: '4px', color: '#1890ff' }}>{notif.title}</strong>
                            <span style={{ color: '#666' }}>{notif.message}</span>
                            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '5px' }}>{notif.time}</div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                    <button
                      onClick={() => { setUnread(false); setShowNotifications(false); }}
                      style={{ background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {user && user.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1890ff', color: 'white' }}>
                  {user ? user.first_name.charAt(0) : 'G'}
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#fa8c16' }}>Pending Requests</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pending}</div>
            <p style={{ margin: 0, color: '#888' }}>Waiting for acceptance</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#1890ff' }}>Today's Tours</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.today}</div>
            <p style={{ margin: 0, color: '#888' }}>Scheduled for today</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#52c41a' }}>Completed</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.completed}</div>
            <p style={{ margin: 0, color: '#888' }}>Total tours finished</p>
          </div>
        </div>
      </main>
    </div>
  );
}
