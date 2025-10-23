import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'
import { supabaseAuthService } from '../services/supabaseService'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  organization_id: string
  organizations?: {
    id: string
    name: string
  }
}

interface SupabaseAuthContextType {
  user: SupabaseUser | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, company?: string) => Promise<boolean>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined)

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = useCallback(async (user: SupabaseUser) => {
    try {
      const { profile } = await supabaseAuthService.getCurrentUser()
      setProfile(profile)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [loadUserProfile])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const result = await supabaseAuthService.signIn(email, password)
      
      if (result && 'user' in result && 'profile' in result && result.user && result.profile) {
        setUser(result.user)
        setProfile(result.profile)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error signing in:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, company?: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { user, profile } = await supabaseAuthService.signUp(email, password, name, company)
      
      if (user && profile) {
        setUser(user)
        setProfile(profile)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error signing up:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await supabaseAuthService.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value: SupabaseAuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

export default SupabaseAuthContext