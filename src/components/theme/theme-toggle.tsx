'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    //eslint-disable-next-line 
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="
        fixed bottom-6 right-6
        z-9999
        flex items-center justify-center
        h-12 w-12
        rounded-full
        border border-border
        bg-card
        text-foreground
        shadow-lg
        transition-all
        hover:scale-105
        hover:bg-muted
        active:scale-95
        cursor-pointer
      "
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-warning" />
      ) : (
        <Moon className="h-5 w-5 text-primary" />
      )}
    </button>
  );
}
