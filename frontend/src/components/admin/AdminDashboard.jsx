import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import './admin.css';
import { getSummary, getRequests, getPayments, createSite, createUser, getNotifications, markNotificationRead } from './adminService';
import AddSiteModal from './AddSiteModal';
import AddUserModal from './AddUserModal';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserType, setAddUserType] = useState('site_agent');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    getNotifications().then(data => {
      const mapped = data.map(n => ({
        id: n.notification_id,
        title: n.title,
        message: n.message,
        read: Number(n.is_read) === 1,
        created_at: n.created_at,
        tone: n.type === 'payment' || n.type === 'success' ? 'success' : (n.type === 'guide_request' || n.type === 'warning' ? 'warning' : 'info')
      }));
      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    }).catch(console.error);
  };

  const refresh = () => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    loadNotifications();
  };

  const markAsRead = (id) => {
    markNotificationRead(id).then(() => {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    });
  };

  const markAllAsRead = () => {
    // TODO: Implement bulk mark read
  };

  const onUserCreated = (user) => { refresh(); };

  const formatStatus = (status) => {
    if (status === 'accepted_by_guide') return 'Accepted';
    return status;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <div className="admin-actions">
            <button className="btn-outline" onClick={() => { setAddUserType('site_agent'); setShowAddUser(true); }}>Add Site Agent</button>
            <button className="btn-outline" onClick={() => { setAddUserType('researcher'); setShowAddUser(true); }}>Add Researcher</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '1.2rem',
                  position: 'relative'
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ff4d4f',
                    color: 'white',
                    fontSize: '0.7rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '350px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  border: '1px solid #eee',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#333' }}>
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No notifications</div>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {notifications.map(notif => (
                        <li
                          key={notif.id}
                          style={{
                            padding: '12px 15px',
                            borderBottom: '1px solid #f5f5f5',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            backgroundColor: notif.read ? '#fff' : '#f5f9ff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: notif.tone === 'success' ? '#52c41a' : '#fa8c16'
                              }}></span>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{notif.title}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {!notif.read && (
                                <button
                                  className="btn-sm"
                                  style={{ background: '#e0f2fe', color: '#0ea5e9', border: '1px solid #bae6fd' }}
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>{notif.message}</div>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(notif.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {summary ? (
          <section className="admin-cards">
            <div className="card">
              <h3>Total Users</h3>
              <div className="card-value">{summary.totalUsers}</div>
            </div>
            <div className="card">
              <h3>Total Sites</h3>
              <div className="card-value">{summary.totalSites}</div>
            </div>
            <div className="card">
              <h3>Total Visits</h3>
              <div className="card-value">{summary.totalVisits}</div>
            </div>
            <div className="card">
              <h3>Payments</h3>
              <div className="card-value">{summary.totalPayments}</div>
            </div>
          </section>
        ) : (
          <LoadingSpinner />
        )}
      </main>
      {showAddUser && <AddUserModal defaultType={addUserType} onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
    </div>
  );
}
