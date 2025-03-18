
import { Contact, ContactFormData } from './types';

// Initial mock data
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    position: 'Product Manager',
    favorite: true,
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=Alex`,
    notes: 'Met at the tech conference last month. Interested in our new product.',
    lastContact: new Date('2023-12-15'),
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-12-15'),
    tags: ['client', 'tech']
  },
  {
    id: '2',
    name: 'Taylor Chen',
    email: 'taylor@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Design Studio',
    position: 'Lead Designer',
    favorite: false,
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=Taylor`,
    notes: 'Collaborated on the rebrand project. Great design skills.',
    lastContact: new Date('2024-01-05'),
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-01-05'),
    tags: ['partner', 'design']
  },
  {
    id: '3',
    name: 'Jordan Rivera',
    email: 'jordan@example.com',
    phone: '+1 (555) 765-4321',
    company: 'Startup Ventures',
    position: 'CEO',
    favorite: true,
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=Jordan`,
    notes: 'Potential investor. Schedule follow-up next quarter.',
    lastContact: new Date('2023-11-20'),
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-11-20'),
    tags: ['investor', 'important']
  },
  {
    id: '4',
    name: 'Casey Williams',
    email: 'casey@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Marketing Solutions',
    position: 'Marketing Director',
    favorite: false,
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=Casey`,
    notes: 'Discussed marketing strategy for Q1. Needs proposal by end of month.',
    lastContact: new Date('2024-01-10'),
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2024-01-10'),
    tags: ['client', 'marketing']
  },
  {
    id: '5',
    name: 'Sam Peterson',
    email: 'sam@example.com',
    phone: '+1 (555) 876-5432',
    company: 'Data Analytics Ltd.',
    position: 'Data Scientist',
    favorite: false,
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=Sam`,
    notes: 'Technical expert for our data integration. Very knowledgeable.',
    lastContact: new Date('2023-12-01'),
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-12-01'),
    tags: ['technical', 'analytics']
  },
];

// Use local storage to persist contacts
const getContacts = (): Contact[] => {
  if (typeof window === 'undefined') return initialContacts;
  
  const storedContacts = localStorage.getItem('contacts');
  if (storedContacts) {
    try {
      // Parse dates properly
      const contacts = JSON.parse(storedContacts, (key, value) => {
        if (key === 'lastContact' || key === 'createdAt' || key === 'updatedAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      return contacts;
    } catch (e) {
      console.error('Error parsing contacts from localStorage', e);
      return initialContacts;
    }
  }
  
  // Initialize with mock data if no stored contacts
  setContacts(initialContacts);
  return initialContacts;
};

const setContacts = (contacts: Contact[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('contacts', JSON.stringify(contacts));
};

// CRUD operations
export const getAllContacts = (): Contact[] => {
  return getContacts();
};

export const getContactById = (id: string): Contact | undefined => {
  return getContacts().find(contact => contact.id === id);
};

export const addContact = (contactData: ContactFormData): Contact => {
  const contacts = getContacts();
  const newContact: Contact = {
    ...contactData,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const updatedContacts = [newContact, ...contacts];
  setContacts(updatedContacts);
  return newContact;
};

export const updateContact = (id: string, contactData: ContactFormData): Contact | undefined => {
  const contacts = getContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  
  if (index === -1) return undefined;
  
  const updatedContact: Contact = {
    ...contacts[index],
    ...contactData,
    updatedAt: new Date()
  };
  
  contacts[index] = updatedContact;
  setContacts(contacts);
  return updatedContact;
};

export const deleteContact = (id: string): boolean => {
  const contacts = getContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  
  if (filteredContacts.length === contacts.length) return false;
  
  setContacts(filteredContacts);
  return true;
};

export const toggleFavorite = (id: string): Contact | undefined => {
  const contacts = getContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  
  if (index === -1) return undefined;
  
  const updatedContact = {
    ...contacts[index],
    favorite: !contacts[index].favorite,
    updatedAt: new Date()
  };
  
  contacts[index] = updatedContact;
  setContacts(contacts);
  return updatedContact;
};

export const searchContacts = (query: string): Contact[] => {
  if (!query.trim()) return getContacts();
  
  const searchTerm = query.toLowerCase().trim();
  return getContacts().filter(contact => 
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm) ||
    contact.company?.toLowerCase().includes(searchTerm) ||
    contact.position?.toLowerCase().includes(searchTerm) ||
    contact.phone?.includes(searchTerm) ||
    contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};
