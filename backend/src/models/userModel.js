import { supabase } from '../config/supabase.js';
import crypto from 'crypto';

// In-memory fallback if Supabase is offline or tables not yet migrated
const localUsers = new Map();

export const UserModel = {
  async findByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[UserModel] Supabase findByEmail failed, checking local store:', err.message);
      }
    }

    return localUsers.get(normalizedEmail) || null;
  },

  async findById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, display_name, created_at')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[UserModel] Supabase findById failed:', err.message);
      }
    }

    for (const user of localUsers.values()) {
      if (user.id === id) {
        const { password_hash, ...safeUser } = user;
        return safeUser;
      }
    }
    return null;
  },

  async create({ email, password_hash, display_name }) {
    const normalizedEmail = email.trim().toLowerCase();
    const newUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password_hash,
      display_name: display_name.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (!error && data) {
          localUsers.set(normalizedEmail, data);
          return data;
        }
        if (error) {
          console.warn('[UserModel] Supabase insert error, saving to local fallback:', error.message);
        }
      } catch (err) {
        console.warn('[UserModel] Supabase error:', err.message);
      }
    }

    localUsers.set(normalizedEmail, newUser);
    return newUser;
  }
};
