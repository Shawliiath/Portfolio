import React, { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Contact from '../components/sections/Contact';
import { useLocation } from 'react-router-dom';
import { initScrollAnimations } from '../components/animationUtils';

const Home = () => {
  const location = useLocation();

  // Scroll vers les sections via les ancres
  useEffect(() => {
    if (location.hash) {
      // Petit délai pour s'assurer que la page est complètement chargée
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else {
      // Si pas d'ancre, scroll en haut
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Initialisation des animations au scroll après le rendu
  useEffect(() => {
    // Laisser le temps au DOM de s'initialiser
    const animationTimeout = setTimeout(() => {
      initScrollAnimations();
    }, 500);
    
    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <main className="home-page">
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
};

export default Home;