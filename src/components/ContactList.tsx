
import { Contact } from '@/lib/types';
import ContactCard from './ContactCard';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ContactListProps {
  contacts: Contact[];
  onUpdate?: () => void;
  emptyMessage?: string;
  className?: string;
}

export const ContactList = ({ contacts, onUpdate, emptyMessage, className }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <div className={cn("w-full animate-fade-in py-10", className)}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <PlusCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No contacts found</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            {emptyMessage || "Let's add some contacts to your collection."}
          </p>
          <Link
            to="/contacts/new"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Contact
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 animate-fade-in", className)}>
      {contacts.map(contact => (
        <ContactCard 
          key={contact.id} 
          contact={contact} 
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default ContactList;
