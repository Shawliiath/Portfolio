import React from 'react';
import SkillTag from '../ui/SkillTag';

const About = () => {
  // Liste des compétences
  const languages = [
    'React JS', 
    'JavaScript', 
    'HTML5', 
    'CSS3', 
    'Java', 
    'Rust (en cours)'
  ];
  
  const tools = [
    'Git', 
    'GitHub', 
    'Node.js', 
    'Gestion de Projet', 
    'UI/UX Design'
  ];

  return (
    <section id="about">
      <div className="container">
        <div className="section-title">
          <h2>À propos de moi</h2>
          <p>Découvrez mon parcours et les compétences que j'ai acquises dans le développement web</p>
        </div>
        <div className="about-grid">
          <div className="about-img">
            <img src="https://via.placeholder.com/400x450" alt="Développeur Web" />
          </div>
          <div className="about-content">
            <h3>Développeur Web & Concepteur d'Applications</h3>
            <p>
              Je suis actuellement en formation Bachelor RPI (Responsable de Projets Informatiques) en deuxième année, après avoir suivi une année en BUT Informatique à Montreuil. Passionné par le développement web et la conception d'applications, je me spécialise dans la création de solutions techniques innovantes.
            </p>
            <p>
              En tant qu'alternant chez MEXI depuis septembre 2023, je travaille sur des projets variés allant du développement d'applications de gestion à la refonte de sites vitrines. Mon approche technique est complétée par une vision orientée utilisateur, cherchant toujours à créer des interfaces intuitives et performantes.
            </p>
            
            <div className="skills">
              <div className="skill-category">
                <h4>Langages & Frameworks</h4>
                <div className="skills-list">
                  {languages.map((skill, index) => (
                    <SkillTag key={index} name={skill} />
                  ))}
                </div>
              </div>
              
              <div className="skill-category">
                <h4>Outils & Technologies</h4>
                <div className="skills-list">
                  {tools.map((tool, index) => (
                    <SkillTag key={index} name={tool} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;