import React, { useState, useEffect } from 'react';
import './researcher.css';
import { addSite, updateSite } from './researcherService';

export default function ManageSiteModal({ site, researcherId, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    site_name: '',
    location: '',
    description: '',
    price: '',
    image: '',
    category: 'Historical Site',
    region: '',
    visit_duration: '',
    nearby_attractions: '',
    map_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (site) {
      setFormData({
        site_name: site.site_name || '',
        location: site.location || site.location_address || '',
        description: site.description || site.full_description || site.short_description || '',
        price: site.price || site.visit_price || '',
        image: site.image || site.image_url || '',
        category: site.category || 'Historical Site',
        region: site.region || '',
        visit_duration: site.visit_duration || site.estimated_duration || '',
        nearby_attractions: site.nearby_attractions || '',
        map_url: site.map_url || ''
      });
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        researcher_id: researcherId,
        // If editing, keep existing approval status (or reset to false if significant changes? Requirement says updates must be approved)
        // For now, let's say updates reset approval to false
        is_approved: false
      };

      if (site) {
        await updateSite({ ...payload, site_id: site.site_id });
      } else {
        await addSite(payload);
      }
      onSaved();
    } catch (err) {
      alert('Error saving site: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="admin-modal-header">
          <h3>{site ? 'Edit Site Content' : 'Add New Site Content'}</h3>
          <button className="btn-ghost" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div className="admin-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label>Site Name</label>
                <input name="site_name" value={formData.site_name} onChange={handleChange} required />
              </div>
              <div>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option>Historical Site</option>
                  <option>Cultural Site</option>
                  <option>Natural Attraction</option>
                </select>
              </div>
              <div>
                <label>Region / City</label>
                <input name="region" value={formData.region} onChange={handleChange} required />
              </div>
              <div>
                <label>Location (Address/Coordinates)</label>
                <input name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div>
                <label>Suggested Visit Price (ETB)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <label>Est. Visit Duration</label>
                <input name="visit_duration" value={formData.visit_duration} onChange={handleChange} placeholder="e.g. 2 hours" />
              </div>
            </div>

            <label>Full Description (History, Culture, Significance)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} required />

            <label>Nearby Attractions</label>
            <input name="nearby_attractions" value={formData.nearby_attractions} onChange={handleChange} placeholder="Comma separated" />

            <label>Site Image</label>
            <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '8px', textAlign: 'center', background: '#f9f9f9' }}>
              {formData.image ? (
                <div style={{ position: 'relative' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                  >✕</button>
                </div>
              ) : (
                <div style={{ padding: '20px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>Drag and drop or click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, image: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <label style={{ marginTop: '15px', display: 'block' }}>Map Location URL (Optional)</label>
            <input
              name="map_url"
              value={formData.map_url || ''}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
            />

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : (site ? 'Submit Update' : 'Submit for Approval')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
