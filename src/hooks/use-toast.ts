
import { useToast as useToastOriginal } from "@/components/ui/use-toast";
import { toast as toastOriginal } from "@/components/ui/use-toast";

// Re-export the original useToast function
export const useToast = useToastOriginal;

// Export toast as default and as a named export
export const toast = toastOriginal;
export default toast;

// Override the default toast timeout to 7 seconds
// This will be picked up by the toast provider
toast.defaultTimeout = 7000;
