import React from 'react';


function Features() {
  const features = [
    {
      icon: '🏛️',
      title: 'Explore Sites',
      description: 'Browse through hundreds of historical sites with detailed information, photos, and interactive location maps.',
      color: 'var(--accent-primary)'
    },
    {
      icon: '🔍',
      title: 'Smart Discovery',
      description: 'Advanced search and filtering to find historical sites based on location, era, and cultural significance.',
      color: '#06b6d4'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Guides',
      description: 'Connect with certified site agents for an enriched historical experience and authentic storytelling.',
      color: '#10b981'
    },
    {
      icon: '🤝',
      title: 'Perfect Matching',
      description: 'Smart algorithm matches you with the perfect guide based on your interests and language preferences.',
      color: '#f59e0b'
    },
    {
      icon: '📚',
      title: 'Rich Content',
      description: 'Access verified historical information curated by tourism experts and professional researchers.',
      color: '#ef4444'
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description: 'Seamless booking experience with real-time availability and instant confirmation.',
      color: '#8b5cf6'
    }
  ];

  return (
    <section
      id="feature"
      style={{
        padding: '100px 20px',
        background: 'var(--bg-secondary)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            color: 'var(--accent-primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            letterSpacing: '2px'
          }}>Why Choose Us</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '15px',
            marginBottom: '20px'
          }}>
            Discover Our Features
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.7
          }}>
            Everything you need to experience the rich history and culture of Ethiopia with confidence and ease.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--card-bg)',
                padding: '35px 30px',
                borderRadius: '16px',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '25px',
                margin: '0 auto 25px',
                color: feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color,
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.background = feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = `${feature.color}15`;
                  e.currentTarget.style.color = feature.color === 'var(--accent-primary)' ? 'var(--accent-primary)' : feature.color;
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '1rem',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;