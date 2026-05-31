import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '15px'
};

const defaultCenter = {
  lat: 9.145,
  lng: 40.489
};

const GoogleMapComponent = ({ sites }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  const onLoad = useCallback(function callback(map) {
    if (sites.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidSites = false;

      sites.forEach(site => {
        if (site.latitude && site.longitude) {
          bounds.extend({ lat: parseFloat(site.latitude), lng: parseFloat(site.longitude) });
          hasValidSites = true;
        }
      });

      if (hasValidSites) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(6);
      }
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(6);
    }

    setMap(map);
  }, [sites]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="loading-spinner">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: [
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
          }
        ]
      }}
    >
      {sites.map(site => (
        (site.latitude && site.longitude) ? (
          <Marker
            key={site.id}
            position={{ lat: parseFloat(site.latitude), lng: parseFloat(site.longitude) }}
            onClick={() => setSelectedSite(site)}
          />
        ) : null
      ))}

      {selectedSite && (
        <InfoWindow
          position={{ lat: parseFloat(selectedSite.latitude), lng: parseFloat(selectedSite.longitude) }}
          onCloseClick={() => setSelectedSite(null)}
        >
          <div className="map-info-window" style={{ padding: '10px', maxWidth: '200px' }}>
            <h5 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{selectedSite.name}</h5>
            <div style={{ width: '100%', height: '100px', overflow: 'hidden', borderRadius: '5px', marginBottom: '5px' }}>
              <img
                src={selectedSite.image}
                alt={selectedSite.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#7f8c8d' }}>{selectedSite.location}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{selectedSite.price} ETB</span>
              <Link to={`/visitor/sites/${selectedSite.id}`} style={{ fontSize: '12px', color: '#3498db', textDecoration: 'none' }}>Details</Link>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default React.memo(GoogleMapComponent);
