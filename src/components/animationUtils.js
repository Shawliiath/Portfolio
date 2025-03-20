// Function to initialize animations on scroll
export const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll(
      '.section-title, .about-img, .about-content, .project-card, .timeline-item, .contact-info, .contact-form'
    );
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Once animation is triggered, no need to observe anymore
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  };