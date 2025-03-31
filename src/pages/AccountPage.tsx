
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { User, CreditCard, LogOut, AlertTriangle, ChevronRight, Shield, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AccountPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { currentTierDetails, refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ett fel uppstod",
        description: "Kunde inte logga ut. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {});
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        variant: "destructive",
        title: "Kunde inte öppna betalningssidan",
        description: "Ett problem uppstod. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Mitt konto</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-learny-purple" />
                Profil
              </CardTitle>
              <CardDescription className="text-gray-400">
                Hantera dina kontoinställningar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">E-post</p>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Användar-ID</p>
                <p className="text-white">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Medlem sedan</p>
                <p className="text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('sv-SE') : 'N/A'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                Redigera profil
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-learny-purple" />
                Prenumeration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Hantera din prenumeration och betalningar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Aktuell plan</p>
                  <p className="text-xl font-semibold text-white flex items-center">
                    {currentTierDetails.name}
                    {currentTierDetails.id !== 'free' && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-learny-purple/20 text-learny-purple">
                        Aktiv
                      </span>
                    )}
                  </p>
                </div>
                {currentTierDetails.id !== 'free' && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Kostnad</p>
                    <p className="text-white">{currentTierDetails.price}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 rounded-md p-4">
                <h3 className="font-medium mb-2">Inkluderade funktioner:</h3>
                <ul className="space-y-1">
                  {currentTierDetails.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-learny-purple/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-learny-purple" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto bg-learny-purple hover:bg-learny-purple-dark"
              >
                Byt plan
              </Button>
              {currentTierDetails.id !== 'free' && (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-gray-600 text-white hover:bg-gray-700"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Laddar..." : "Hantera betalningar"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-learny-purple" />
                Kontosäkerhet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-white hover:bg-gray-700"
                onClick={() => navigate('/account/password')}
              >
                Byt lösenord <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-between text-white hover:bg-gray-700"
              >
                Tvåfaktorsautentisering <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Farlig zon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? "Loggar ut..." : "Logga ut"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-red-900 text-red-500 hover:bg-red-900/20"
              >
                Radera konto
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Check: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default AccountPage;
