
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Home,
  BookOpen,
  Plus,
  ListChecks,
  User,
  LogOut,
  ShieldCheck,
  Library
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const NavBar: React.FC = () => {
  const { user, signOut, tier, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isAuthPage = location.pathname === '/auth';

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Utloggad",
      description: "Du har loggats ut från ditt konto.",
    })
    navigate('/auth');
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="font-bold text-2xl flex items-center">
            <img 
              src="/logo.png" 
              alt="Learny.se" 
              className="h-10 w-auto mr-2" 
            />
            <span>Learny</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex ml-6 space-x-4">
              <Link to="/home" className="text-sm font-medium hover:text-primary transition-colors">
                Hem
              </Link>
              <Link to="/my-modules" className="text-sm font-medium hover:text-primary transition-colors">
                Mina Moduler
              </Link>
              <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">
                Skapa Flashcards
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/home">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Hem</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-modules">
                    <Library className="mr-2 h-4 w-4" />
                    <span>Mina Moduler</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Skapa Flashcards</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements">
                    <ListChecks className="mr-2 h-4 w-4" />
                    <span>Achievements</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Konto</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logga ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isAuthPage && <Link to="/auth">Logga in</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
