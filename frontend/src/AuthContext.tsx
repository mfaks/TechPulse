import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  email: string;
  name: string;
  provider: string;
  avatar_url: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userInfo: UserInfo | null;
  setAuth: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Change to default export
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authSuccess = searchParams.get('auth_success');
    
    if (authSuccess === 'true') {
      setIsAuthenticated(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    setLoading(false);
  }, []);

  const setAuth = (value: boolean) => {
    setIsAuthenticated(value);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        credentials: 'include'
      });
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      userInfo,
      setAuth,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook separately
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export for the provider
export default AuthProvider;