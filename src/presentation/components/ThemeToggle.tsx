import React from 'react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none transition-colors duration-200"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6 text-[#C9A14A]" />
      ) : (
        <MoonIcon className="h-6 w-6 text-[#C9A14A]" />
      )}
    </button>
  );
};

export default ThemeToggle;