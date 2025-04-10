
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

// Toast component helper function
export const toast = {
  // Default timeout
  defaultTimeout: 5000,

  // Toast variants
  default: (props: Omit<ToastProps, "variant">) => {
    const { useToast } = require("@/hooks/use-toast");
    const { addToast } = useToast();
    addToast({ ...props, variant: "default" });
  },
  destructive: (props: Omit<ToastProps, "variant">) => {
    const { useToast } = require("@/hooks/use-toast");
    const { addToast } = useToast();
    addToast({ ...props, variant: "destructive" });
  },
};
