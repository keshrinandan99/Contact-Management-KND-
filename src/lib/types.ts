
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
  last_contact?: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  tags?: string[];
}

export type ContactFormData = Omit<Contact, 'id' | 'user_id'>;

export interface Tag {
  id: string;
  name: string;
  user_id?: string;
  created_at?: Date;
}
