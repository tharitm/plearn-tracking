"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Assuming this is the correct path
import { useGlobalErrorStore } from '@/stores/globalErrorStore';

export function GlobalErrorToast() {
  const { toast, dismiss } = useToast();
  const { error, isOpen, clearError, closeError } = useGlobalErrorStore();

  useEffect(() => {
    if (error && isOpen) {
      // Display the toast
      const { id: toastId } = toast({
        title: "Error Occurred",
        description: error,
        variant: "destructive", // Assuming you have a 'destructive' variant in your toast component
        duration: 5000, // Keep the toast visible for 5 seconds
        onOpenChange: (open) => {
          if (!open) {
            // If the toast is closed by timer or user action, clear the error from the store
            // We use closeError() instead of clearError() to allow manual re-opening if needed,
            // without losing the error message itself until a new error occurs or it's explicitly cleared.
            closeError();
          }
        },
      });

      // Optional: If you want to dismiss programmatically after some time
      // const timer = setTimeout(() => {
      //   dismiss(toastId);
      //   clearError(); // Or closeError();
      // }, 5000); // Match duration or make it longer
      // return () => clearTimeout(timer);

    }
  }, [error, isOpen, toast, dismiss, clearError, closeError]);

  return null; // This component does not render anything itself, only manages toasts
}
