'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'apex_theme_mode';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to dark mode as requested by sports platform specs
        setTheme('dark');
        applyTheme('dark');
      }
    } catch {
      applyTheme('dark');
    } finally {
      setMounted(true);
    }
  }, []);

  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (e) {
        console.error('Failed to save theme:', e);
      }
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  const setSpecificTheme = useCallback((targetTheme: Theme) => {
    setTheme(targetTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
    applyTheme(targetTheme);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setSpecificTheme,
    mounted,
  };
}
