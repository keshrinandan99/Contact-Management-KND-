
import { cn } from '@/lib/utils';
import { Contact } from '@/lib/types';
import { Mail, Phone, Star, StarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '@/lib/contacts';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

interface ContactCardProps {
  contact: Contact;
  className?: string;
  onUpdate?: () => void;
}

export const ContactCard = ({ contact, className, onUpdate }: ContactCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', contact.id] });
      if (onUpdate) onUpdate();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not update favorite status. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate(contact.id);
  };
  
  return (
    <Link
      to={`/contacts/${contact.id}`}
      className={cn(
        "block w-full",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="contact-hover-effect bg-white dark:bg-card rounded-xl p-4 border border-border transition-all duration-300">
        <div className="flex items-start">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary">
              {contact.avatar ? (
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                  {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center transition-all",
                contact.favorite ? "bg-amber-100 text-amber-500" : isHovering ? "bg-muted text-muted-foreground opacity-80" : "opacity-0"
              )}
              disabled={toggleFavoriteMutation.isPending}
            >
              {contact.favorite ? (
                <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
              ) : (
                <StarOff className="h-3 w-3" />
              )}
            </button>
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-foreground">{contact.name}</h3>
                {contact.position && contact.company && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {contact.position} at {contact.company}
                  </p>
                )}
                {(!contact.position && contact.company) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {contact.company}
                  </p>
                )}
              </div>
              
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                  {contact.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-2 space-y-1">
              {contact.email && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1.5" /> 
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1.5" /> 
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContactCard;
