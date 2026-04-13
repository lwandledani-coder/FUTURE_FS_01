import React from 'react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {currentYear} Lindani Mthombeni. All rights reserved.</p>
                <p>Built with React & Node.js</p>
            </div>
        </footer>
    );
};

export default Footer;