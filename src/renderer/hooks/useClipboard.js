import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text, label = 'Value') => {
    try {
      await window.api.color.copy(text);
      setCopied(true);
      toast.success(`${label} copied!`, {
        description: text,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  }, []);

  return { copy, copied };
}

export default useClipboard;
