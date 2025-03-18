
import { useEffect, useState } from 'react';
import { Contact, ContactFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ContactForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    position: initialData.position || '',
    notes: initialData.notes || '',
    avatar: initialData.avatar || '',
    favorite: initialData.favorite || false,
    tags: initialData.tags || [],
  });
  
  const [tag, setTag] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  
  useEffect(() => {
    // Generate avatar if name changes and no custom avatar is set
    if (formData.name && !initialData.avatar) {
      setFormData(prev => ({
        ...prev,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(formData.name)}`
      }));
    }
  }, [formData.name, initialData.avatar]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleTagAdd = () => {
    if (!tag.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag.trim().toLowerCase()]
    }));
    setTag('');
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex justify-center mt-6">
            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-md bg-secondary">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt={formData.name || 'Avatar'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-medium">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                </div>
              )}
            </div>
          </div>
          
          {formData.tags && formData.tags.length > 0 && (
            <div className="bg-secondary rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <div 
                    key={tag}
                    className="bg-background rounded-full px-3 py-1 text-xs font-medium flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-2/3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={cn(errors.name && "text-destructive")}>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className={cn(errors.email && "text-destructive")}>
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                placeholder="Job Title"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Additional notes about this contact..."
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Add Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={tag}
                onChange={e => setTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Enter a tag"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTagAdd}
                disabled={!tag.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to add a tag
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
