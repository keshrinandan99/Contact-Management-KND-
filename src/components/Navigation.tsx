
import { Link, useLocation } from 'react-router-dom';
import { Contact, Home, PlusCircle, Search, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
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
          <button className="rounded-full p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="text-sm font-medium">AM</span>
          </div>
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
