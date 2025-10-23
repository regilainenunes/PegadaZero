import { supabase, Database } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

// Types
type Tables = Database['public']['Tables']
type UserRow = Tables['users']['Row']
type OrganizationRow = Tables['organizations']['Row']
type CarbonRecordRow = Tables['carbon_records']['Row']

// Auth Service with Supabase
export const supabaseAuthService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string, company?: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      // Create organization if provided
      let organizationId = null
      if (company) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .insert({ name: company })
          .select()
          .single()

        if (orgError) throw orgError
        organizationId = orgData.id
      }

      // Create user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role: 'user',
          organization_id: organizationId || '',
        })
        .select()
        .single()

      if (userError) throw userError
      return { user: authData.user, profile: userData }
    }

    throw new Error('Failed to create user')
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Get user profile
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*, organizations(*)')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError
      return { user: data.user, profile }
    }

    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return { user, profile }
    }

    return { user: null, profile: null }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<UserRow>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// Carbon Records Service with Supabase
export const supabaseCarbonService = {
  // Add carbon footprint record
  addRecord: async (record: Omit<CarbonRecordRow, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('carbon_records')
      .insert(record)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user's carbon records
  getUserRecords: async (userId: string) => {
    const { data, error } = await supabase
      .from('carbon_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  // Get organization's carbon records
  getOrganizationRecords: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('carbon_records')
      .select('*')
      .eq('organization_id', organizationId)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  // Update carbon record
  updateRecord: async (id: string, updates: Partial<CarbonRecordRow>) => {
    const { data, error } = await supabase
      .from('carbon_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete carbon record
  deleteRecord: async (id: string) => {
    const { error } = await supabase
      .from('carbon_records')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get carbon footprint summary
  getSummary: async (userId: string, organizationId?: string) => {
    let query = supabase
      .from('carbon_records')
      .select('category, co2_equivalent, date')

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    } else {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error

    // Calculate totals by category
    const summary = data.reduce((acc, record) => {
      if (!acc[record.category]) {
        acc[record.category] = 0
      }
      acc[record.category] += record.co2_equivalent
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(summary).reduce((sum, value) => sum + value, 0)

    return {
      total,
      byCategory: summary,
      records: data,
    }
  },
}

// Organization Service with Supabase
export const supabaseOrganizationService = {
  // Create organization
  create: async (name: string) => {
    const { data, error } = await supabase
      .from('organizations')
      .insert({ name })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get organization by id
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update organization
  update: async (id: string, updates: Partial<OrganizationRow>) => {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get organization users
  getUsers: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId)

    if (error) throw error
    return data
  },
}

export default {
  auth: supabaseAuthService,
  carbon: supabaseCarbonService,
  organization: supabaseOrganizationService,
}