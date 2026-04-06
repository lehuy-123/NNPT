import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">PrecisionTech</div>
            <p className="footer-desc">
              Engineering the next generation of robust, lab-grade hardware for the modern creator.
            </p>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/">Shipping Info</Link></li>
              <li><Link to="/">Returns</Link></li>
              <li><Link to="/">Support Center</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Corporate</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Social</h4>
            <ul style={{ display: 'flex', gap: '1rem' }}>
              <li><a href="#">🌐</a></li>
              <li><a href="#">📸</a></li>
              <li><a href="#">🐦</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2024 PrecisionTech Industrial Excellence. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
