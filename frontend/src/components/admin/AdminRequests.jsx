import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getRequests, getPayments, approveRequest, rejectRequest, assignGuide } from './adminService';
import ThemeToggle from '../common/ThemeToggle';


export default function AdminRequests() {
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
    if (status === 'accepted_by_guide') return 'Accepted';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleApprove = async (id) => {
    const hasVerifiedPayment = payments.some(p => p.request_id === id && p.payment_status === 'confirmed');
    if (!hasVerifiedPayment) {
      alert('Visitor has not paid or payment is not verified by Admin. Please verify payment before approving.');
      return;
    }
    try { await approveRequest(id); refresh(); } catch (err) { alert('Approve failed: ' + err.message); }
  };

  const handleReject = async (id) => {
    try { await rejectRequest(id); refresh(); } catch (err) { alert('Reject failed: ' + err.message); }
  };

  const startAssign = (id) => {
    setAssigningId(id);
    setGuideIdInput('');
  };

  const submitAssign = async (id) => {
    if (!guideIdInput) return;
    try { await assignGuide(id, { guide_id: parseInt(guideIdInput) }); refresh(); } catch (err) { alert('Assign failed: ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Visitor Requests</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Visitor</th><th>Site</th><th>Date</th><th>People</th><th>Status</th><th>Actions</th></tr>
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
                        {r.request_status === 'pending' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button className="btn-sm" onClick={() => handleApprove(r.request_id)}>Approve</button>
                            <button className="btn-sm btn-danger" onClick={() => handleReject(r.request_id)}>Reject</button>
                          </div>
                        )}
                        {r.request_status === 'approved' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {assigningId === r.request_id ? (
                              <>
                                <input 
                                  type="number" 
                                  placeholder="ID" 
                                  value={guideIdInput} 
                                  onChange={e => setGuideIdInput(e.target.value)}
                                  style={{ width: '60px', padding: '4px', margin: 0, fontSize: '0.8rem' }}
                                />
                                <button className="btn-sm" onClick={() => submitAssign(r.request_id)}>Save</button>
                                <button className="btn-sm btn-outline" onClick={() => setAssigningId(null)} style={{padding: '4px 8px'}}>✕</button>
                              </>
                            ) : (
                              <>
                                <button 
                                  className="btn-sm" 
                                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                  onClick={() => startAssign(r.request_id)}
                                >
                                  Assign Site Agent
                                </button>
                                <button className="btn-sm btn-danger" onClick={() => handleReject(r.request_id)}>Reject</button>
                              </>
                            )}
                          </div>
                        )}
                        {r.request_status === 'rejected' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button className="btn-sm" onClick={() => handleApprove(r.request_id)}>Approve</button>
                          </div>
                        )}
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
