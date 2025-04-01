import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, UserPlus, Apple, Mail, Home } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Turnstile } from '@marsidev/react-turnstile';

const TURNSTILE_SITE_KEY = "0x4AAAAAAAQnUdR15g5GRSio"; // Replace with your actual site key if different

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, signInWithProvider } = useAuth();
  const turnstileRef = useRef(null);

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

  const handleCaptchaVerification = (token: string) => {
    console.log("Captcha verified:", token);
    setCaptchaToken(token);
  };

  const handleCaptchaError = () => {
    toast({
      variant: "destructive",
      title: "Captcha verifiering misslyckades",
      description: "Vänligen försök igen.",
    });
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Inloggning misslyckades",
          description: error.message === 'Invalid login credentials' 
            ? 'Fel e-post eller lösenord' 
            : error.message,
        });
        return;
      }

      toast({
        title: "Inloggad",
        description: "Du är nu inloggad",
      });
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

  const handleSignUp = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);

    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Captcha verifiering krävs",
        description: "Vänligen slutför captcha-verifieringen innan du registrerar dig.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error, data } = await signUp(
        values.email, 
        values.password, 
        { captchaToken }
      );
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            variant: "destructive",
            title: "Registrering misslyckades",
            description: "En användare med denna e-post finns redan. Försök logga in istället.",
          });
        } else if (error.message.includes('captcha')) {
          toast({
            variant: "destructive",
            title: "Registrering misslyckades",
            description: "Captcha verifiering misslyckades. Vänligen försök igen.",
          });
          // Reset the captcha
          if (turnstileRef.current) {
            // @ts-ignore
            turnstileRef.current.reset();
          }
          setCaptchaToken(null);
        } else {
          toast({
            variant: "destructive",
            title: "Registrering misslyckades",
            description: error.message,
          });
        }
        return;
      }

      toast({
        title: "Konto skapat",
        description: data?.user?.identities?.[0]?.identity_data?.email_confirmed_at
          ? "Du är nu registrerad och inloggad."
          : "Kontrollera din e-post för att bekräfta ditt konto.",
      });

      if (data?.user?.identities?.[0]?.identity_data?.email_confirmed_at) {
        navigate('/home');
      } else {
        setActiveTab('login');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ett fel uppstod",
        description: "Kunde inte skapa konto. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await resetPassword(values.email);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Återställning misslyckades",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Återställning skickad",
        description: "Kontrollera din e-post för instruktioner om att återställa lösenordet.",
      });
      setIsResetPassword(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ett fel uppstod",
        description: "Kunde inte skicka återställningslänk. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ett fel uppstod",
        description: `Kunde inte logga in med ${provider === 'google' ? 'Google' : 'Apple'}.`,
      });
    }
  };

  const handleTabChange = (value: string) => {
    setCaptchaToken(null);
    setActiveTab(value as 'login' | 'signup');
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/logo.png" 
            alt="Learny.se" 
            className="h-20 w-auto mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isResetPassword 
              ? "Återställ ditt lösenord" 
              : activeTab === 'login' 
                ? "Logga in på Learny.se" 
                : "Skapa ett konto"}
          </h2>
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-gray-800 flex items-center"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Tillbaka till startsidan</span>
            </Button>
          </div>
        </div>

        {isResetPassword ? (
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Återställ lösenord</CardTitle>
              <CardDescription className="text-gray-300">
                Ange din e-postadress så skickar vi instruktioner för att återställa lösenordet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="namn@exempel.se" 
                            {...field} 
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-learny-purple hover:bg-learny-purple-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? "Skickar..." : "Skicka återställningslänk"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => setIsResetPassword(false)}
                className="text-learny-purple"
              >
                Tillbaka till inloggning
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700 text-white">
            <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="login" className="data-[state=active]:bg-learny-purple data-[state=active]:text-white">
                  Logga in
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-learny-purple data-[state=active]:text-white">
                  Registrera dig
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 hover:bg-gray-700"
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 hover:bg-gray-700"
                        onClick={() => handleSocialLogin('apple')}
                      >
                        <Apple className="mr-2 h-5 w-5" />
                        Apple
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-800 px-2 text-gray-400">
                          eller fortsätt med e-post
                        </span>
                      </div>
                    </div>

                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-post</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="namn@exempel.se" 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>Lösenord</FormLabel>
                                <Button 
                                  type="button" 
                                  variant="link" 
                                  className="text-xs text-learny-purple h-auto p-0"
                                  onClick={() => setIsResetPassword(true)}
                                >
                                  Glömt lösenord?
                                </Button>
                              </div>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-learny-purple hover:bg-learny-purple-dark"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              <span>Loggar in...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <LogIn className="h-5 w-5" />
                              <span>Logga in</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </TabsContent>
              <TabsContent value="signup">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 hover:bg-gray-700"
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 hover:bg-gray-700"
                        onClick={() => handleSocialLogin('apple')}
                      >
                        <Apple className="mr-2 h-5 w-5" />
                        Apple
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-800 px-2 text-gray-400">
                          eller registrera med e-post
                        </span>
                      </div>
                    </div>

                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-post</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="namn@exempel.se" 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lösenord</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bekräfta lösenord</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-center py-2">
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={handleCaptchaVerification}
                            onError={handleCaptchaError}
                          />
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Genom att registrera dig accepterar du våra användarvillkor och integritetspolicy.
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-learny-purple hover:bg-learny-purple-dark"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              <span>Registrerar...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <UserPlus className="h-5 w-5" />
                              <span>Registrera dig</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
