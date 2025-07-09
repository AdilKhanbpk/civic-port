import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ooyzqrrdvaebqyectlgw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9veXpxcnJkdmFlYnF5ZWN0bGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDE4MDIsImV4cCI6MjA2NzM3NzgwMn0.Dt0PZMk9WqcD7fONiaD_KhEU5rydWPjOkvegZXeyvVM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData // Additional user metadata
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Get current session
  getCurrentSession: () => {
    return supabase.auth.getSession()
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  // Update user
  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates)
    return { data, error }
  }
}

// Database helper functions
export const dbHelpers = {
  // Insert user profile data
  createUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('usersdb')
      .insert([
        {
          id: userId,
          ...profileData
        }
      ])
    return { data, error }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('usersdb')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('usersdb')
      .update(updates)
      .eq('id', userId)
    return { data, error }
  }
}
