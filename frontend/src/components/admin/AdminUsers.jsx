import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './admin.css';
import { getUsers, toggleUserStatus, deleteUser } from './adminService';
import AddUserModal from './AddUserModal';
import AdminModal from './AdminModal';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  useEffect(() => {
    getUsers().then(data => setUsers(data.filter(u => u.user_id !== 1)));

    const handleClickOutside = () => setActionDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const refresh = () => getUsers().then(data => setUsers(data.filter(u => u.user_id !== 1)));
  const onUserCreated = () => { refresh(); };

  const handleToggleStatus = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await toggleUserStatus(user.user_id, !user.is_active);
      refresh();
    } catch (err) {
      alert('Action failed: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Are you sure you want to delete user ${user.first_name} ${user.last_name}? This action cannot be undone.`)) return;
    try {
      await deleteUser(user.user_id);
      refresh();
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const formatType = (type, role, fallbackType, label) => {
    const raw = (label || type || role || fallbackType || '').toLowerCase();
    if (raw === 'site_agent' || raw === 'site agent' || raw === 'guide') return 'Site Agent';
    if (raw === 'researcher') return 'Researcher';
    if (raw === 'visitor') return 'Visitor';
    if (raw === 'admin') return 'Admin';
    if (!raw) return 'Site Agent'; // default for legacy/blank values where site agents were stored without type
    return label || type || role || fallbackType || '—';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Users</h1>
          <ThemeToggle />
        </header>
        <section className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3>Users</h3>
            <div>
              <button className="btn-primary" onClick={() => setShowAddUser(true)}>Add User</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Type</th><th>Active</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={`${u.user_id}-${index}`}>
                    <td>{u.user_id}</td>
                    <td>{u.first_name} {u.last_name}</td>
                    <td>{u.email}</td>
                    <td>{formatType(u.user_type, u.role, u.type, u.user_type_label)}</td>
                    <td>{u.is_active ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button className="btn-sm" onClick={() => setViewUser(u)}>View</button>

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
                                top: index >= users.length - 3 ? 'auto' : '100%',
                                bottom: index >= users.length - 3 ? '100%' : 'auto',
                                right: 0,
                                background: 'white',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '140px',
                                overflow: 'hidden'
                              }}>
                              <button
                                style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: 'white', textAlign: 'left', cursor: 'pointer', color: u.is_active ? '#ff4d4f' : '#52c41a', fontSize: '14px' }}
                                onClick={() => {
                                  setActionDropdown(null);
                                  handleToggleStatus(u);
                                }}
                              >
                                {u.is_active ? '✕ Deactivate' : '✓ Activate'}
                              </button>
                              <button
                                style={{ display: 'block', width: '100%', padding: '10px 15px', border: 'none', background: 'white', textAlign: 'left', cursor: 'pointer', color: '#ff4d4f', borderTop: '1px solid #f0f0f0', fontSize: '14px' }}
                                onClick={() => {
                                  setActionDropdown(null);
                                  handleDelete(u);
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
          </div>
        </section>
        {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onCreated={onUserCreated} />}
        {viewUser && (
          <AdminModal title="User Details" onClose={() => setViewUser(null)}>
            <div className="user-details">
              <p><strong>ID:</strong> {viewUser.user_id}</p>
              <p><strong>Name:</strong> {viewUser.first_name} {viewUser.last_name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Username:</strong> {viewUser.username}</p>
              <p><strong>Type:</strong> {(viewUser.user_type === 'guide' || viewUser.user_type === 'site_agent') ? 'Site Agent' : viewUser.user_type}</p>
              <p><strong>Status:</strong> {viewUser.is_active ? 'Active' : 'Inactive'}</p>
              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm('Delete this user?')) {
                      deleteUser(viewUser.user_id).then(() => {
                        setViewUser(null);
                        refresh();
                      });
                    }
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Delete User
                </button>
                <button className="btn-primary" onClick={() => setViewUser(null)}>Close</button>
              </div>
            </div>
          </AdminModal>
        )}
      </main>
    </div>
  );
}
