import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import './guide.css';
import { guideService } from '../../services/guideService';
import UserProfileMenu from '../common/UserProfileMenu';
import NotificationDropdown from '../common/NotificationDropdown';

export default function GuideDashboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    completed: 0
  });
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      guideService.getAssignedRequests(userData.user_id).then(requests => {
        const today = new Date().toISOString().split('T')[0];
        setStats({
          pending: requests.filter(r => ['pending', 'approved', 'assigned'].includes(r.request_status)).length,
          today: requests.filter(r => r.request_status === 'accepted_by_guide').length,
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
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{t('welcome_back')}, {user ? user.first_name : 'Site Agent'}</h1>
            <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>{t('dash_overview_msg')}</p>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeToggle />
            <NotificationDropdown userType="guide" />
            <UserProfileMenu userType="guide" />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#fa8c16' }}>{t('dash_pending_requests')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pending}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('dash_msg_waiting')}</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#1890ff' }}>Scheduled Tours</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.today}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>All upcoming tours</p>
          </div>
          <div className="guide-card">
            <h3 style={{ margin: '0 0 10px', color: '#52c41a' }}>{t('dash_completed')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.completed}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('dash_msg_finished')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
