import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  // Données des projets
  const projects = [
    {
      id: 'my-orders',
      title: 'My Orders',
      image: './img/logo.png',
      description: 'Application complète de gestion d\'inventaire développée en React JS pour MEXI. Permet de suivre les stocks, gérer les commandes et générer des rapports.',
      techs: ['React', 'Node.js', 'MongoDB', 'Express'],
      github: 'https://github.com/Shawliiath/bisstock',
      demo: 'https://gestionnaire-stockage.web.app',
      detailsLink: '/my-orders'
    },
    {
      id: 'mexi-site',
      title: 'Refonte Site Vitrine MEXI',
      image: 'https://via.placeholder.com/350x200',
      description: 'Modernisation du site vitrine de l\'entreprise MEXI avec un design responsive et une expérience utilisateur améliorée.',
      techs: ['React', 'Sass', 'Gatsby', 'Figma'],
      github: '#',
      demo: '#'
    },
    {
      id: 'docly-org',
      title: 'GED DoclyOrg',
      image: 'https://via.placeholder.com/350x200',
      description: 'Projet collaboratif de Gestion Électronique de Documents (GED) offrant des fonctionnalités de stockage, d\'organisation et de partage de documents.',
      techs: ['React', 'TypeScript', 'Firebase', 'Redux'],
      github: 'https://github.com/DoclyOrg',
      demo: '#'
    }
  ];

  return (
    <section id="projects">
      <div className="container">
        <div className="section-title">
          <h2>Mes Projets</h2>
          <p>Une sélection de mes réalisations récentes en développement web et application</p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={project.id}>
              <div className="project-img">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-techs">
                  {project.techs.map((tech, i) => (
                    <span className="project-tech" key={i}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i> GitHub
                    </a>
                  )}
                  {project.detailsLink ? (
                    <Link to={project.detailsLink} className="view-details-link">
                      <i className="fas fa-info-circle"></i> Voir détails
                    </Link>
                  ) : (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-external-link-alt"></i> Site
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;