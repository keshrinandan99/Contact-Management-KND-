
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactFormData } from '@/lib/types';
import { addContact, getContactById, updateContact } from '@/lib/contacts';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CreateContact = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch contact data if in edit mode
  const { 
    data: contact,
    isLoading,
    isError 
  } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => id ? getContactById(id) : Promise.resolve(undefined),
    enabled: !!id
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ContactFormData) => addContact(data),
    onSuccess: (newContact) => {
      if (newContact) {
        toast({
          title: "Contact added",
          description: `${newContact.name} has been added to your contacts.`
        });
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        navigate(`/contacts/${newContact.id}`);
      } else {
        toast({
          title: "Error",
          description: "Could not add the contact. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add the contact. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContactFormData }) => updateContact(id, data),
    onSuccess: (updatedContact) => {
      if (updatedContact) {
        toast({
          title: "Contact updated",
          description: `${updatedContact.name} has been updated successfully.`
        });
        queryClient.invalidateQueries({ queryKey: ['contacts'] });
        queryClient.invalidateQueries({ queryKey: ['contact', id] });
        navigate(`/contacts/${updatedContact.id}`);
      } else {
        toast({
          title: "Error",
          description: "Could not update the contact. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not update the contact. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  // Handle form submission
  const handleSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    
    if (id && contact) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Handle errors
  useEffect(() => {
    if (isError && id) {
      toast({
        title: "Contact not found",
        description: "The contact you're trying to edit could not be found.",
        variant: "destructive"
      });
      navigate('/contacts/new');
    }
  }, [isError, id, navigate, toast]);
  
  const isEdit = !!id && !!contact;
  
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
            <h1 className="text-2xl font-semibold">
              {isEdit ? 'Edit Contact' : 'Add New Contact'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit 
                ? 'Update the information for this contact' 
                : 'Fill in the details to add a new contact to your collection'}
            </p>
          </div>
          
          {/* Loading state */}
          {isLoading && id ? (
            <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 animate-pulse">
              <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
              <div className="h-10 w-full bg-muted rounded mb-4"></div>
              <div className="h-10 w-full bg-muted rounded mb-4"></div>
              <div className="h-10 w-full bg-muted rounded mb-4"></div>
              <div className="h-20 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
              <ContactForm 
                initialData={contact || {}}
                onSubmit={handleSubmit}
                onCancel={() => navigate(-1)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateContact;
