import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
  copiedText: string | null;
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export function useCopyToClipboard(timeout = 2000): UseCopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);

        return true;
      } catch (error) {
        console.warn('Copy failed', error);
        setCopiedText(null);
        setIsCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copiedText, isCopied, copyToClipboard };
}
