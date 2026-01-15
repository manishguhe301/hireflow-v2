'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { flushSync } from 'react-dom';
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

  const toggleTheme = async () => {
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? 'light' : 'dark');
      });
    });

    await transition.ready;

    const x = window.innerWidth;
    const y = window.innerHeight;

    // Radial Circle Effect
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(150% at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    );

    // Diagonal Slice Effect
    // document.documentElement.animate(
    //   {
    //     clipPath: [
    //       'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
    //       'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
    //     ],
    //   },
    //   {
    //     duration: 600,
    //     easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    //     pseudoElement: '::view-transition-new(root)',
    //   }
    // );
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
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
        backdrop-blur
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
