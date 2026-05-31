import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSummary, getRequests, getPayments, getReports } from './adminService';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminReports() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
    getReports().then(setReports);
  }, []);

  const handleExportCSV = () => {

    let csv = 'Guide Name,Site,Visitor,Date,Report\n';
    reports.forEach(r => {
      csv += `"${r.guide_name} ${r.guide_last}","${r.site_name}","Request #${r.request_id}","${r.report_date}","${r.report_text.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {

    window.print();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header">
          <h1>{t('title_reports_analytics')}</h1>
          <ThemeToggle />
        </header>

        <section className="panel">
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_visits_report')}</h4>
                <p><strong>{t('lbl_total_requests')}:</strong> {requests.length}</p>
                <p><strong>{t('lbl_completed_visits')}:</strong> {requests.filter(r => r.request_status === 'completed').length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_payments_report')}</h4>
                <p><strong>{t('lbl_total_payments')}:</strong> {payments.length}</p>
                <p><strong>{t('lbl_confirmed_revenue')}:</strong> {payments.filter(p => p.payment_status === 'confirmed').reduce((acc, curr) => acc + Number(curr.total_amount || curr.amount || 0), 0)} ETB</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h4>{t('lbl_user_activity')}</h4>
                <p><strong>{t('lbl_total_users')}:</strong> {summary?.totalUsers || 0}</p>
                <p><strong>{t('lbl_active_sites')}:</strong> {summary?.totalSites || 0}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>{t('Reports Overview') || 'Detailed Reports Overview'}</h3>
            <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button className="btn-primary" onClick={handleExportCSV}>{t('Export CSV')}</button>
              <button className="btn-outline" onClick={handleExportPDF}>{t('Export PDF')}</button>
            </div>

            {reports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                {/* <table className="table admin-table" id="reports-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Guide</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Site</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Request ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px' }}>{r.guide_name} {r.guide_last}</td>
                        <td style={{ padding: '12px' }}>{r.site_name}</td>
                        <td style={{ padding: '12px' }}>#{r.request_id}</td>
                        <td style={{ padding: '12px' }}>{new Date(r.report_date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>{r.report_text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              </div>
            )}
            <style>{`
                @media print {
                    .admin-sidebar, .admin-main-header, .no-print { display: none !important; }
                    .admin-layout { display: block; }
                    .admin-main { margin: 0; padding: 0; width: 100%; }
                    .panel { box-shadow: none; border: none; padding: 0; }
                    body { background: white; }
                    #reports-table th, #reports-table td { border: 1px solid #ddd !important; }
                }
            `}</style>
          </div>
        </section>
      </main>
    </div>
  );
}
