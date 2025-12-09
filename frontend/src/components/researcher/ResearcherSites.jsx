import React, { useEffect, useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './researcher.css';
import { getResearcherSites, deleteSite } from './researcherService';
import ManageSiteModal from './ManageSiteModal';
import { useLocation } from 'react-router-dom';

export default function ResearcherSites() {
  const [sites, setSites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const user = JSON.parse(localStorage.getItem('researcher_user') || '{}');
  const location = useLocation();

  useEffect(() => {
    loadSites();
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      setShowModal(true);
    }
  }, [user.user_id, location.search]);

  const loadSites = async () => {
    if (user.user_id) {
      try {
        const data = await getResearcherSites(user.user_id);
        if (Array.isArray(data)) {
            setSites(data);
        } else {
            console.error("ResearcherSites: Expected array, got", data);
            setSites([]);
        }
      } catch (err) {
        console.error(err);
        setSites([]);
      }
    }
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this draft?')) return;
    try {
      await deleteSite(id);
      loadSites();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingSite(null);
  };

  const handleSaved = () => {
    loadSites();
    handleClose();
  };

  return (
    <div className="researcher-layout">
      <ResearcherSidebar />
      <main className="researcher-main">
        <header className="researcher-main-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>My Content</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button className="btn-primary" style={{background: 'white', color: '#1a3c54'}} onClick={() => setShowModal(true)}>+ Add New Site</button>
            <ThemeToggle />
          </div>
        </header>

        <section className="panel">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>No sites added yet.</td></tr>}
                {sites.map(s => (
                  <tr key={s.site_id}>
                    <td>{s.site_name}</td>
                    <td>{s.location || s.location_address}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: s.is_approved ? '#e6fffa' : '#fff7e6',
                        color: s.is_approved ? '#047857' : '#b7791f',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {s.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                      {!s.is_approved && <button className="btn-sm btn-danger" onClick={() => handleDelete(s.site_id)}>Delete</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {showModal && (
        <ManageSiteModal 
          site={editingSite} 
          researcherId={user.user_id} 
          onClose={handleClose} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
