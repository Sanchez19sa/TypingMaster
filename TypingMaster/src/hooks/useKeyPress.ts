import { useEffect } from 'react';

export const useKeyPress = (callback: (key: string) => void, isEnabled: boolean = true) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        callback(event.key);
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [callback, isEnabled]);
};

