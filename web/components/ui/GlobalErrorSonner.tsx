"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGlobalErrorStore } from '@/stores/globalErrorStore';

export function GlobalErrorSonner() {
  const { error, isOpen, closeError } = useGlobalErrorStore();
  const displayedErrorRef = useRef<string | null>(null);

  useEffect(() => {
    // Only display toast if there's an error, it's open, and it's a new error message
    if (error && isOpen && error !== displayedErrorRef.current) {
      toast.error(error, {
        duration: 5000, // Show for 5 seconds
        onDismiss: () => {
          // When toast is dismissed (either by timer or manually),
          // mark it as no longer "open" in the store.
          // This allows the same error message to be shown again if setError is called again.
          closeError();
          displayedErrorRef.current = null; // Reset displayed error ref
        },
        onAutoClose: () => {
          // Also handle auto-close
          closeError();
          displayedErrorRef.current = null; // Reset displayed error ref
        }
      });
      displayedErrorRef.current = error; // Mark this error message as displayed
    } else if (!isOpen) {
      // If the error is cleared or closed from elsewhere, reset the ref
      displayedErrorRef.current = null;
    }
  }, [error, isOpen, closeError]);

  return null; // This component does not render anything itself
}
