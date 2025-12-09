import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getPayments, verifyPayment } from './adminService';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  useEffect(() => { getPayments().then(setPayments); }, []);

  const refresh = () => getPayments().then(setPayments);

  const handleVerify = async (id) => {
    try {
      await verifyPayment(id);
      refresh();
      setSelectedPayment(null);
    } catch (err) { alert('Verify failed: ' + err.message); }
  };

  const formatAmount = (p) => {
    const amt = p.total_amount ?? p.amount ?? 0;
    return `${amt} ETB`;
  };

  const sortedPayments = [...payments].sort((a, b) => {
    const byId = (b.payment_id || 0) - (a.payment_id || 0);
    if (byId !== 0) return byId;
    return new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0);
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Payments</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sortedPayments.map(p => (
                <tr key={p.payment_id}>
                  <td>{p.payment_id}</td>
                  <td>{formatAmount(p)}</td>
                  <td><span className={`status-badge status-${p.payment_status}`}>{p.payment_status}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-sm btn-outline"
                      style={{ color: '#0d6efd', borderColor: '#0d6efd' }}
                      onClick={() => setSelectedPayment(p)}
                    >
                      View
                    </button>
                    <button
                      className="btn-sm"
                      style={{ background: '#28a745', color: 'white' }}
                      onClick={() => handleVerify(p.payment_id)}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {selectedPayment && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal" style={{ maxWidth: '520px' }}>
              <div className="admin-modal-header">
                <h3>Payment #{selectedPayment.payment_id}</h3>
                <button className="btn-ghost text-dark" onClick={() => setSelectedPayment(null)}>✕</button>
              </div>
              <div className="admin-modal-body">
                <p><strong>Request ID:</strong> {selectedPayment.request_id || '—'}</p>
                <p><strong>Visitor:</strong> {selectedPayment.visitor_name || '—'}</p>
                <p><strong>Site:</strong> {selectedPayment.site || selectedPayment.site_name || '—'}</p>
                <p><strong>Amount:</strong> {formatAmount(selectedPayment)}</p>
                <p><strong>Method:</strong> {selectedPayment.payment_method || selectedPayment.method || 'Chapa'}</p>
                <p><strong>Chapa Reference:</strong> {selectedPayment.reference_code || selectedPayment.tx_ref || '—'}</p>
                <p><strong>Date:</strong> {selectedPayment.created_at || selectedPayment.date || '—'}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${selectedPayment.payment_status}`}>{selectedPayment.payment_status}</span></p>
                {selectedPayment.proof_url && (
                  <p><strong>Proof:</strong> <a href={selectedPayment.proof_url} target="_blank" rel="noreferrer">View Upload</a></p>
                )}
              </div>
              <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn-sm btn-outline" onClick={() => setSelectedPayment(null)}>Close</button>
                <button className="btn-sm" style={{ background: '#28a745', color: 'white' }} onClick={() => handleVerify(selectedPayment.payment_id)}>Verify</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
