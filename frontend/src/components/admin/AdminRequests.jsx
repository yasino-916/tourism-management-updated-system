import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getRequests, getPayments, approveRequest, rejectRequest, assignGuide, deleteRequest } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [guideIdInput, setGuideIdInput] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  const refresh = () => {
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    setAssigningId(null);
    setGuideIdInput('');
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'accepted_by_guide': return t('status_accepted');
      case 'rejected_by_guide': return t('status_rejected_by_guide');
      case 'assigned': return t('status_assigned');
      case 'approved': return t('dash_approved');
      case 'pending': return t('dash_pending');
      case 'rejected': return t('status_rejected');
      default: return status;
    }
  };

  const handleApprove = async (id) => {
    const hasVerifiedPayment = payments.some(p => p.request_id === id && p.payment_status === 'confirmed');
    if (!hasVerifiedPayment) {
      alert(t('msg_payment_not_verified'));
      return;
    }
    try { await approveRequest(id); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  const handleReject = async (id) => {
    try { await rejectRequest(id); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  const handleDelete = async (id) => {

    if (!window.confirm(t('msg_confirm_delete') || 'Are you sure you want to delete this request?')) return;
    try { await deleteRequest(id); refresh(); } catch (err) { alert((t('msg_delete_fail') || 'Delete failed') + ': ' + err.message); }
  };

  const startAssign = (id) => {
    setAssigningId(id);
    setGuideIdInput('');
  };

  const submitAssign = async (id) => {
    if (!guideIdInput) return;
    try { await assignGuide(id, { guide_id: parseInt(guideIdInput) }); refresh(); } catch (err) { alert(t('msg_update_fail') + ': ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('admin_visitor_requests')}</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>{t('th_id')}</th>
                <th>{t('th_visitor')}</th>
                <th>{t('th_site_name')}</th>
                <th>{t('th_date')}</th>
                <th>{t('th_group_size')}</th>
                <th>{t('th_status')}</th>
                <th>{t('th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.request_id}>
                  <td>{r.request_id}</td>
                  <td>{r.visitor_name}</td>
                  <td>{r.site_name}</td>
                  <td>{r.preferred_date}</td>
                  <td>{r.number_of_visitors}</td>
                  <td>{formatStatus(r.request_status)}</td>
                  <td>
                    <div className="action-buttons-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {r.request_status === 'pending' && (
                        <>
                          <button
                            className="btn-sm btn-success"
                            onClick={() => handleApprove(r.request_id)}
                            title={t('btn_approve')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </button>
                          <button
                            className="btn-sm btn-outline-danger"
                            onClick={() => handleReject(r.request_id)}
                            title={t('btn_reject')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </>
                      )}

                      {r.request_status === 'approved' && (
                        <>
                          {assigningId === r.request_id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8f9fa', padding: '4px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                              <input
                                type="number"
                                placeholder="ID"
                                value={guideIdInput}
                                onChange={e => setGuideIdInput(e.target.value)}
                                style={{ width: '50px', padding: '4px', margin: 0, fontSize: '0.8rem', border: '1px solid #ced4da', borderRadius: '3px' }}
                                autoFocus
                              />
                              <button
                                className="btn-sm btn-primary"
                                onClick={() => submitAssign(r.request_id)}
                                title={t('btn_save')}
                                style={{ padding: '4px 8px' }}
                              >
                                ✓
                              </button>
                              <button
                                className="btn-sm btn-ghost"
                                onClick={() => setAssigningId(null)}
                                style={{ padding: '4px 8px', color: '#6c757d' }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn-sm btn-outline-primary"
                              onClick={() => startAssign(r.request_id)}
                              title={t('btn_assign_agent')}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                              <span style={{ fontSize: '0.75rem' }}>{t('btn_assign_agent')}</span>
                            </button>
                          )}
                          <button
                            className="btn-sm btn-outline-danger"
                            onClick={() => handleReject(r.request_id)}
                            title={t('btn_reject')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </>
                      )}

                      {r.request_status === 'rejected' && (
                        <button
                          className="btn-sm btn-outline-success"
                          onClick={() => handleApprove(r.request_id)}
                          title={t('btn_approve')}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {t('btn_approve')}
                        </button>
                      )}

                      <button
                        className="btn-sm btn-icon-danger"
                        onClick={() => handleDelete(r.request_id)}
                        title={t('btn_delete') || 'Delete'}
                        style={{
                          background: 'none', border: '1px solid #fee2e2', color: '#dc2626',
                          borderRadius: '6px', padding: '6px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: 'auto'
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
        </section>
      </main>
    </div>
  );
}
