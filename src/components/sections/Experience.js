import React from 'react';

const Experience = () => {
  // Données d'expérience
  const experiences = [
    {
      id: 'mexi',
      title: 'Alternant Développeur chez MEXI',
      date: 'Sept. 2023 - Présent',
      description: 'Développement d\'applications de gestion interne, refonte du site vitrine, et participation aux projets stratégiques de l\'entreprise. Conception et implémentation d\'une application de gestion de stock en React JS. Collaboration avec les équipes métier pour définir les besoins et les fonctionnalités.'
    },
    {
      id: 'bachelor',
      title: 'Bachelor RPI (Responsable de Projets Informatiques)',
      date: 'Sept. 2023 - Présent',
      description: 'Formation axée sur la gestion de projets informatiques, le développement d\'applications et la conception web. Acquisition de compétences en développement front-end et back-end, gestion de bases de données, et méthodologies agiles. Travail sur des projets concrets en équipe.'
    },
    {
      id: 'but',
      title: 'BUT Informatique',
      date: 'Sept. 2022 - Juin 2023',
      description: 'Formation universitaire à Montreuil avec spécialisation en développement informatique et algorithmes. Acquisition des fondamentaux de la programmation, bases de données et architectures logicielles. Développement de projets académiques en équipe.'
    }
  ];

  return (
    <section id="experience">
      <div className="container">
        <div className="section-title">
          <h2>Expérience & Formation</h2>
          <p>Mon parcours professionnel et académique dans le domaine du développement web</p>
        </div>
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <div className="timeline-item" key={exp.id}>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <span className="date">{exp.date}</span>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;