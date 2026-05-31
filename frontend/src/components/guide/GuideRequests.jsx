import React, { useState, useEffect } from 'react';
import GuideSidebar from './GuideSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';
import './guide.css';
import { guideService } from '../../services/guideService';
import { useLanguage } from '../../context/LanguageContext';

export default function GuideRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      guideService.getAssignedRequests(user.user_id).then(data => {
        setRequests(data);
        setLoading(false);
      });
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'accepted_by_guide': return t('status_accepted');
      case 'rejected_by_guide': return t('status_rejected_by_guide');
      case 'assigned': return t('status_assigned');
      case 'approved': return t('dash_approved');
      case 'pending': return t('dash_pending');
      case 'rejected': return t('status_rejected');
      default: return status.replace(/_/g, ' ');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const guideId = user?.user_id;

    if (window.confirm(t('msg_confirm_guide_action'))) {
      try {
        await guideService.updateRequestStatus(requestId, newStatus, undefined, guideId);
        loadRequests();
      } catch (err) {
        console.error('Failed to update status:', err);
        alert(t('msg_update_fail') + ': ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm(t('msg_confirm_delete') || 'Delete request?')) {
      try {
        await guideService.deleteRequest(requestId);
        loadRequests();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div className="guide-layout">
      <GuideSidebar />
      <main className="guide-main">
        <header className="guide-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('guide_assigned_requests')}</h1>
          <ThemeToggle />
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="guide-card">
            {requests.length === 0 ? (
              <p>{t('msg_no_assigned_requests')}</p>
            ) : (
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>{t('th_visitor')}</th>
                    <th>{t('th_site_name')}</th>
                    <th>{t('th_date')}</th>
                    <th>{t('th_group_size')}</th>
                    <th>{t('th_status')}</th>
                    <th>{t('th_actions')}</th>
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
                          {formatStatus(req.request_status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {(req.request_status === 'assigned' || req.request_status === 'approved') && (
                            <>
                              <button
                                className="btn-sm btn-success"
                                onClick={() => handleStatusChange(req.request_id, 'accepted_by_guide')}
                                title={t('status_accepted')}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {t('status_accepted')}
                              </button>
                              <button
                                className="btn-sm btn-outline-danger"
                                onClick={() => handleStatusChange(req.request_id, 'rejected_by_guide')}
                                title={t('btn_reject')}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                {t('btn_reject')}
                              </button>
                            </>
                          )}
                          {req.request_status === 'accepted_by_guide' && (
                            <span className="badge bg-success" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '5px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                              {t('status_accepted')}
                            </span>
                          )}
                          <button
                            className="btn-sm btn-icon-danger"
                            onClick={() => handleDelete(req.request_id)}
                            title={t('btn_delete') || 'Delete'}
                            style={{
                              background: 'none', border: '1px solid #fee2e2', color: '#dc2626',
                              borderRadius: '6px', padding: '6px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
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
