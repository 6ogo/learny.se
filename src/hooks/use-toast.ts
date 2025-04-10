
// Re-export the toast functions from shadcn/ui
import { toast as toastImplementation, useToast as useToastOriginal } from "@/components/ui/use-toast";

// Create a proper useToast hook that returns both the context and toast function
export const useToast = () => {
  const toastContext = useToastOriginal();
  
  return {
    ...toastContext,
    toast: toastImplementation
  };
};

// Export toast function directly for easier imports in services
export const toast = toastImplementation;
export default toast;

// Preserve the default timeout
toast.defaultTimeout = 7000;
