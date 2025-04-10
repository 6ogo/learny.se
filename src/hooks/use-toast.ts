
import { useToast as useToastOriginal } from "@/components/ui/use-toast";
import type { ToastProps } from "@/components/ui/toast";

// Create a standalone toast function
// This handles both direct usage and usage through the hook
export const toast = (props: ToastProps) => {
  // This function will be called when someone imports 'toast' directly
  try {
    const toastContext = useToastOriginal();
    toastContext.addToast(props);
  } catch (error) {
    // We're likely outside a ToastProvider
    console.error("Toast was called outside a ToastProvider", error);
  }
};

// Add toast variants
toast.default = (props: ToastProps) => toast({ ...props, variant: "default" });
toast.destructive = (props: ToastProps) => toast({ ...props, variant: "destructive" });

// Set default timeout
toast.defaultTimeout = 7000;

// Create a proper useToast hook that returns both the context and toast function
export const useToast = () => {
  const toastContext = useToastOriginal();
  
  // Wrap the addToast function to include variant if not specified
  const enhancedAddToast = (props: ToastProps) => {
    toastContext.addToast({
      ...props,
      variant: props.variant || "default",
    });
  };
  
  return {
    ...toastContext,
    toast: enhancedAddToast
  };
};

export default toast;
