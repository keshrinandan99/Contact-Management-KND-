
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Contact, Home, PlusCircle, Search, Settings, Users, X } from 'lucide-react';
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

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        break;
      default:
        break;
    }
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
                  <span className="text-sm font-medium">AM</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSettingsClick('account')}>
                <Settings className="mr-2 h-4 w-4" />
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
              <DropdownMenuItem onClick={() => handleSettingsClick('logout')}>
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log out</span>
              </DropdownMenuItem>
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
