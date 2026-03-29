import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand-section">
                    <h2 className="footer-logo">PAK-TEX</h2>
                    <p className="footer-tagline">Quality garments engineered for the urban environment. EST 2026.</p>
                </div>

                <div className="footer-links-group">
                    <h4>SHOP</h4>
                    <ul>
                        <li><Link to="/new-arrivals">New Arrivals</Link></li>
                        {/* Links to home and scrolls via the Navbar logic we set earlier */}
                       <li><Link to="/all-hoodies">All Hoodies</Link></li>
                    </ul>
                </div>

                <div className="footer-links-group">
                    <h4>SUPPORT</h4>
                    <ul>
                        <li><Link to="/shipping-info">Shipping</Link></li>
                        <li><Link to="/returns">Returns</Link></li>
                    </ul>
                </div>

                <div className="footer-links-group">
                    <h4>MANAGEMENT</h4>
                    <ul>
                        <li><Link to="/login" style={{ color: '#333' }}>Staff Login</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2026 PAK-TEX STUDIO. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
};

export default Footer;