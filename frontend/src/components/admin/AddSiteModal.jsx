import React, { useState } from 'react';
import AdminModal from './AdminModal';
import './admin.css';
import { createSite } from './adminService';

export default function AddSiteModal({ onClose, onCreated }) {
  const [siteName, setSiteName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newSite = await createSite({ site_name: siteName, is_approved: false });
      onCreated && onCreated(newSite);
      onClose();
    } catch (err) {
      alert('Failed to create site: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminModal title="Add Site" onClose={onClose}>
      <form onSubmit={submit}>
        <label>Site Name</label>
        <input value={siteName} onChange={e => setSiteName(e.target.value)} required />
        <div style={{marginTop:12}}>
          <button className="btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Site'}</button>
          <button type="button" className="btn-outline" onClick={onClose} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
    </AdminModal>
  );
}
