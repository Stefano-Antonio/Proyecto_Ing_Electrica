import React, { useState, useEffect } from 'react';
import './Pie_pagina.css';

const Pie_pagina = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      setIsVisible(scrollPosition >= pageHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${isVisible ? '' : 'hidden'}`}>
      <div className="footer-container">
        <div className="footer-image-1">
          <img src="/images/LogoLabsol.png" alt="Labsol"></img>
        </div>
        
        <div className="footer-content">
          <p>© 2024-2025 Labsol Network.</p>
          <a href="https://www.linkedin.com/in/rogelio-zamarripa-mart%C3%ADnez-518aa6335/">© Rogelio Zamarripa Martínez  (Desarrollador) </a>
          <p>© Stefano Antonio Valdez Peña  (Desarrollador) </p>
        </div>
        <div className="footer-image-2">
          <img src="/images/LogoGPL.png" alt="GPL"></img>
        </div>
      </div>    
    </footer>
  );
};

export default Pie_pagina;