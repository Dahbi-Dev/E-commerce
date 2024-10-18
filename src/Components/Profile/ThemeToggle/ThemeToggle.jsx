import React from 'react';
import { useTheme } from '../../ThemeProvider/ThemeProvider';
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <span className="slider round">
          {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;