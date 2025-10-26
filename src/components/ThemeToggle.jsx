import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Verifica se há preferência salva
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-all"
      aria-label="Alternar tema"
    >
      {darkMode ? (
        <span className="text-xl">🌞</span>
      ) : (
        <span className="text-xl">🌙</span>
      )}
    </button>
  );
}

export default ThemeToggle;
