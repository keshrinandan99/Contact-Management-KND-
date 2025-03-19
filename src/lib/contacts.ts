import { Contact, ContactFormData, Tag } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Get all contacts for the current user
export const getAllContacts = async (): Promise<Contact[]> => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_tags (
          tags (
            name
          )
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Process contacts to include tags array
    return contacts.map(contact => ({
      ...contact,
      last_contact: contact.last_contact || undefined,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      tags: contact.contact_tags?.map((ct: any) => ct.tags.name) || []
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

// Get a single contact by ID
export const getContactById = async (id: string): Promise<Contact | undefined> => {
  try {
    const { data: contact, error } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_tags (
          tags (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...contact,
      last_contact: contact.last_contact || undefined,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      tags: contact.contact_tags?.map((ct: any) => ct.tags.name) || []
    };
  } catch (error) {
    console.error('Error fetching contact:', error);
    return undefined;
  }
};

// Create a new contact
export const addContact = async (contactData: ContactFormData): Promise<Contact | undefined> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Convert dates to ISO strings for Supabase
    const lastContactValue = contactData.last_contact 
      ? new Date(contactData.last_contact).toISOString() 
      : null;
    
    // First, insert the contact
    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        position: contactData.position,
        notes: contactData.notes,
        avatar: contactData.avatar,
        favorite: contactData.favorite || false,
        last_contact: lastContactValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Then, handle tags
    if (contactData.tags && contactData.tags.length > 0) {
      await handleContactTags(newContact.id, contactData.tags, user.id);
    }

    // Return the new contact with tags
    return {
      ...newContact,
      tags: contactData.tags || []
    };
  } catch (error) {
    console.error('Error adding contact:', error);
    return undefined;
  }
};

// Update an existing contact
export const updateContact = async (id: string, contactData: ContactFormData): Promise<Contact | undefined> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Convert dates to ISO strings for Supabase
    const lastContactValue = contactData.last_contact 
      ? new Date(contactData.last_contact).toISOString() 
      : null;

    // Update the contact - Fix the Date to string conversion here
    const { data: updatedContact, error } = await supabase
      .from('contacts')
      .update({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        position: contactData.position,
        notes: contactData.notes,
        avatar: contactData.avatar,
        favorite: contactData.favorite,
        last_contact: lastContactValue,
        updated_at: new Date().toISOString() // Convert Date to string
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Handle tags (delete and recreate for simplicity)
    await deleteContactTags(id);
    if (contactData.tags && contactData.tags.length > 0) {
      await handleContactTags(id, contactData.tags, user.id);
    }

    // Return the updated contact with tags
    return {
      ...updatedContact,
      tags: contactData.tags || []
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    return undefined;
  }
};

// Delete a contact
export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    // Delete the contact (cascade will handle contact_tags)
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (id: string): Promise<boolean> => {
  try {
    // First get the current favorite status
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('favorite')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the favorite status
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ 
        favorite: !contact.favorite,
        updated_at: new Date().toISOString() // Convert Date to string
      })
      .eq('id', id);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

// Search contacts
export const searchContacts = async (query: string): Promise<Contact[]> => {
  if (!query.trim()) return await getAllContacts();
  
  const searchTerm = query.toLowerCase().trim();
  
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_tags (
          tags (
            name
          )
        )
      `)
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Process contacts to include tags
    const processedContacts = contacts.map(contact => ({
      ...contact,
      last_contact: contact.last_contact || undefined,
      created_at: contact.created_at,
      updated_at: contact.updated_at,
      tags: contact.contact_tags?.map((ct: any) => ct.tags.name) || []
    }));

    // Also search by tags - This will be a second pass on the already fetched data
    // For a more efficient solution, this would be done with a more complex query on the server
    const { data: tagContacts, error: tagError } = await supabase
      .from('tags')
      .select(`
        name,
        contact_tags (
          contact_id,
          contacts (*)
        )
      `)
      .ilike('name', `%${searchTerm}%`);

    if (tagError) throw tagError;

    // Extract contacts from tag results and merge with the previous results
    const tagMatchedContacts = tagContacts.flatMap(tag => 
      tag.contact_tags.map((ct: any) => ({
        ...ct.contacts,
        last_contact: ct.contacts.last_contact || undefined,
        created_at: ct.contacts.created_at,
        updated_at: ct.contacts.updated_at,
        tags: [tag.name] // Simplified, would need a separate query to get all tags
      }))
    );

    // Combine results and remove duplicates
    const allContacts = [...processedContacts, ...tagMatchedContacts];
    const uniqueContacts = allContacts.filter((contact, index, self) =>
      index === self.findIndex(c => c.id === contact.id)
    );

    return uniqueContacts;
  } catch (error) {
    console.error('Error searching contacts:', error);
    return [];
  }
};

// Helper function to handle contact tags
const handleContactTags = async (contactId: string, tagNames: string[], userId: string): Promise<void> => {
  try {
    // For each tag, ensure it exists, then create the relationship
    for (const tagName of tagNames) {
      // Check if tag exists for this user
      const { data: existingTags, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .eq('user_id', userId);

      if (tagError) throw tagError;

      let tagId;

      if (existingTags.length === 0) {
        // Create new tag
        const { data: newTag, error: createError } = await supabase
          .from('tags')
          .insert({ 
            name: tagName,
            user_id: userId,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        tagId = newTag.id;
      } else {
        tagId = existingTags[0].id;
      }

      // Create relationship
      const { error: relationError } = await supabase
        .from('contact_tags')
        .insert({ contact_id: contactId, tag_id: tagId });

      if (relationError) throw relationError;
    }
  } catch (error) {
    console.error('Error handling contact tags:', error);
    throw error;
  }
};

// Helper function to delete all tags for a contact
const deleteContactTags = async (contactId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contact_tags')
      .delete()
      .eq('contact_id', contactId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting contact tags:', error);
    throw error;
  }
};
