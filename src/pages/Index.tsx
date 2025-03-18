
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '@/lib/types';
import { getAllContacts, searchContacts } from '@/lib/contacts';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import ContactList from '@/components/ContactList';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Check, Plus, Star, Users } from 'lucide-react';

const Index = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [favoriteContacts, setFavoriteContacts] = useState<Contact[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[] | null>(null);
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = () => {
    const allContacts = getAllContacts();
    setContacts(allContacts);
    
    // Filter favorite contacts
    setFavoriteContacts(allContacts.filter(contact => contact.favorite));
    
    // Get most recently updated contacts
    setRecentContacts(
      [...allContacts]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 5)
    );
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchContacts(query));
    } else {
      setSearchResults(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <Navigation />
      
      <main className="container mx-auto pt-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Contact Management</h1>
            <p className="text-muted-foreground mt-2">
              Organize and manage your network efficiently
            </p>
          </div>
          
          {/* Search */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Search Results */}
          {searchResults !== null && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Search Results</h2>
                <p className="text-sm text-muted-foreground">
                  Found {searchResults.length} contacts for "{searchQuery}"
                </p>
              </div>
              <ContactList 
                contacts={searchResults} 
                onUpdate={loadContacts}
                emptyMessage={`No results found for "${searchQuery}"`}
              />
            </div>
          )}
          
          {searchResults === null && (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-xs text-muted-foreground">
                      <Link to="/contacts">
                        View All <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                  <h3 className="text-xl font-medium mt-4">{contacts.length}</h3>
                  <p className="text-muted-foreground text-sm">Total Contacts</p>
                </div>
                
                <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                      <Star className="h-6 w-6" />
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-xs text-muted-foreground">
                      <Link to="/contacts?favorite=true">
                        View All <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                  <h3 className="text-xl font-medium mt-4">{favoriteContacts.length}</h3>
                  <p className="text-muted-foreground text-sm">Favorite Contacts</p>
                </div>
                
                <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                    <Button asChild size="sm" variant="outline" className="bg-primary/5 border-primary/10 text-primary hover:bg-primary/10">
                      <Link to="/contacts/new">
                        <Plus className="mr-1 h-3 w-3" /> New Contact
                      </Link>
                    </Button>
                  </div>
                  <h3 className="text-xl font-medium mt-4">Quick Add</h3>
                  <p className="text-muted-foreground text-sm">Create a new contact</p>
                </div>
              </div>
              
              {/* Recent Contacts */}
              <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Contacts</h2>
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <Link to="/contacts">
                      View All <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <ContactList 
                  contacts={recentContacts} 
                  onUpdate={loadContacts}
                  emptyMessage="Add your first contact to get started"
                />
              </div>
              
              {/* Favorite Contacts */}
              {favoriteContacts.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Favorites</h2>
                    <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                      <Link to="/contacts?favorite=true">
                        View All <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <ContactList 
                    contacts={favoriteContacts.slice(0, 3)} 
                    onUpdate={loadContacts}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
