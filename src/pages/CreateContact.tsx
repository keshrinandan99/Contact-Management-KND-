
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactFormData } from '@/lib/types';
import { addContact, getContactById, updateContact } from '@/lib/contacts';
import Navigation from '@/components/Navigation';
import ContactForm from '@/components/ContactForm';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const CreateContact = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const contact = getContactById(id);
      if (contact) {
        setInitialData(contact);
        setIsEdit(true);
      } else {
        toast({
          title: "Contact not found",
          description: "The contact you're trying to edit could not be found.",
          variant: "destructive"
        });
        navigate('/contacts/new');
      }
    }
  }, [id, navigate, toast]);
  
  const handleSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isEdit && id) {
        updateContact(id, data);
        toast({
          title: "Contact updated",
          description: `${data.name} has been updated successfully.`
        });
        navigate(`/contacts/${id}`);
      } else {
        const newContact = addContact(data);
        toast({
          title: "Contact added",
          description: `${data.name} has been added to your contacts.`
        });
        navigate(`/contacts/${newContact.id}`);
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-semibold">
              {isEdit ? 'Edit Contact' : 'Add New Contact'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit 
                ? 'Update the information for this contact' 
                : 'Fill in the details to add a new contact to your collection'}
            </p>
          </div>
          
          {/* Form */}
          <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
            <ContactForm 
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateContact;
