import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="checkbox">
        <input 
          type="checkbox" 
          id="checkbox" 
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="slider round">
          <i className="fas fa-sun"></i>
          <i className="fas fa-moon"></i>
        </div>
      </label>
    </div>
  );
};

export default ThemeSwitcher;