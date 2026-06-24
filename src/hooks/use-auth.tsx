import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (userId: number, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("cyrus_user_id");
    return stored ? parseInt(stored, 10) : null;
  });
  
  const [email, setEmail] = useState<string | null>(() => {
    return localStorage.getItem("cyrus_email");
  });

  const login = (newUserId: number, newEmail: string) => {
    localStorage.setItem("cyrus_user_id", newUserId.toString());
    localStorage.setItem("cyrus_email", newEmail);
    setUserId(newUserId);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem("cyrus_user_id");
    localStorage.removeItem("cyrus_email");
    setUserId(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        email,
        isAuthenticated: userId !== null,
        login,
        logout,
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
