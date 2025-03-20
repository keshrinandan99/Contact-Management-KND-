import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, LogOut, User } from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="container mx-auto pt-28 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground flex items-center text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and application preferences
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Account Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="destructive" 
                        onClick={handleSignOut} 
                        disabled={isLoading}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isLoading ? 'Signing out...' : 'Sign Out'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="py-4">
                    <p className="text-muted-foreground mb-4">
                      Sign in to manage your contacts and settings.
                    </p>
                    <Button asChild>
                      <Link to="/auth">
                        <User className="h-4 w-4 mr-2" />
                        Sign In / Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Other settings sections can be added here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
