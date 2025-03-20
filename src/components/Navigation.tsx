import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Settings,
  X,
  LogOut,
  LogIn,
  User,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/lib/auth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSearch = (query: string) => {
    setSearchValue(query);
    if (query.trim()) {
      navigate(`/contacts?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/contacts');
    }
  };

  const handleSearchIconClick = () => {
    setSearching(true);
  };

  const handleSearchCancel = () => {
    setSearching(false);
    setSearchValue('');
    navigate('/contacts');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-foreground">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">ContactBook</span>
            </Link>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
              >
                Home
              </Link>
              <Link
                to="/contacts"
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
              >
                Contacts
              </Link>
              {user && (
                <Link
                  to="/contacts/new"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
                >
                  New Contact
                </Link>
              )}
            </nav>
          </div>
          
          {/* Search bar (mobile full-width) */}
          {searching && (
            <div className="absolute top-0 left-0 w-full h-16 bg-background px-4 flex items-center z-50">
              <Input
                type="search"
                placeholder="Search contacts..."
                className="flex-1 h-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchValue.trim()) {
                    navigate(`/contacts?search=${encodeURIComponent(searchValue.trim())}`);
                    setSearching(false);
                  } else if (e.key === 'Escape') {
                    setSearching(false);
                  }
                }}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={handleSearchCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Right side icons */}
          <div className="flex items-center">
            {!searching && (
              <Button variant="ghost" size="icon" onClick={handleSearchIconClick} className="mr-1">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>Account</span>
                        <span className="text-xs font-normal text-muted-foreground truncate max-w-[12rem]">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                {user && (
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 md:hidden" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/contacts"
                className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Contacts
              </Link>
              {user && (
                <Link
                  to="/contacts/new"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  New Contact
                </Link>
              )}
              {user ? (
                <Link
                  to="/settings"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-foreground flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
