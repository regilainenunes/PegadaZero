import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'

interface SupabaseRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: string
}

const SupabaseRoute: React.FC<SupabaseRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requiredRole 
}) => {
  const { user, profile, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default SupabaseRoute