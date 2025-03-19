
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Contact, Home, LogOut, PlusCircle, Search, Settings, User, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check for user authentication state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: PlusCircle, label: 'Add Contact', path: '/contacts/new' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/contacts?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSettingsClick = (action: string) => {
    switch (action) {
      case 'theme':
        toast({
          title: "Theme settings",
          description: "Theme settings will be implemented in a future update.",
        });
        break;
      case 'account':
        navigate('/settings');
        break;
      case 'logout':
        handleSignOut();
        break;
      default:
        break;
    }
  };
  
  // Get initials for user avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out px-4 py-4",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Contact className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Contacts</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-1 text-sm font-medium py-2 px-3 rounded-md transition-all",
                location.pathname === item.path 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {searchOpen ? (
            <div className="absolute inset-x-0 top-0 bg-white dark:bg-background z-20 px-4 py-4 shadow-md animate-in slide-in-from-top">
              <div className="container mx-auto flex items-center">
                <SearchBar 
                  onSearch={handleSearch} 
                  className="flex-1 mr-2" 
                  placeholder="Search and press Enter..."
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchOpen(false)}
                  className="ml-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(true)} 
              className="rounded-full p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-sm font-medium">{getUserInitials()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user ? user.email : 'Guest'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSettingsClick('account')}>
                <User className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSettingsClick('theme')}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                <span>Theme</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem onClick={() => handleSettingsClick('logout')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around py-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-md",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Navigation;
