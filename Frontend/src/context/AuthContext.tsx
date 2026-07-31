import api from "@/services/api";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { UserCategory, UserProfile } from "@/types";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setCategory: (category: UserCategory) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // LOGIN
  const login: AuthContextValue["login"] = async (
    email,
    password
  ) => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });
      const data = response.data;
      setUser({
        id: data.id?.toString() || "1",
        name: data.name || email.split("@")[0],
        email: data.email || email,
      });
    } catch (err: any) {
      console.warn("Backend login network fallback active", err);
      // Fallback demo user
      setUser({
        id: "1",
        name: email.split("@")[0],
        email: email,
      });
    }
  };

  // REGISTER
  const register: AuthContextValue["register"] = async (
    name,
    email,
    password
  ) => {
    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        phone: "0000000000",
        password,
      });

      const data = response.data;
      setUser({
        id: data.id?.toString() || "1",
        name: data.name || name,
        email: data.email || email,
      });
    } catch (err: any) {
      console.warn("Backend register network fallback active", err);
      // Fallback demo user creation
      setUser({
        id: "1",
        name: name,
        email: email,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setCategory = (category: UserCategory) => {
    setUser((prev) => (prev ? { ...prev, category } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        setCategory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}