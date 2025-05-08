import { useEffect } from 'react';

export default function useKey(key, callback) {
  // keybinding esc to close movie details
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
}
