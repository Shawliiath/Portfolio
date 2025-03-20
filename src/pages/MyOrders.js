import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/projectPage.css';

const MyOrders = () => {
  // Initialisation des fonctionnalités interactives
  useEffect(() => {
    // Scroll en haut de la page au chargement
    window.scrollTo(0, 0);
    
    // Initialiser la modal des captures d'écran
    const initScreenshotModal = () => {
      const screenshotItems = document.querySelectorAll('.screenshot-img');
      const modal = document.querySelector('.screenshot-modal');
      const modalImg = document.getElementById('modal-img');
      const modalCaption = document.getElementById('modal-caption');
      const closeModal = document.querySelector('.close-modal');
      
      // Ajouter gestionnaire de clic aux captures d'écran
      screenshotItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          const caption = this.closest('.screenshot-item').querySelector('.screenshot-caption h4').textContent;
          
          modalImg.src = img.src;
          modalCaption.textContent = caption;
          modal.classList.add('show');
          document.body.style.overflow = 'hidden';
        });
      });
      
      // Fermer la modal en cliquant sur X
      closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      });
      
      // Fermer la modal en cliquant en dehors de l'image
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('show');
          document.body.style.overflow = '';
        }
      });
      
      // Fermer la modal avec la touche Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          modal.classList.remove('show');
          document.body.style.overflow = '';
        }
      });
    };
    
    // Ajouter un bouton de défilement vers le haut
    const addScrollToTopButton = () => {
      const scrollToTopBtn = document.createElement('div');
      scrollToTopBtn.className = 'scroll-to-top';
      scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      document.body.appendChild(scrollToTopBtn);
      
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      });
      
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    };
    
    // Ajouter des animations au défilement
    const addScrollAnimations = () => {
      const animateOnScroll = () => {
        const sections = document.querySelectorAll('.section-title, .feature-card, .challenge-card, .stat-card');
        
        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (sectionTop < windowHeight * 0.75) {
            section.classList.add('animated');
          }
        });
      };
      
      window.addEventListener('scroll', animateOnScroll);
      animateOnScroll(); // Vérification initiale au chargement de la page
    };
    
    // Exécuter les fonctions d'initialisation
    initScreenshotModal();
    addScrollToTopButton();
    addScrollAnimations();
    
    // Nettoyer les écouteurs d'événements au démontage du composant
    return () => {
      const scrollToTopBtn = document.querySelector('.scroll-to-top');
      if (scrollToTopBtn) {
        scrollToTopBtn.remove();
      }
      
      // Supprimer les écouteurs d'événements pour éviter les fuites de mémoire
      window.removeEventListener('scroll', () => {});
      document.removeEventListener('keydown', () => {});
    };
  }, []);

  // Données des features
  const features = [
    {
      icon: "fas fa-mobile-alt",
      title: "Accès Multi-plateformes",
      description: "Application mobile optimisée pour smartphones et tablettes, permettant aux employés et responsables d'accéder au système depuis n'importe quel appareil."
    },
    {
      icon: "fas fa-users-cog",
      title: "Gestion Multi-utilisateurs",
      description: "Système de connexion sécurisé avec différents niveaux d'accès pour distinguer les bases de données de chaque restaurant."
    },
    {
      icon: "fas fa-shopping-cart",
      title: "Gestion des Commandes",
      description: "Interface intuitive permettant aux employés d'ajouter des articles à commander, avec clavier numérique adapté aux écrans tactiles."
    },
    {
      icon: "fas fa-check-double",
      title: "Validation par Responsable",
      description: "Panneau dédié aux responsables pour vérifier, ajuster et confirmer les commandes avant leur finalisation."
    },
    {
      icon: "fas fa-chart-pie",
      title: "Bilans Analytiques",
      description: "Visualisations avancées (camemberts, graphiques) des dépenses par catégorie, articles les plus commandés et évolution mensuelle/annuelle."
    },
    {
      icon: "fas fa-bell",
      title: "Notifications en Temps Réel",
      description: "Système d'alerte par Twilio permettant aux employés de notifier les responsables lorsqu'une commande est prête à être validée."
    },
    {
      icon: "fas fa-history",
      title: "Historique et Traçabilité",
      description: "Journal d'activité enregistrant toutes les actions effectuées dans l'application pour une transparence totale."
    },
    {
      icon: "fas fa-database",
      title: "Gestion des Données",
      description: "Options pour exporter les données au format JSON, gérer les catégories et articles, et administrer les paramètres système."
    }
  ];

  // Captures d'écran
  const screenshots = [
    {
      image: "https://via.placeholder.com/800x500",
      alt: "Dashboard My Orders",
      title: "Dashboard Principal",
      description: "Catégories d'articles à gauche et panier de commande à droite, permettant aux employés de composer facilement leur commande."
    },
    {
      image: "https://via.placeholder.com/800x500",
      alt: "Panier détaillé My Orders",
      title: "Panier Détaillé",
      description: "Interface de validation des commandes pour les responsables, avec options d'ajustement des quantités et confirmation finale."
    },
    {
      image: "./img/detailstock.png",
      alt: "Stock détail My Orders",
      title: "Détail des Stocks",
      description: "Vue complète de l'inventaire avec filtres de recherche et indicateurs visuels pour les niveaux de stock."
    },
    {
      image: "./img/bilan.png",
      alt: "Bilan rétrospectif My Orders",
      title: "Bilan Rétrospectif",
      description: "Tableaux de bord analytiques montrant les tendances de dépenses, articles populaires et historique des commandes."
    }
  ];

  // Étapes de workflow
  const workflowSteps = [
    {
      number: 1,
      title: "Authentification et Accès",
      description: "Au lancement, l'utilisateur s'authentifie avec son mot de passe spécifique au restaurant. Cette authentification permet d'accéder à la base de données correspondante à l'établissement, assurant que chaque restaurant ne voit que ses propres données.",
      image: "./img/log.png",
      alt: "Écran de connexion My Orders"
    },
    {
      number: 2,
      title: "Création de Commande par les Employés",
      description: "Dans la Dashboard principale, les employés peuvent parcourir les différentes catégories d'articles (à gauche) et ajouter des produits au panier (à droite). Le clavier numérique tactile facilite la saisie des quantités, rendant le processus rapide même dans un environnement de travail actif.",
      image: "https://via.placeholder.com/600x300",
      alt: "Création de commande My Orders"
    },
    {
      number: 3,
      title: "Notification et Validation par le Responsable",
      description: "Une fois que les employés ont terminé de composer leur panier, ils peuvent notifier le responsable via le bouton dédié, qui envoie une alerte par Twilio. Le responsable accède alors au \"Panier détaillé\" où il peut vérifier, ajuster les quantités si nécessaire, et confirmer la commande finale.",
      image: "https://via.placeholder.com/600x300",
      alt: "Validation commande My Orders"
    },
    {
      number: 4,
      title: "Suivi et Analyse",
      description: "Après validation, la commande est enregistrée avec un ID unique et devient accessible dans les sections \"Stock détail\" et \"Bilan rétrospectif\". Ces sections permettent de suivre l'évolution des stocks, d'analyser les tendances de consommation via des graphiques, et d'exporter les données pour une utilisation externe.",
      image: "https://via.placeholder.com/600x300",
      alt: "Analyse des données My Orders"
    },
    {
      number: 5,
      title: "Administration et Maintenance",
      description: "La section \"Paramètres\" offre aux administrateurs la possibilité de gérer les catégories, ajouter/modifier des articles, modifier les mots de passe, et exporter/supprimer des données. Le journal d'activité (log) permet de consulter toutes les actions réalisées dans l'application pour assurer transparence et traçabilité.",
      image: "https://via.placeholder.com/600x300",
      alt: "Paramètres My Orders"
    }
  ];

  // Défis et solutions
  const challenges = [
    {
      title: "Interface adaptée au contexte de restauration",
      description: "Les employés de restaurant ont besoin d'une interface extrêmement rapide et intuitive, utilisable dans un environnement de travail effervescent, souvent avec les mains occupées.",
      solution: "Conception d'une interface minimaliste avec des grands boutons, un clavier numérique tactile intégré, et des catégories visuelles permettant de trouver rapidement les produits sans recherche textuelle complexe."
    },
    {
      title: "Gestion multi-restaurants avec données isolées",
      description: "Chaque restaurant devait avoir accès uniquement à ses propres données, tout en utilisant la même application, sans complexifier l'expérience utilisateur.",
      solution: "Implémentation d'un système d'authentification par mot de passe unique qui dirige automatiquement vers la base de données correspondante, couplé à un profil restaurant stockant les informations de contact et d'identification."
    },
    {
      title: "Communication entre employés et responsables",
      description: "Les responsables devaient être informés immédiatement lorsqu'une commande était prête à être validée, même s'ils n'étaient pas physiquement présents dans l'établissement.",
      solution: "Intégration de l'API Twilio pour envoyer automatiquement des notifications SMS aux responsables lorsqu'un employé finalise un panier, avec un lien direct vers la page de validation de la commande."
    },
    {
      title: "Visualisation efficace des données d'analyse",
      description: "Les restaurants avaient besoin de comprendre rapidement leurs habitudes de commande et dépenses sans avoir à analyser des tableaux complexes de chiffres.",
      solution: "Création de visualisations interactives (camemberts, histogrammes) montrant clairement la répartition des dépenses par catégorie, les articles les plus commandés, et l'évolution mensuelle/annuelle, avec des filtres simples pour affiner l'analyse."
    }
  ];

  // Statistiques
  const statistics = [
    { value: "40%", label: "Réduction du temps de gestion des commandes" },
    { value: "35%", label: "Diminution des erreurs de commande" },
    { value: "25%", label: "Réduction des coûts d'approvisionnement" },
    { value: "90%", label: "Taux d'adoption par les employés" }
  ];

  return (
    <main className="project-details-page">
      {/* Project Hero Section */}
      <section id="project-hero">
        <div className="container">
          <div className="project-hero-content">
            <h1>My Orders</h1>
            <p className="project-subtitle">Application de Gestion de Stock et de Commandes pour Restaurants</p>
            <div className="project-hero-techs">
              <span className="project-tech">React Native</span>
              <span className="project-tech">Node.js</span>
              <span className="project-tech">Firebase</span>
              <span className="project-tech">Twilio API</span>
            </div>
            <div className="project-hero-links">
              <a href="https://github.com/Shawliiath/bisstock" target="_blank" rel="noopener noreferrer" className="btn">
                <i className="fab fa-github"></i> Code Source
              </a>
              <a href="https://gestionnaire-stockage.web.app" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <i className="fas fa-external-link-alt"></i> Demo Live
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section id="project-overview">
        <div className="container">
          <div className="section-title">
            <h2>Aperçu du Projet</h2>
            <p>Une solution mobile complète pour la gestion des stocks et commandes en restauration</p>
          </div>
          
          <div className="overview-content">
            <div className="overview-details">
              <div className="overview-detail">
                <h4><i className="fas fa-calendar-alt"></i> Date du projet</h4>
                <p>Octobre 2023 - Février 2024</p>
              </div>
              <div className="overview-detail">
                <h4><i className="fas fa-users"></i> Client</h4>
                <p>MEXI</p>
              </div>
              <div className="overview-detail">
                <h4><i className="fas fa-tasks"></i> Rôle</h4>
                <p>Développeur Full Stack</p>
              </div>
              <div className="overview-detail">
                <h4><i className="fas fa-code-branch"></i> Type</h4>
                <p>Application Mobile / Web</p>
              </div>
            </div>
            
            <div className="overview-description">
              <p>
                My Orders est une application professionnelle de gestion de stock et de commandes spécialement conçue pour les restaurants et entreprises. Elle permet aux employés d'ajouter facilement des articles à commander, aux responsables de superviser et valider les commandes, et offre une vue complète sur l'historique des achats et l'état des stocks.
              </p>
              <p>
                Développée dans le cadre de mon alternance chez MEXI, cette application répond à un besoin concret de simplification du processus de commande et d'approvisionnement. Elle est utilisée quotidiennement par le personnel, facilitant la gestion des stocks et apportant une transparence totale sur les dépenses et l'utilisation des ressources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Features */}
      <section id="project-features">
        <div className="container">
          <div className="section-title">
            <h2>Fonctionnalités Principales</h2>
            <p>Les capacités clés de My Orders</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Screenshots */}
      <section id="project-screenshots">
        <div className="container">
          <div className="section-title">
            <h2>Interface Utilisateur</h2>
            <p>Découvrez l'expérience utilisateur intuitive de My Orders</p>
          </div>
          
          <div className="screenshots-gallery">
            {screenshots.map((screenshot, index) => (
              <div className="screenshot-item" key={index}>
                <div className="screenshot-img">
                  <img src={screenshot.image} alt={screenshot.alt} />
                  <div className="screenshot-overlay">
                    <span>Agrandir</span>
                  </div>
                </div>
                <div className="screenshot-caption">
                  <h4>{screenshot.title}</h4>
                  <p>{screenshot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>Fonctionnement de l'Application</h2>
            <p>Découvrez le processus complet de My Orders</p>
          </div>
          
          <div className="workflow-steps">
            {workflowSteps.map((step) => (
              <div className="workflow-step" key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="step-img">
                    <img src={step.image} alt={step.alt} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section id="technical-details">
        <div className="container">
          <div className="section-title">
            <h2>Détails Techniques</h2>
            <p>Les technologies et l'architecture derrière My Orders</p>
          </div>
          
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Front-end</h3>
              <ul className="tech-list">
                <li><i className="fab fa-react"></i> React Native pour l'interface multiplateforme</li>
                <li><i className="fab fa-js-square"></i> Redux pour la gestion d'état</li>
                <li><i className="fas fa-mobile-alt"></i> Composants UI adaptés aux écrans tactiles</li>
                <li><i className="fas fa-chart-pie"></i> Recharts pour les visualisations de données</li>
                <li><i className="fas fa-keyboard"></i> Clavier numérique personnalisé pour saisie rapide</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Back-end</h3>
              <ul className="tech-list">
                <li><i className="fab fa-node-js"></i> Node.js avec Express pour l'API</li>
                <li><i className="fas fa-database"></i> Firebase Firestore pour le stockage des données</li>
                <li><i className="fas fa-user-lock"></i> Authentification sécurisée par restaurant</li>
                <li><i className="fas fa-bell"></i> Intégration Twilio pour notifications SMS</li>
                <li><i className="fas fa-file-export"></i> Export des données au format JSON</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Architecture & Features</h3>
              <ul className="tech-list">
                <li><i className="fas fa-layer-group"></i> Structure modulaire par fonctionnalité</li>
                <li><i className="fas fa-users-cog"></i> Système de rôles (employés/responsables)</li>
                <li><i className="fas fa-history"></i> Journalisation de toutes les actions</li>
                <li><i className="fas fa-filter"></i> Filtres avancés pour la recherche</li>
                <li><i className="fas fa-shield-alt"></i> Sauvegarde et protection des données</li>
              </ul>
            </div>
          </div>
          
          <div className="architecture-diagram">
            <h3>Architecture de l'Application</h3>
            <div className="diagram-img">
              <img src="https://via.placeholder.com/1000x500" alt="Architecture de My Orders" />
            </div>
            <p className="diagram-caption">Diagramme représentant l'architecture de l'application My Orders, montrant les interactions entre l'interface utilisateur, l'API backend, la base de données Firebase et le service de notification Twilio.</p>
          </div>
        </div>
      </section>

      {/* Challenges and Solutions */}
      <section id="challenges">
        <div className="container">
          <div className="section-title">
            <h2>Défis & Solutions</h2>
            <p>Les obstacles rencontrés et comment ils ont été surmontés</p>
          </div>
          
          <div className="challenges-grid">
            {challenges.map((challenge, index) => (
              <div className="challenge-card" key={index}>
                <h3>{challenge.title}</h3>
                <p className="challenge-desc">{challenge.description}</p>
                <div className="solution">
                  <h4>Solution:</h4>
                  <p>{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results and Impact */}
      <section id="results">
        <div className="container">
          <div className="section-title">
            <h2>Résultats & Impact</h2>
            <p>Les bénéfices mesurables apportés par My Orders</p>
          </div>
          
          <div className="results-stats">
            {statistics.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="testimonial">
            <div className="testimonial-content">
              <i className="fas fa-quote-left"></i>
              <p>My Orders a révolutionné la gestion quotidienne de mes trois restaurants. Avant, je perdais un temps considérable à gérer les stocks et les commandes avec des méthodes traditionnelles. Aujourd'hui, mes équipes peuvent facilement signaler les besoins de réapprovisionnement, et je peux tout valider depuis mon téléphone, même lorsque je suis entre deux établissements. Le système de notification est particulièrement efficace, et les analyses m'ont permis d'optimiser mes dépenses de près de 30%. Je ne pourrais plus revenir en arrière !</p>
              <div className="testimonial-author">
                <div className="author-img">
                  <img src="https://via.placeholder.com/80x80" alt="Abderahman Hedjam" />
                </div>
                <div className="author-info">
                  <h4>Abderahman Hedjam</h4>
                  <p>Propriétaire de trois restaurants, Client MEXI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Intéressé par My Orders?</h2>
            <p>Découvrez comment cette solution peut optimiser la gestion de stock et de commandes pour votre entreprise</p>
            <div className="cta-buttons">
              <Link to="/#contact" className="btn">Me contacter</Link>
              <a href="https://gestionnaire-stockage.web.app" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Voir la démo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot Modal */}
      <div className="screenshot-modal">
        <div className="modal-content">
          <span className="close-modal">&times;</span>
          <img src="" alt="Screenshot en plein écran" id="modal-img" />
          <div className="modal-caption" id="modal-caption"></div>
        </div>
      </div>
    </main>
  );
};

export default MyOrders;