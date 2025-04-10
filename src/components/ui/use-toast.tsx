
import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (props: ToastProps) => void;
  dismissToast: (id: string) => void;
  updateToast: (id: string, props: Partial<ToastProps>) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((props: ToastProps) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), ...props }]);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = React.useCallback((id: string, props: Partial<ToastProps>) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))
    );
  }, []);

  const value = React.useMemo(
    () => ({
      toasts,
      addToast,
      dismissToast,
      updateToast,
    }),
    [toasts, addToast, dismissToast, updateToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

