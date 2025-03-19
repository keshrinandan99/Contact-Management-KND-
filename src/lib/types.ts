
export interface Contact {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  avatar?: string;
  favorite: boolean;
  last_contact?: Date;
  created_at: Date;
  updated_at: Date;
  tags?: string[];
}

export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'updatedAt' | 'user_id'>;

export interface Tag {
  id: string;
  name: string;
  user_id?: string;
  created_at?: Date;
}
