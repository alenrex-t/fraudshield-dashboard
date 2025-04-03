
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  // Mock user for demo purposes
  const mockUser = {
    id: "usr_123",
    name: "Admin User",
    email: "admin@smarti.com",
    role: "admin"
  };

  const login = async (email: string, password: string) => {
    try {
      // This is a mock login function. In a real app, you would call your auth API
      if (email.trim() === "" || password.trim() === "") {
        throw new Error("Please enter both email and password");
      }
      
      // Simple validation - in real app, would check against database
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the mock user
      setUser(mockUser);
      
      // Show success notification
      toast.success("Login successful!");
      
      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      // Show error notification
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to login");
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
