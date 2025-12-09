import React from 'react';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">Tourism_MS</div>
          <p>Making your travel dreams come true.</p>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Tourism Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;