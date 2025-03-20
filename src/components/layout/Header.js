import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside or on a link
  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  // Add scrolled class to header when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check if link should be active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    
    // For handling hash links on homepage
    if (location.pathname === '/' && location.hash === path) return true;
    
    return false;
  };

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container">
        <nav>
          <Link to="/" className="logo">
            Dev<span>Portfolio</span>
          </Link>
          
          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={isActive('/') && !location.hash ? 'active' : ''} 
                onClick={closeMenu}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link 
                to="/#about" 
                className={isActive('#about') ? 'active' : ''} 
                onClick={closeMenu}
              >
                À propos
              </Link>
            </li>
            <li>
              <Link 
                to="/#projects" 
                className={isActive('#projects') ? 'active' : ''} 
                onClick={closeMenu}
              >
                Projets
              </Link>
            </li>
            <li>
              <Link 
                to="/#experience" 
                className={isActive('#experience') ? 'active' : ''} 
                onClick={closeMenu}
              >
                Expérience
              </Link>
            </li>
            <li>
              <Link 
                to="/#contact" 
                className={isActive('#contact') ? 'active' : ''} 
                onClick={closeMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
          
          <ThemeSwitcher />
          
          <div 
            className={`hamburger ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;