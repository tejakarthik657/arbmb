import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthUser, LoginCredentials, RegisterCredentials, ApiResponse } from '../../shared/types';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false, user: null, token: null };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, token: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthUser>>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse<AuthUser>>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions (replace with real API calls later)
const mockAuthAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'demo@staysphere.com' && credentials.password === 'demo123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        isHost: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const authUser: AuthUser = {
        user,
        token: 'mock-jwt-token',
      };
      
      return { success: true, data: authUser };
    }
    
    return { success: false, error: 'Invalid credentials' };
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthUser>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user creation
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      isHost: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const authUser: AuthUser = {
      user,
      token: 'mock-jwt-token-new-user',
    };
    
    return { success: true, data: authUser };
  },
};

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('staysphere_auth');
    if (storedAuth) {
      try {
        const parsedAuth: AuthUser = JSON.parse(storedAuth);
        dispatch({ type: 'AUTH_SUCCESS', payload: parsedAuth });
      } catch (error) {
        localStorage.removeItem('staysphere_auth');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await mockAuthAPI.login(credentials);
      
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        localStorage.setItem('staysphere_auth', JSON.stringify(response.data));
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
      
      return response;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<ApiResponse<AuthUser>> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await mockAuthAPI.register(credentials);
      
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        localStorage.setItem('staysphere_auth', JSON.stringify(response.data));
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
      
      return response;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('staysphere_auth');
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};