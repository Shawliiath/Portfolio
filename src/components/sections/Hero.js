import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Développeur Web & Application React</h1>
          <p>
            Actuellement en Bachelor RPI et alternance chez MEXI, je conçois des applications web modernes et performantes avec React JS.
          </p>
          <Link to="/#projects" className="btn">
            Voir mes projets
          </Link>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="mouse"></div>
      </div>
    </section>
  );
};

export default Hero;