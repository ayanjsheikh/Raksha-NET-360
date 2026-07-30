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
  login: (email: string, _password: string) => Promise<void>;
  register: (name: string, email: string, _password: string) => Promise<void>;
  logout: () => void;
  setCategory: (category: UserCategory) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DUMMY_DELAY = 700;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login: AuthContextValue["login"] = async (email) => {
    await new Promise((resolve) => setTimeout(resolve, DUMMY_DELAY));
    setUser({
      id: "user-1",
      name: email.split("@")[0] || "RakshaNet User",
      email,
      bloodGroup: "O+",
    });
  };

  const register: AuthContextValue["register"] = async (name, email) => {
    await new Promise((resolve) => setTimeout(resolve, DUMMY_DELAY));
    setUser({
      id: "user-1",
      name,
      email,
    });
  };

  const logout = () => setUser(null);

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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
