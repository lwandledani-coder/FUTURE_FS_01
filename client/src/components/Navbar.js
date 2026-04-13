import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import DarkModeToggle from './DarkModeToggle';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', to: 'home' },
        { name: 'About', to: 'about' },
        { name: 'Skills', to: 'skills' },
        { name: 'Projects', to: 'projects' },
        { name: 'Contact', to: 'contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="logo">
                    <a href="#home">L.C.Mthombeni</a>
                </div>

                <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navItems.map((item) => (
                        <ScrollLink
                            key={item.name}
                            to={item.to}
                            smooth={true}
                            duration={500}
                            spy={true}
                            offset={-70}
                            activeClass="active"
                            className="nav-link"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </ScrollLink>
                    ))}
                </div>

                <div className="nav-right">
                    <DarkModeToggle />
                    <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;