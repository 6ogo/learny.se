
// src/hooks/use-toast.ts
import { toast } from '@/components/ui/use-toast';

export { toast };
export default toast;

// Override the default toast timeout to 7 seconds
// This will be picked up by the toast provider
toast.defaultTimeout = 7000;
