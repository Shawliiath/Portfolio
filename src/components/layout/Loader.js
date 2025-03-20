import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-wrapper ${isLoading ? '' : 'loader-hidden'}`}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;