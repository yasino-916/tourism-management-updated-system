import React, { useEffect, useState } from 'react';
import ResearcherSidebar from './ResearcherSidebar';
import ThemeToggle from '../common/ThemeToggle';
import './researcher.css';
import { getResearcherSites, deleteSite } from './researcherService';
import ManageSiteModal from './ManageSiteModal';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function ResearcherSites() {
  const { t } = useLanguage();
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

          const mySites = data.filter(s =>
            s.researcher_id == user.user_id ||
            s.created_by == user.user_id ||

            !s.researcher_id
          ).filter(s => s.researcher_id == user.user_id || s.created_by == user.user_id);

          setSites(mySites);
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

    if (!window.confirm(t('msg_confirm_draft_delete'))) return;
    try {
      await deleteSite(id);
      loadSites();
    } catch (err) {
      alert(t('msg_delete_fail') + ': ' + err.message);
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
        <header className="researcher-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{t('res_sites')}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ {t('btn_add_new_site')}</button>
            <ThemeToggle />
          </div>
        </header>

        <section className="panel">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>{t('Image') || 'Image'}</th>
                  <th>{t('Site Name') || 'Site Name'}</th>
                  <th>{t('Location') || 'Location'}</th>
                  <th>{t('Status') || 'Status'}</th>
                  <th>{t('Actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {sites.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>{t('msg_no_sites')}</td></tr>}
                {sites.map(s => (
                  <tr key={s.site_id}>
                    <td>
                      <div
                        style={{ width: '80px', height: '60px', position: 'relative', cursor: s.map_url ? 'pointer' : 'default' }}
                        onClick={() => s.map_url && window.open(s.map_url, '_blank')}
                        title={`${s.site_name}\n${s.description || s.short_description || ''}\n${s.map_url ? 'Click to view map' : ''}`}
                      >
                        <img
                          src={s.image_url || s.image || 'https://via.placeholder.com/100'}
                          alt={s.site_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=No+Img'; }}
                        />
                        {s.map_url && <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', borderRadius: '4px 0 4px 0', padding: '1px 3px', fontSize: '10px' }}>📍</div>}
                      </div>
                    </td>
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
                        {s.is_approved ? t('dash_approved') : t('dash_pending')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-container" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="btn-sm btn-outline-primary"
                          onClick={() => handleEdit(s)}
                          title={t('btn_edit')}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          {t('btn_edit')}
                        </button>
                        {!s.is_approved && (
                          <button
                            className="btn-sm btn-icon-danger"
                            onClick={() => handleDelete(s.site_id)}
                            title={t('btn_delete')}
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
                        )}
                      </div>
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
