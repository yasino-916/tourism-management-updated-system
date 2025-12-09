import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getSites, deleteSite, getUsers, updateSiteStatus } from './adminService';
import AdminModal from './AdminModal';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminSites() {
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [viewSite, setViewSite] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  useEffect(() => {
    Promise.all([getSites(), getUsers()]).then(([sitesData, usersData]) => {
      setSites(sitesData);
      setUsers(usersData);
    });

    const handleClickOutside = () => setActionDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const refresh = () => getSites().then(setSites);

  const handleStatusChange = async (siteId, isApproved) => {
    try {
      await updateSiteStatus(siteId, isApproved);
      refresh();
      setActionDropdown(null);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const getResearcherName = (site) => {
    if (site.researcher) return site.researcher; // Legacy support
    if (site.researcher_id) {
      const user = users.find(u => u.user_id === site.researcher_id);
      return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
    }
    return 'N/A';
  };

  const handleDelete = async (id) => {
    // use window.confirm but disable the eslint restricted-globals warning for this line
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this site?')) return;
    try {
      await deleteSite(id);
      refresh();
    } catch (err) { alert('Delete failed: ' + err.message); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Sites</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3>Sites</h3>
          </div>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Researcher</th><th>Approved</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sites.map((s, index) => (
                <tr key={`${s.site_id}-${index}`}>
                  <td>{s.site_id}</td>
                  <td>{s.site_name}</td>
                  <td>{getResearcherName(s)}</td>
                  <td>
                    <span style={{
                      color: s.status === 'rejected' ? 'red' : (s.is_approved ? 'green' : '#fa8c16'),
                      fontWeight: 'bold'
                    }}>
                      {s.status === 'rejected' ? 'No' : (s.is_approved ? 'Yes' : 'Pending')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <button className="btn-sm" onClick={() => setViewSite(s)}>View</button>

                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn-sm"
                          style={{ background: '#722ed1', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionDropdown(actionDropdown === index ? null : index);
                          }}
                        >
                          Edit <span>▼</span>
                        </button>
                        {actionDropdown === index && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: index >= sites.length - 3 ? 'auto' : '100%',
                              bottom: index >= sites.length - 3 ? '100%' : 'auto',
                              right: 0,
                              background: 'white',
                              border: '1px solid #eee',
                              borderRadius: '4px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              zIndex: 9999,
                              minWidth: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '4px 0'
                            }}>
                            <button
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 15px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: s.is_approved ? 'default' : 'pointer',
                                color: s.is_approved ? '#ccc' : '#52c41a',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                              onClick={() => !s.is_approved && handleStatusChange(s.site_id, true)}
                            >
                              ✓ Approve
                            </button>
                            <button
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 15px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: (!s.is_approved && s.status === 'rejected') ? 'default' : 'pointer',
                                color: (!s.is_approved && s.status === 'rejected') ? '#ccc' : '#ff4d4f',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                              onClick={() => (s.is_approved || s.status !== 'rejected') && handleStatusChange(s.site_id, false)}
                            >
                              ✕ Reject
                            </button>
                            <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }}></div>
                            <button
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 15px',
                                border: 'none',
                                background: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#ff4d4f',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                              onClick={() => {
                                setActionDropdown(null);
                                handleDelete(s.site_id);
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {viewSite && (
        <AdminModal title="Site Details" onClose={() => setViewSite(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {viewSite.image && (
              <img
                src={viewSite.image}
                alt={viewSite.site_name}
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Site Name</label>
              <div style={{ fontSize: '1.1rem' }}>{viewSite.site_name}</div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Location</label>
              <div>{viewSite.location}</div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Description</label>
              <div style={{ lineHeight: '1.5' }}>{viewSite.description}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Entry Price</label>
                <div>{viewSite.price} ETB</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Site Agent Fee</label>
                <div>{viewSite.guide_fee} ETB</div>
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Status</label>
              <div>
                <span className={`status-badge status-${viewSite.is_approved ? 'approved' : 'pending'}`}>
                  {viewSite.is_approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
