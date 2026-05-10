'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('cv-studio-theme') as 'light' | 'dark' | null;
    const initial = saved || 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cv-studio-theme', next);
  }

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={toggle}
      aria-label="Toggle theme"
      style={{ minWidth: 32, fontWeight: 400 }}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
