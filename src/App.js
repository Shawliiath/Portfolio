import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/layout/Loader';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ScrollUp from './components/ScrollUp';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import MyOrders from './pages/MyOrders';
import { initScrollAnimations } from './components/animationUtils';

function App() {
  library.add(fab, fas);
  // Initialize scroll animations when component mounts
  useEffect(() => {
    // Allow time for the DOM to fully render
    const animationTimeout = setTimeout(() => {
      initScrollAnimations();
    }, 500);
    
    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Loader />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
        <Footer />
        <ScrollUp />
      </Router>
    </ThemeProvider>
  );
}

export default App;