'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      richColors
      closeButton
      position='bottom-right'
      theme={theme as 'light' | 'dark' | 'system'}
    />
  );
}