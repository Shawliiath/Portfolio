import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            Dev<span>Portfolio</span>
          </div>
          
          <p className="footer-text">
            Développeur Web & Applications React JS, passionné par la création de solutions web modernes et performantes.
          </p>
          
          <div className="footer-links">
            <Link to="/">Accueil</Link>
            <Link to="/#about">À propos</Link>
            <Link to="/#projects">Projets</Link>
            <Link to="/#experience">Expérience</Link>
            <Link to="/#contact">Contact</Link>
          </div>
          
          <div className="footer-social">
            <a 
              href="https://github.com/Shawliiath" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          
          <p className="copyright">&copy; {currentYear} - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;