import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, UserPlus, Mail, Home } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const loginSchema = z.object({
  email: z.string().email('Ogiltig e-postadress').min(1, 'E-post måste anges'),
  password: z.string().min(1, 'Lösenord måste anges'),
});

const signupSchema = z.object({
  email: z.string().email('Ogiltig e-postadress').min(1, 'E-post måste anges'),
  password: z.string().min(6, 'Lösenord måste vara minst 6 tecken'),
  confirmPassword: z.string().min(1, 'Bekräfta lösenord'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Lösenorden matchar inte",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email('Ogiltig e-postadress').min(1, 'E-post måste anges'),
});

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, signInWithProvider } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Inloggning misslyckades",
          description: error.message === 'Invalid login credentials' ? 'Fel e-post eller lösenord' : error.message,
        });
        return;
      }
      toast({ title: "Inloggad", description: "Du är nu inloggad" });
      navigate('/home');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ett fel uppstod",
        description: "Kunde inte logga in. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="logo.png" alt="Learny.se" className="h-20 w-auto mx-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">{activeTab === 'login' ? "Logga in på Learny.se" : "Skapa ett konto"}</h2>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
