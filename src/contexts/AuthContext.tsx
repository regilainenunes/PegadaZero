import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, company: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pegadazero_user');
    localStorage.removeItem('token');
  }, []);

  const validateToken = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      const userData: User = {
        _id: profile._id || profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      };
      setUser(userData);
    } catch (error) {
      console.error('Token inválido:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // Verificar se o usuário está armazenado no localStorage
    const storedUser = localStorage.getItem('pegadazero_user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Validar o token com o backend
      validateToken();
    }
    setLoading(false);
  }, [validateToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.login(email, password);

      // Aceitar tanto 'token' (Node) quanto 'access_token' (FastAPI)
      const token: string | undefined = response?.token || response?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        // Buscar perfil após login para preencher dados do usuário
        const profile = await authService.getProfile();
        const userData: User = {
          _id: profile._id || profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
        };
        setUser(userData);
        localStorage.setItem('pegadazero_user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, company: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.register(name, email, password);

      // Aceitar tanto 'token' (Node) quanto 'access_token' (FastAPI)
      const token: string | undefined = response?.token || response?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        // Buscar perfil após registro para preencher dados do usuário
        const profile = await authService.getProfile();
        const userData: User = {
          _id: profile._id || profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          company,
        };
        setUser(userData);
        localStorage.setItem('pegadazero_user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setLoading(false);
      return false;
    }
  };

  

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};