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
import NotificationDropdown from '../common/NotificationDropdown';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserType, setAddUserType] = useState('site_agent');
  useEffect(() => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
  }, []);

  const refresh = () => {
    getSummary().then(setSummary);
    getRequests().then(setRequests);
    getPayments().then(setPayments);
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
            <NotificationDropdown userType="admin" />
            <UserProfileMenu userType="admin" />
          </div>
        </header>

        {summary ? (
          <section className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', marginBottom: '40px' }}>
            {}
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>System Performance</h3>
                <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', color: '#64748b' }}>Real-time</span>
              </div>
              <div style={{ height: '350px' }}>
                <Bar
                  data={{
                    labels: ['Users', 'Sites', 'Visits', 'Revenue'],
                    datasets: [
                      {
                        label: 'Metric Value',
                        data: [
                          summary.totalUsers,
                          summary.totalSites,
                          summary.totalVisits,
                          summary.totalRevenue
                        ],
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.9)',
                          'rgba(16, 185, 129, 0.9)',
                          'rgba(245, 158, 11, 0.9)',
                          'rgba(244, 63, 94, 0.9)',
                        ],
                        borderRadius: 6,
                        barThickness: 40,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: { size: 13, family: "'Inter', sans-serif" },
                        bodyFont: { size: 12, family: "'Inter', sans-serif" },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                          label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += context.parsed.y;
                              if (context.dataIndex === 3) label += ' ETB';
                            }
                            return label;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: '#f1f5f9',
                          borderDash: [5, 5],
                        },
                        border: { display: false },
                        ticks: {
                          font: { family: "'Inter', sans-serif", size: 11 },
                          color: '#64748b',
                          padding: 10
                        }
                      },
                      x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                          font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
                          color: '#64748b'
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            {}
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Distribution</h3>
                <button style={{ border: 'none', background: 'transparent', color: '#94a3b8' }}>•••</button>
              </div>
              <div style={{ height: '350px', position: 'relative' }}>
                <Doughnut
                  data={{
                    labels: ['Users', 'Sites', 'Visits', 'Payments'],
                    datasets: [
                      {
                        data: [
                          summary.totalUsers,
                          summary.totalSites,
                          summary.totalVisits,
                          summary.totalPaymentsCount || 0
                        ],
                        backgroundColor: [
                          '#6366f1',
                          '#10b981',
                          '#f59e0b',
                          '#f43f5e',
                        ],
                        borderWidth: 0,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { family: "'Inter', sans-serif", size: 11 },
                          color: '#64748b'
                        }
                      },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        cornerRadius: 8,
                      }
                    },
                  }}
                />
                {}
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>
                    {summary.totalUsers + summary.totalSites + summary.totalVisits + (summary.totalPaymentsCount || 0)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Total Events</div>
                </div>
              </div>
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
