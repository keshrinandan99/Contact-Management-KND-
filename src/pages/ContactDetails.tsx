
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Contact } from '@/lib/types';
import { deleteContact, getContactById, toggleFavorite } from '@/lib/contacts';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Calendar, Edit, Mail, MapPin, Phone, Star, StarOff, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ContactDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch contact data
  const { 
    data: contact,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => id ? getContactById(id) : Promise.resolve(undefined),
    enabled: !!id
  });
  
  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: (contactId: string) => deleteContact(contactId),
    onSuccess: () => {
      setDeleteDialogOpen(false);
      toast({
        title: "Contact deleted",
        description: contact ? `${contact.name} has been deleted successfully.` : "Contact deleted successfully"
      });
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not delete the contact. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: (contactId: string) => toggleFavorite(contactId),
    onSuccess: () => {
      toast({
        title: contact?.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${contact?.name} has been ${contact?.favorite ? "removed from" : "added to"} your favorites.`
      });
      queryClient.invalidateQueries({ queryKey: ['contact', id] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleToggleFavorite = () => {
    if (!contact) return;
    toggleFavoriteMutation.mutate(contact.id);
  };
  
  const handleDeleteContact = () => {
    if (!contact) return;
    deleteMutation.mutate(contact.id);
  };
  
  // Handle errors
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading contact",
        description: "The requested contact could not be found.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isError, navigate, toast]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto pt-28 px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-4"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="h-64 w-full bg-muted rounded-xl"></div>
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <div className="h-10 w-full bg-muted rounded"></div>
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-6 w-1/2 bg-muted rounded"></div>
                <div className="h-20 w-full bg-muted rounded mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (!contact) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto pt-28 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-medium">Contact not found</h1>
            <p className="text-muted-foreground mt-2">
              The requested contact could not be found.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="mt-4"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="container mx-auto pt-28 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6 animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          
          {/* Contact details */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left sidebar */}
            <div className="w-full md:w-1/3 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white dark:bg-card rounded-xl p-6 border border-border shadow-sm sticky top-28">
                <div className="flex justify-center">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-secondary">
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-medium">
                        {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={handleToggleFavorite}
                      disabled={toggleFavoriteMutation.isPending}
                    >
                      {contact.favorite ? (
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => navigate(`/contacts/edit/${contact.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full text-destructive hover:text-destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map(tag => (
                        <div 
                          key={tag}
                          className="bg-secondary rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-muted-foreground">
                  <p className="flex items-center justify-center">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    Added {formatDate(contact.created_at)}
                  </p>
                  {contact.last_contact && (
                    <p className="flex items-center justify-center mt-1">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      Last contact {formatDate(contact.last_contact)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-2/3 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-white dark:bg-card rounded-xl p-8 border border-border shadow-sm">
                <h1 className="text-2xl font-semibold">{contact.name}</h1>
                
                {(contact.position || contact.company) && (
                  <p className="text-muted-foreground mt-1">
                    {contact.position}
                    {contact.position && contact.company && ' at '}
                    {contact.company}
                  </p>
                )}
                
                <div className="mt-6 space-y-4">
                  {contact.email && (
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{contact.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {(contact.company || contact.position) && (
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-muted-foreground">
                          {contact.position ? 'Position' : 'Company'}
                        </p>
                        <p className="font-medium">
                          {contact.position || contact.company}
                          {contact.position && contact.company && ` at ${contact.company}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {contact.notes && (
                  <div className="mt-8">
                    <h3 className="text-base font-medium mb-2">Notes</h3>
                    <div className="bg-secondary/50 rounded-lg p-4 text-foreground/90">
                      {contact.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{contact.name}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactDetails;
