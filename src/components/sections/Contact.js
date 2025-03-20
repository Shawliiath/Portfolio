import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Contact = () => {
  // État pour gérer le formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulation d'envoi de formulaire (à remplacer par votre logique d'envoi réelle)
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.'
        
      });
      
      // Réinitialisation du formulaire
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contact</h2>
          <p>N'hésitez pas à me contacter pour discuter de vos projets ou opportunités de collaboration</p>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Parlons de vos projets</h3>
            
            <p>
              Si vous recherchez un développeur web passionné pour votre prochain projet ou une opportunité professionnelle, n'hésitez pas à me contacter. Je suis toujours ouvert aux nouvelles collaborations et défis.
            </p>
            
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div className="contact-item-content">
                <h4>Email</h4>
                <a href="mailto:contact@example.com">contact@example.com</a>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div className="contact-item-content">
                <h4>Téléphone</h4>
                <a href="tel:+33600000000">+33 6 00 00 00 00</a>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div className="contact-item-content">
                <h4>Localisation</h4>
                <span>Paris, France</span>
              </div>
            </div>
            
            <div className="social-links">
              <a 
                href="https://github.com/Shawliiath" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link" 
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="contact-form">
            <div className="form-heading">
              <h3>Envoyez-moi un message</h3>
              <p>Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.</p>
            </div>
            
            {formStatus.submitted && formStatus.success ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>{formStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="form-control" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="form-control" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    className="form-control" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn">
                    Envoyer le message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;