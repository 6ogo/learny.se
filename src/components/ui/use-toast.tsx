
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

// Create a proper callable toast function
interface ToastFunction {
  (props: ToastProps): void;
  defaultTimeout: number;
  default: (props: ToastProps) => void;
  destructive: (props: ToastProps) => void;
}

const createToastFunction = (): ToastFunction => {
  // Main toast function implementation - default variant
  const toastFunction = ((props: ToastProps) => {
    const { addToast } = require("@/hooks/use-toast").useToast();
    addToast({ ...props, variant: "default" });
  }) as ToastFunction;
  
  // Add properties to the function
  toastFunction.defaultTimeout = 7000;
  
  toastFunction.default = (props: ToastProps) => {
    const { addToast } = require("@/hooks/use-toast").useToast();
    addToast({ ...props, variant: "default" });
  };
  
  toastFunction.destructive = (props: ToastProps) => {
    const { addToast } = require("@/hooks/use-toast").useToast();
    addToast({ ...props, variant: "destructive" });
  };
  
  return toastFunction;
};

// Create and export the toast function
export const toast = createToastFunction();
