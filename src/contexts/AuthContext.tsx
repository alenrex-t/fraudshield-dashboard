
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { OktaAuth, AuthState } from '@okta/okta-auth-js';
import { Security, useOktaAuth } from '@okta/okta-react';

// Configure Okta client
const oktaAuth = new OktaAuth({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  clientId: '{yourClientId}',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This component uses Okta's Security component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Security oktaAuth={oktaAuth}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Security>
  );
}

// This inner component has access to the Okta hooks
function AuthProviderContent({ children }: { children: ReactNode }) {
  const { oktaAuth, authState } = useOktaAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Update user when auth state changes
  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      setUser(null);
      return;
    }

    oktaAuth.getUser().then((info) => {
      setUser({
        id: info.sub || '',
        name: `${info.given_name || ''} ${info.family_name || ''}`.trim(),
        email: info.email || '',
        role: info.groups?.includes('Admin') ? 'admin' : 'user'
      });
    });
  }, [authState, oktaAuth]);

  const login = async (email: string, password: string) => {
    try {
      await oktaAuth.signInWithCredentials({ username: email, password });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to login");
      }
      throw error;
    }
  };

  const logout = async () => {
    oktaAuth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!authState?.isAuthenticated, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
