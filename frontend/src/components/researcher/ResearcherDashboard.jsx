import React, { useEffect, useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './researcher.css';
import { getResearcherSummary } from './researcherService';
import UserProfileMenu from '../common/UserProfileMenu';

export default function ResearcherDashboard() {
  const { t } = useLanguage();
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
            <h1>{t('welcome_back')}, {user.first_name || 'Researcher'}</h1>
            <p className="subtitle">Here's what's happening with your contributions today.</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <div style={{ position: 'relative' }}>
              <button
                className="notification-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setUnreadCount(0);
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-count">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">{t('dash_notifications')}</div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    <li style={{ padding: '15px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {t('dash_no_notifications')}
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <span className="date-badge">{new Date().toLocaleDateString()}</span>
            <UserProfileMenu userType="researcher" />
          </div>
        </header>

        <section className="researcher-cards">
          <div className="card stat-card">
            <div className="stat-icon sites-icon">🏛️</div>
            <div className="stat-info">
              <h3>{t('dash_sites')}</h3>
              <div className="card-value">{summary.totalSites}</div>
              <span className="stat-label">Contributed</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon pending-icon">⏳</div>
            <div className="stat-info">
              <h3>{t('dash_pending')}</h3>
              <div className="card-value" style={{ color: '#f39c12' }}>{summary.pending}</div>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon approved-icon">✅</div>
            <div className="stat-info">
              <h3>{t('dash_approved')}</h3>
              <div className="card-value" style={{ color: '#27ae60' }}>{summary.approved}</div>
              <span className="stat-label">Published Live</span>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel quick-actions-panel">
            <h3>🚀 {t('dash_quick_actions')}</h3>
            <div className="action-buttons">
              <button className="btn-primary action-btn" onClick={() => window.location.href = '/researcher/sites?action=add'}>
                <span className="icon">+</span> {t('dash_add_site')}
              </button>
              <button className="btn-outline action-btn" onClick={handleUploadMedia}>
                <span className="icon">📤</span> {t('dash_upload_media')}
              </button>
              <button className="btn-outline action-btn" onClick={() => window.location.href = '/researcher/profile'}>
                <span className="icon">👤</span> {t('dash_update_profile')}
              </button>
            </div>
          </section>

          <section className="panel notifications-panel">
            <h3>📅 {t('dash_recent_activity')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
