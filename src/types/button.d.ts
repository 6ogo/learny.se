
declare module '@/components/ui/button' {
    import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
    
    export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
      size?: 'default' | 'sm' | 'lg' | 'icon';
      asChild?: boolean;
      children?: ReactNode;
    }
    
    export const Button: React.ForwardRefExoticComponent<
      ButtonProps & React.RefAttributes<HTMLButtonElement>
    >;
    
    export const buttonVariants: (options?: {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
      size?: 'default' | 'sm' | 'lg' | 'icon';
      className?: string;
    }) => string;
  }
