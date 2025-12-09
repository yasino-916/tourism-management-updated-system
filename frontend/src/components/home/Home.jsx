import React from 'react';
import { Link } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import Features from './sections/Features';
import Contact from './sections/Contact';
import { useLanguage } from '../../context/LanguageContext';

function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <Header />

      {/* Hero Section - Inlined */}
      <section
        id="home"
        style={{
          position: 'relative',
          width: '100vw',
          margin: '0',
          marginLeft: 'calc(-50vw + 50%)',
          minHeight: '100vh',
          paddingTop: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}></div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          padding: '120px 20px 80px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#ffffff',
            marginBottom: '25px',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            fontFamily: "Georgia, 'Times New Roman', serif"
          }}>
            {t('hero_title')}
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: 1.8,
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {t('hero_subtitle')}
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--accent-secondary)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--accent-primary)'}
          >
            {t('hero_cta')}
          </Link>
        </div>
      </section>

      {/* About Section - Inlined */}
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
            }}>{t('about_badge')}</span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '20px',
              lineHeight: 1.3
            }}>
              {t('about_title')}
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              {t('about_desc')}
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
                {t('about_card_title')}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '15px'
              }}>
                {t('about_card_desc1')}
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '30px'
              }}>
                {t('about_card_desc2')}
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
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('stats_sites')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>100+</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('stats_guides')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1000+</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('stats_visitors')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <Contact />
      <Footer />
    </div>

  );
}

export default Home;