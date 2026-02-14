import { createContext, ReactNode, useCallback, useReducer } from 'react';
import { IUserPublic } from '@shared/types';

interface AuthContextType {
  user: IUserPublic | null;
  isAuthenticated: boolean;
  login: (user: IUserPublic, accessToken: string) => void;
  logout: () => void;
  setUser: (user: IUserPublic | null) => void;
}

interface AuthState {
  user: IUserPublic | null;
  isAuthenticated: boolean;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: IUserPublic }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: IUserPublic | null };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user: IUserPublic, accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setUser = useCallback((user: IUserPublic | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
