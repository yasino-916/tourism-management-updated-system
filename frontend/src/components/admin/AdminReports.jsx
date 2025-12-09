import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSummary, getRequests, getPayments } from './adminService';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Reports & Analytics</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <div className="report-grid">
            <div className="report-card">
              <h4>Visits Report</h4>
              <p>Total Requests: {requests.length}</p>
              <p>Completed Visits: {requests.filter(r => r.request_status === 'completed').length}</p>
            </div>
            <div className="report-card">
              <h4>Payments Report</h4>
              <p>Total Payments: {payments.length}</p>
              <p>Confirmed Revenue: {payments.filter(p => p.payment_status === 'confirmed').reduce((acc, curr) => acc + Number(curr.amount), 0)} ETB</p>
            </div>
            <div className="report-card">
              <h4>User Activity</h4>
              <p>Total Users: {summary?.totalUsers || 0}</p>
              <p>Active Sites: {summary?.totalSites || 0}</p>
            </div>
          </div>
          <div style={{marginTop:16}}>
            <button className="btn-primary">Export CSV</button>
            <button className="btn-outline" style={{marginLeft: 10}}>Export PDF</button>
          </div>
        </section>
      </main>
    </div>
  );
}
