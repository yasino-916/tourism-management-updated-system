import React from 'react';


function Contact() {
  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      details: 'support@ethiotourism.com',
      action: 'mailto:support@ethiotourism.com'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+251 9 61 74 18 06',
      action: 'tel:+251961741806'
    },
    {
      icon: '📍',
      title: 'Headquarters',
      details: 'Addis Ababa, Ethiopia',
      action: null
    }
  ];

  return (
    <section id="contact" style={{
      padding: '100px 20px',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            color: 'var(--accent-primary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '2px'
          }}>Get In Touch</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            marginTop: '15px',
            marginBottom: '20px',
            color: 'var(--text-primary)',
            fontWeight: '800'
          }}>
            Contact Us
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: '1.7'
          }}>
            Get in touch with our team for any questions or support regarding your Ethiopian adventure.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {contactMethods.map((method, index) => (
            <div
              key={index}
              style={{
                background: 'var(--card-bg)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: 'var(--card-shadow)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--hover-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 25px',
                transition: 'all 0.3s ease',
                color: 'var(--accent-primary)'
              }}>
                {method.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                marginBottom: '10px',
                color: 'var(--text-primary)',
                fontWeight: '700'
              }}>
                {method.title}
              </h3>
              {method.action ? (
                <a
                  href={method.action}
                  style={{
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {method.details}
                </a>
              ) : (
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  {method.details}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '40px',
          background: 'var(--gradient-main)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '700' }}>
            Ready to Start Your Journey?
          </h3>
          <p style={{ marginBottom: '25px', opacity: 0.9 }}>
            Join thousands of travelers exploring Ethiopia's rich heritage.
          </p>
          <a
            href="/register"
            style={{
              display: 'inline-block',
              background: 'white',
              color: 'var(--accent-primary)',
              padding: '14px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease'
            }}
          >
            Get Started Today →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;