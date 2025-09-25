import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/service";

type User = { 
  id: string; 
  name?: string; 
  email?: string; 
  status : string;
  apikey : string;
  role?: string } | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/auth/me");
        if (!cancelled) {
          setUser(res.data); // /me returns the full user object
          // console.log("AUTH", res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setHasCheckedAuth(true);
        }
      }
    };
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");     
    } catch (err) {
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, hasCheckedAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}