import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './admin.css';
import { getSummary, getRequests, getPayments, createSite, createUser, getNotifications, markNotificationRead } from './adminService';
import AddSiteModal from './AddSiteModal';
import AddUserModal from './AddUserModal';
import UserProfileMenu from '../common/UserProfileMenu';

export default function AdminDashboard() {
  const { t } = useLanguage();
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
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    });
  };

  const markAllAsRead = () => {
    // TODO: Implement bulk mark read
  };

  const onUserCreated = (user) => { refresh(); };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <div className="admin-actions">
            <button className="btn-outline" onClick={() => { setAddUserType('site_agent'); setShowAddUser(true); }}>{t('dash_add_agent')}</button>
            <button className="btn-outline" onClick={() => { setAddUserType('researcher'); setShowAddUser(true); }}>{t('dash_add_researcher')}</button>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <button
                className="notification-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllAsRead();
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-count">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    {t('dash_notifications')}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>{t('dash_no_notifications')}</div>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {notifications.map(notif => (
                        <li
                          key={notif.id}
                          className={`notification-list-item ${!notif.read ? 'unread' : ''}`}
                        >
                          <div className="notification-title-row">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className={`notification-dot dot-${notif.tone}`}></span>
                              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{notif.title}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {!notif.read && (
                                <button
                                  className="btn-sm"
                                  style={{ background: 'var(--bg-primary)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  {t('dash_mark_read')}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="notification-msg">{notif.message}</div>
                          <div className="notification-time">{new Date(notif.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <UserProfileMenu userType="admin" />
          </div>
        </header>

        {summary ? (
          <section className="admin-cards">
            <div className="card">
              <h3>{t('dash_users')}</h3>
              <div className="card-value">{summary.totalUsers}</div>
            </div>
            <div className="card">
              <h3>{t('dash_sites')}</h3>
              <div className="card-value">{summary.totalSites}</div>
            </div>
            <div className="card">
              <h3>{t('dash_visits')}</h3>
              <div className="card-value">{summary.totalVisits}</div>
            </div>
            <div className="card">
              <h3>{t('dash_revenue')}</h3>
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
