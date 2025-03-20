import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/components/ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();

  return (
    <main className="project-details">
      <div className="container">
        <div className="section-title">
          <h2>Détails du Projet</h2>
          <p>ID du projet: {id}</p>
        </div>
        <div className="project-content">
          <p>Page en cours de développement...</p>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;