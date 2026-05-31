import React, { useState, useEffect } from 'react';
import VisitorSidebar from './VisitorSidebar';
import LoadingSpinner from '../common/LoadingSpinner';
import './visitor.css';
import { Link } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';
import ThemeToggle from '../common/ThemeToggle';
import GoogleMapComponent from '../common/GoogleMapComponent';

export default function ExploreSites() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    visitorService.getSites().then(data => {

      setSites(data.map(s => ({
        id: s.site_id,
        name: s.site_name,
        image: s.image_url || s.image || 'https://via.placeholder.com/300',
        location: s.location_address || s.location || 'Unknown',
        description: s.short_description || s.description || '',
        price: s.visit_price || s.price || 0,
        latitude: s.latitude,
        longitude: s.longitude,
        mapUrl: s.map_url
      })));
      setLoading(false);
    });
  }, []);

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="visitor-layout">
      <VisitorSidebar />
      <main className="visitor-main">
        <header className="visitor-main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <h1>Explore Historical Sites</h1>
            <input
              type="text"
              placeholder="Search sites..."
              className="form-control w-25"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('map')}
              >
                Map
              </button>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {loading ? <LoadingSpinner /> : (
          viewMode === 'map' ? (
            <div className="map-container" style={{ padding: '20px' }}>
              <GoogleMapComponent sites={filteredSites} />
            </div>
          ) : (
            <div className="visitor-cards">
              {filteredSites.map(site => (
                <div className="site-card-new" key={site.id}>
                  <div
                    className="site-image-container"
                    style={{ position: 'relative', cursor: site.mapUrl ? 'pointer' : 'default', overflow: 'hidden' }}
                    onClick={() => site.mapUrl && window.open(site.mapUrl, '_blank')}
                  >
                    <img
                      src={site.image}
                      alt={site.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                    <div className="hover-overlay" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '20px',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      textAlign: 'center'
                    }}>
                      <h4 style={{ color: 'white', marginBottom: '10px' }}>{site.name}</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{site.description.substring(0, 100)}...</p>
                      {site.mapUrl && (
                        <span style={{
                          background: '#1890ff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}>
                          📍 Click to View on Map
                        </span>
                      )}
                    </div>
                    <style>{`
                      .site-image-container:hover .hover-overlay { opacity: 1; }
                      .site-image-container:hover img { transform: scale(1.05); }
                    `}</style>
                  </div>
                  <div className="site-content">
                    <h3 className="site-title">{site.name}</h3>
                    <p className="site-location">{site.location}</p>
                    <p className="site-description">{site.description}</p>

                    <div className="site-footer">
                      <div className="price-row">
                        <div className="price-tag">
                          <span className="price-amount">{site.price}</span>
                          <span className="price-currency">ETB</span>
                        </div>
                        <Link to={`/visitor/sites/${site.id}`} className="view-details-link">View Details</Link>
                      </div>
                      <Link to={`/visitor/request-guide/${site.id}`} className="request-btn">Request Site Agent</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
