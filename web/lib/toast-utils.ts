import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning" | "message";

interface ToastOptions {
  description?: string;
  duration?: number;
  // Add other Sonner options as needed, e.g., action buttons
}

/**
 * Displays a toast notification.
 *
 * @param message The main message for the toast.
 * @param type The type of toast ('success', 'error', 'info', 'warning', 'message').
 * @param options Optional parameters like description, duration.
 */
export const showToast = (
  message: string,
  type: ToastType = "message",
  options?: ToastOptions
) => {
  const toastProps = {
    description: options?.description,
    duration: options?.duration,
    // ... other potential options like action
  };

  switch (type) {
    case "success":
      toast.success(message, toastProps);
      break;
    case "error":
      toast.error(message, toastProps);
      break;
    case "info":
      toast.info(message, toastProps);
      break;
    case "warning":
      toast.warning(message, toastProps);
      break;
    case "message":
    default:
      toast(message, toastProps); // Default simple message toast
      break;
  }
};
