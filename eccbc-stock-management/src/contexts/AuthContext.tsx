import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import type { UserResponse, UserLogin, Token } from '../services/api';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentToken = apiService.getToken();
        if (currentToken) {
          setToken(currentToken);
          
          // Vérifier si le token est toujours valide
          const isValid = await apiService.verifyToken();
          if (isValid.valid) {
            // Récupérer les informations de l'utilisateur
            const currentUser = await apiService.getCurrentUser();
            setUser(currentUser);
          } else {
            // Token invalide, déconnecter
            await logout();
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const tokenData: Token = await apiService.login(credentials);
      setToken(tokenData.access_token);
      setUser(tokenData.user);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const result = await apiService.verifyToken();
      return result.valid;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    verifyToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
