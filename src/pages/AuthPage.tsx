import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase'; // Adjust import to your project structure
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useToast } from '@/hooks/use-toast';

const TURNSTILE_SITE_KEY = "0x4AAAAAABDOuPFbAkkkAxlz"; // Your Turnstile site key from Supabase

// Custom hook to handle Supabase auth with CAPTCHA
const useSupabaseAuthWithCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const { toast } = useToast();

  // Custom signup function that includes the CAPTCHA token
  const signUpWithCaptcha = async (email, password) => {
    if (!captchaToken) {
      toast({
        variant: "destructive",
        title: "Captcha verifiering krävs",
        description: "Vänligen slutför captcha-verifieringen innan du registrerar dig.",
      });
      return { error: { message: "CAPTCHA verification required" } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
        },
      });

      return { data, error };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  return {
    captchaToken,
    setCaptchaToken,
    signUpWithCaptcha,
  };
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { captchaToken, setCaptchaToken, signUpWithCaptcha } = useSupabaseAuthWithCaptcha();
  
  // State for our custom form
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle the form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUpWithCaptcha(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registrering misslyckades",
        description: error.message,
      });
    } else {
      toast({
        title: "Konto skapat",
        description: "Kontrollera din e-post för att bekräfta ditt konto.",
      });
      setActiveTab('login');
    }

    setLoading(false);
  };

  // Handle sign in with Supabase directly
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Inloggning misslyckades",
        description: error.message === 'Invalid login credentials' ? 
          'Fel e-post eller lösenord' : error.message,
      });
    } else {
      toast({ 
        title: "Inloggad", 
        description: "Du är nu inloggad" 
      });
      navigate('/home');
    }

    setLoading(false);
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
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
            {activeTab === 'login' ? 'Logga in på Learny.se' : 'Skapa ett konto'}
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

        <div className="bg-gray-800 border-gray-700 text-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button 
              className={`py-2 px-4 text-center rounded-md ${activeTab === 'login' ? 'bg-learny-purple text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setActiveTab('login')}
            >
              Logga in
            </button>
            <button 
              className={`py-2 px-4 text-center rounded-md ${activeTab === 'signup' ? 'bg-learny-purple text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setActiveTab('signup')}
            >
              Registrera dig
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-600 hover:bg-gray-700"
                onClick={() => handleSocialLogin('google')}
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"
                  />
                </svg>
                <span>Google</span>
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

            {activeTab === 'login' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">E-post</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namn@exempel.se"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-learny-purple focus:border-learny-purple"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-white">Lösenord</label>
                    <a href="#" className="text-xs text-learny-purple hover:text-learny-purple-dark">
                      Glömt lösenord?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-learny-purple focus:border-learny-purple"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-learny-purple hover:bg-learny-purple-dark flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Loggar in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      <span>Logga in</span>
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white">E-post</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namn@exempel.se"
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-learny-purple focus:border-learny-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">Lösenord</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-learny-purple focus:border-learny-purple"
                  />
                </div>
                
                <div className="flex justify-center py-2">
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onError={() => {
                      toast({
                        variant: "destructive",
                        title: "Captcha verifiering misslyckades",
                        description: "Vänligen försök igen.",
                      });
                      setCaptchaToken(null);
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-400">
                  Genom att registrera dig accepterar du våra användarvillkor och integritetspolicy.
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-learny-purple hover:bg-learny-purple-dark flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Registrerar...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      <span>Registrera dig</span>
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
