
// Re-export the toast functions from shadcn/ui
import { toast as toastImplementation } from "@/components/ui/use-toast";

// Create a proper useToast hook that returns both toasts array and toast function
export const useToast = () => {
  const { toasts, addToast, dismissToast, updateToast } = require("@/components/ui/use-toast").useToast();
  
  return {
    toasts,
    addToast,
    dismissToast,
    updateToast,
    // Add the toast function to the returned object for convenience
    toast: toastImplementation
  };
};

// Export toast function directly for easier imports in services
export const toast = toastImplementation;
export default toast;

// Override the default toast timeout to 7 seconds
toast.defaultTimeout = 7000;
