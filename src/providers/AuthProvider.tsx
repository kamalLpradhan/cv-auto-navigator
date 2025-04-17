
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleSheetsService } from '@/utils/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  googleSheetsApiKey: string;
  setGoogleSheetsApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [googleSheetsApiKey, setGoogleSheetsApiKey] = useState<string>('');
  const [sheetsService, setSheetsService] = useState<GoogleSheetsService | null>(null);
  const { toast } = useToast();

  // Load API key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('google_sheets_api_key');
      if (storedApiKey) {
        setGoogleSheetsApiKey(storedApiKey);
      }
    }
  }, []);

  // Initialize Google Sheets service when API key changes
  useEffect(() => {
    if (googleSheetsApiKey) {
      const service = new GoogleSheetsService(googleSheetsApiKey);
      setSheetsService(service);
      
      // Save API key to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_sheets_api_key', googleSheetsApiKey);
      }
    }
  }, [googleSheetsApiKey]);

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('cv_navigator_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('cv_navigator_user');
        }
      }
    }
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_navigator_user', JSON.stringify(userData));
    }
    
    // Also save to Google Sheets if API key is set
    if (sheetsService) {
      try {
        // First check if user already exists
        const users = await sheetsService.getAllUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
          // Update existing user
          await sheetsService.updateUser(existingUser.id, {
            name: userData.name,
            avatar: userData.avatar,
            lastLogin: new Date().toISOString()
          });
        } else {
          // Add new user
          await sheetsService.addUser(userData);
        }
      } catch (error) {
        console.error('Error syncing user to Google Sheets:', error);
        toast({
          title: 'Warning',
          description: 'Logged in successfully, but failed to sync with Google Sheets',
          variant: 'destructive',
        });
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cv_navigator_user');
    }
  };

  const updateGoogleSheetsApiKey = (key: string) => {
    setGoogleSheetsApiKey(key);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        googleSheetsApiKey,
        setGoogleSheetsApiKey: updateGoogleSheetsApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
