import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getNotifications, markNotificationRead, deleteNotification } from '../admin/adminService';

export default function NotificationDropdown({ userType }) {
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
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
        tone: n.notification_type === 'payment' || n.notification_type === 'success' ? 'success' :
          (n.notification_type === 'guide_request' || n.notification_type === 'warning' ? 'warning' : 'info')
      }));
      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    }).catch(err => console.error("Error loading notifications:", err));
  };

  const markAsRead = (id) => {
    markNotificationRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    });
  };

  const handleDeleteNotification = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this notification?")) {
      deleteNotification(id).then(() => {
        const wasUnread = !notifications.find(n => n.id === id)?.read;
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
      }).catch(err => console.error("Failed to delete notification", err));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications) {
        const notificationDropdown = document.querySelector('.notification-dropdown');
        const notificationBtn = document.querySelector('.notification-btn');

        if (notificationDropdown && notificationBtn && !notificationDropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="notification-btn"
        onClick={() => setShowNotifications(!showNotifications)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            {t('dash_notifications')}
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>{t('dash_no_notifications')}</div>
          ) : (
            <ul className="notification-list" style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.map(notif => (
                <li
                  key={notif.id}
                  className={`notification-list-item ${!notif.read ? 'unread' : ''}`}
                  style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}
                >
                  <div className="notification-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={`notification-dot dot-${notif.tone}`} style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', background: notif.tone === 'success' ? '#10b981' : (notif.tone === 'warning' ? '#f59e0b' : '#3b82f6') }}></span>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{notif.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!notif.read && (
                        <button
                          className="btn-sm"
                          style={{ background: 'var(--bg-primary)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)', padding: '2px 6px', fontSize: '0.75rem', borderRadius: '4px' }}
                          onClick={() => markAsRead(notif.id)}
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        className="btn-sm"
                        style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2rem', padding: '0 4px', cursor: 'pointer' }}
                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="notification-msg" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{notif.message}</div>
                  <div className="notification-time" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(notif.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
