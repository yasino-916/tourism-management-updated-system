import React, { useState } from 'react';
import '../styles/components/Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Left Column - Brand & Social */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h2>Tourism MS</h2>
            </div>
            <p className="footer-description">
              Welcome to Ethiopia, the Land of Origins! Ethiopia invites you to discover why it is the origin of so much! As you explore this ancient land, you will be put in touch with your own origins... for this is the Land of Origins!
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Middle Column - Newsletter */}
          <div className="footer-newsletter">
            <h3>Newsletter Subscribe</h3>
            <p>Sign up for our mailing list to get latest updates and offers.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          {/* Right Column - Image */}
          <div className="footer-image">
            <img
              src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop"
              alt="Ethiopian Historical Sites"
            />
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Powered By Tourism MS. All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;