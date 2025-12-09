import React from 'react';

function About() {
  return (
    <section
      id="about"
      style={{
        padding: '100px 20px',
        background: 'var(--bg-primary)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            opacity: 0.9
          }}>About Us</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            lineHeight: 1.3
          }}>
            Your Gateway to Ethiopian Heritage
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            We connect travelers with Ethiopia's rich cultural heritage through verified historical sites,
            professional local guides, and seamless booking experiences.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          {/* Image */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=600&q=80"
              alt="Ethiopian Heritage"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* Text Content */}
          <div>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Preserving History, Creating Memories
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '15px'
            }}>
              Our platform bridges the gap between historical site enthusiasts and professional
              tourism services. We provide a comprehensive ecosystem where visitors can explore,
              researchers can contribute, and certified guides can share their expertise.
            </p>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '30px'
            }}>
              From the ancient rock-hewn churches of Lalibela to the castles of Gondar,
              we ensure every journey is authentic, educational, and unforgettable.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap',
              padding: '25px 0',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>50+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Historic Sites</div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>100+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expert Guides</div>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1000+</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Happy Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;