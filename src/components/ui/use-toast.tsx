
// Original shadcn/ui toast implementation
import { createContext, useContext, useState } from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (props: ToastProps) => void;
  dismissToast: (id: string) => void;
  updateToast: (id: string, props: Partial<ToastProps>) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function addToast(props: ToastProps) {
    setToasts((current) => [...current, { id: crypto.randomUUID(), ...props }]);
  }

  function dismissToast(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function updateToast(id: string, props: Partial<ToastProps>) {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, ...props } : toast
      )
    );
  }

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, dismissToast, updateToast }}
    >
      {children}
    </ToastContext.Provider>
  );
}

// Helper function to create toast with default timeout
function createToast(props: ToastProps) {
  const { addToast } = useToast();
  addToast(props);
}

// Toast component helper functions as callable methods
export const toast = {
  // Default timeout
  defaultTimeout: 5000,

  // Make the toast object directly callable as a function for the default variant
  __proto__: {
    apply: function(target: any, thisArg: any, args: any[]) {
      return target.default.apply(thisArg, args);
    }
  },

  // Toast variants
  default: (props: Omit<ToastProps, "variant">) => {
    const { addToast } = require("@/hooks/use-toast").useToast();
    addToast({ ...props, variant: "default" });
  },
  destructive: (props: Omit<ToastProps, "variant">) => {
    const { addToast } = require("@/hooks/use-toast").useToast();
    addToast({ ...props, variant: "destructive" });
  },
};
