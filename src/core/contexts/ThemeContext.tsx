import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Detectar el tema preferido del sistema al cargar
  useEffect(() => {
    // Verificar si el usuario ya tiene una preferencia guardada
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Aplicar el tema al documento HTML
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Eliminar clases anteriores
    root.classList.remove('light-theme', 'dark-theme');
    
    // Añadir la clase correspondiente al tema actual
    root.classList.add(`${theme}-theme`);
    
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para cambiar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};