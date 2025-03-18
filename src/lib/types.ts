
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  avatar?: string;
  favorite: boolean;
  lastContact?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export type ContactFormData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
