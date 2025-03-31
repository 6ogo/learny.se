
import React from 'react';
import { Check, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TierDetails } from '@/types/subscription';
import { LandingNavBar } from '@/components/LandingNavBar';

const PricingPage: React.FC = () => {
  const { tierDetails, currentTier, initiateCheckout } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (tier: TierDetails) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (tier.id === currentTier) {
      toast({
        title: "Redan prenumererat",
        description: `Du använder redan ${tier.name}-nivån.`,
      });
      return;
    }

    if (tier.id === 'free') {
      toast({
        title: "Gratisplan",
        description: "Du kan använda gratisversionen utan prenumeration.",
      });
      return;
    }

    try {
      const url = await initiateCheckout(tier.priceId);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Kunde inte skapa betalningsflöde");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Det gick inte att uppgradera",
        description: "Ett problem uppstod när betalningsflödet skulle skapas. Försök igen senare.",
      });
    }
  };

  const goHome = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <LandingNavBar />
      <div className="container px-4 md:px-6 py-12">
        <div className="flex justify-start mb-6">
          <Button 
            onClick={goHome}
            variant="ghost" 
            className="text-white hover:bg-gray-800 flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Tillbaka till startsidan
          </Button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Välj ditt medlemskap</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Uppgradera till ett betalt medlemskap för att låsa upp fler funktioner och förbättra din inlärningsupplevelse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tierDetails.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative transition-all duration-200 ${
                tier.popular 
                  ? 'border-learny-purple shadow-lg shadow-learny-purple/20 scale-105 md:scale-110 z-10 bg-gray-800' 
                  : 'border-gray-700 bg-gray-800/90'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-learny-purple text-white px-4 py-1 rounded-full">
                    Populärast
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                <CardDescription className="text-gray-300">{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{tier.price.split('/')[0]}</span>
                  {tier.id !== 'free' && (
                    <span className="text-gray-400 ml-2">/månad</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-learny-green mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                  {tier.id === 'free' && (
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Ingen AI-assistans</span>
                    </li>
                  )}
                  {tier.id !== 'super' && (
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-400">Ingen inlärningsoptimering</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    tier.id === currentTier
                      ? 'bg-gray-600 hover:bg-gray-600 cursor-default'
                      : tier.popular
                        ? 'bg-learny-purple hover:bg-learny-purple-dark'
                        : 'bg-learny-blue hover:bg-learny-blue-dark'
                  }`}
                  onClick={() => handleSubscribe(tier)}
                  disabled={tier.id === currentTier}
                >
                  {tier.id === currentTier ? 'Aktuell plan' : tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Vanliga frågor</h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <FAQ 
              question="Hur fungerar faktureringen?" 
              answer="Alla betalningar hanteras säkert via Stripe. Premium- och Super Learner-prenumerationer debiteras månatligen och kan avbrytas när som helst." 
            />
            <FAQ 
              question="Kan jag byta plan när som helst?" 
              answer="Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft omedelbart." 
            />
            <FAQ 
              question="Vad är AI-assisterad flashcard-skapande?" 
              answer="Med AI-assisterad flashcard-skapande kan du snabbt generera högkvalitativa flashcards baserat på ett ämne eller text. AI:n hjälper till att formulera frågor och svar optimerade för effektiv inlärning." 
            />
            <FAQ 
              question="Hur många flashcards kan jag skapa?" 
              answer="Med gratisplanen kan du skapa 1 modul med flashcards. Premium- och Super Learner-planerna tillåter upp till 100 moduler." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = ({ question, answer }: { question: string; answer: string }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h3 className="text-lg font-medium text-white mb-2">{question}</h3>
    <p className="text-gray-300">{answer}</p>
  </div>
);

export default PricingPage;
