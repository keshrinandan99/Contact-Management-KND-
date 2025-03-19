
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader, User, UserCircle2 } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    
    checkAuth();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Check your email for the confirmation link."
        });
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setUser(data.user);
        toast({
          title: "Success!",
          description: "You're now logged in."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "An error occurred during authentication."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Success!",
        description: "You've been logged out."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An error occurred while signing out."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="container mx-auto pt-28 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Settings</h1>
          
          <Tabs defaultValue={user ? "account" : "auth"} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                          <UserCircle2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{user.email}</h3>
                          <p className="text-sm text-muted-foreground">
                            User ID: {user.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <User className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Not Logged In</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Please sign in to view your account information.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {user && (
                    <Button variant="destructive" onClick={handleSignOut} disabled={loading}>
                      {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign Out
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="auth">
              <Card>
                <CardHeader>
                  <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
                  <CardDescription>
                    {isSignUp 
                      ? "Create a new account to manage your contacts." 
                      : "Sign in to your account to access your contacts."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <form onSubmit={handleAuth} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSignUp ? "Sign Up" : "Sign In"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                        <User className="h-6 w-6" />
                      </div>
                      <p className="text-muted-foreground">
                        You are currently signed in as <span className="font-medium">{user.email}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!user && (
                    <Button 
                      variant="link" 
                      onClick={() => setIsSignUp(!isSignUp)} 
                      className="w-full"
                    >
                      {isSignUp 
                        ? "Already have an account? Sign in" 
                        : "Don't have an account? Sign up"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your application experience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Theme settings will be implemented in a future update.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
