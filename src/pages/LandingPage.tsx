import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, BarChart3, Clock, Lightbulb, ArrowRight, BookOpen, Smartphone, Award, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { LandingNavBar } from '@/components/LandingNavBar';
import { useAuth } from '@/context/AuthContext';
const LandingPage: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    user
  } = useAuth();
  return <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <LandingNavBar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
                Lär dig snabbare med Learny
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Interaktiva flashcards och anpassade studieprogram för effektiv inlärning inom medicin, kodning, språk och mer.
              </p>
              <p className="text-lg md:text-xl text-learny-yellow font-medium">
                Är du trött på ändlöst scrollande? Låt Learny förvandla skärmtid till värdefull kunskap!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? <Button size="lg" className="bg-learny-purple hover:bg-learny-purple-dark text-white">
                    <Link to="/home" className="w-full text-lg flex items-center">
                      <Home className="mr-2 h-5 w-5" />
                      Till Dashboard
                    </Link>
                  </Button> : <>
                    <Button size="lg" className="bg-learny-purple hover:bg-learny-purple-dark text-white">
                      <Link to="/auth" className="w-full text-lg">Kom igång gratis</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-learny-purple text-learny-purple hover:bg-learny-purple/10">
                      <Link to="/auth" className="w-full text-lg">Logga in</Link>
                    </Button>
                  </>}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-learny-purple to-learny-blue rounded-lg blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                  <img src="/logo.png" alt="Learny.se Flashcards" className="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Våra funktioner</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Learny erbjuder smarta verktyg för att göra din inlärning effektiv och rolig.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Brain />} title="Interaktiva Flashcards" description="Engagerande flashcards med spaced repetition-teknik för optimalt lärande." />
            <FeatureCard icon={<BarChart3 />} title="Följ Dina Framsteg" description="Detaljerad statistik och visualisering av dina studieframsteg." />
            <FeatureCard icon={<Clock />} title="Anpassade Program" description="Skräddarsydda studieprogram baserade på dina mål och inlärningshastighet." />
            <FeatureCard icon={<Lightbulb />} title="AI-genererade Kort" description="Låt vår AI hjälpa dig skapa högkvalitativa flashcards på sekunder." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hur det fungerar</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Kom igång med Learny på bara några minuter och börja förbättra din inlärning direkt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard number={1} title="Välj ämne/program" description="Välj bland våra färdiga ämnen eller skapa ditt eget personliga program." />
            <StepCard number={2} title="Studera med flashcards" description="Lär dig med interaktiva flashcards som anpassar sig efter din inlärning." />
            <StepCard number={3} title="Testa dina kunskaper" description="Utmana dig själv med kunskapstester för att förstärka inlärningen." />
            <StepCard number={4} title="Lås upp prestationer" description="Håll motivationen uppe genom att samla prestationsbadges och se dina framsteg." />
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Utforska kategorier</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Vi har flashcards för nästan alla ämnen du kan tänka dig.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CategoryButton icon={<BookOpen />} label="Medicin" />
            <CategoryButton icon={<Brain />} label="Kodning" />
            <CategoryButton icon={<Smartphone />} label="Språk" />
            <CategoryButton icon={<BarChart3 />} label="Ekonomi" />
            <CategoryButton icon={<Award />} label="Historia" />
            <CategoryButton icon={<Lightbulb />} label="Vetenskap" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-learny-purple/20 to-learny-blue/20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {user ? "Fortsätt din inlärningsresa" : "Redo att förbättra ditt lärande?"}
          </h2>
          <Button size="lg" className="bg-learny-purple hover:bg-learny-purple-dark text-white text-lg px-8">
            {user ? <Link to="/home" className="flex items-center gap-2">
                Till Dashboard <ArrowRight className="h-5 w-5" />
              </Link> : <Link to="/auth" className="flex items-center gap-2">
                Kom igång gratis <ArrowRight className="h-5 w-5" />
              </Link>}
          </Button>
        </div>
      </section>
    </div>;
};
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({
  icon,
  title,
  description
}) => <Card className="bg-gray-800 border-gray-700 text-white hover:shadow-xl transition-shadow">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-learny-purple/20 flex items-center justify-center mb-4">
        <div className="text-learny-purple">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>;
const StepCard: React.FC<{
  number: number;
  title: string;
  description: string;
}> = ({
  number,
  title,
  description
}) => <div className="flex flex-col items-center text-center p-6">
    <div className="w-12 h-12 rounded-full bg-learny-purple text-white flex items-center justify-center text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>;
const CategoryButton: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({
  icon,
  label
}) => {
  const {
    user
  } = useAuth();
  return <Link to={user ? "/home" : "/auth"}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-700 transition-colors">
        <div className="text-learny-purple mb-2">{icon}</div>
        <span className="text-white">{label}</span>
      </div>
    </Link>;
};
export default LandingPage;