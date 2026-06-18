import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/services/auth.service";
import { api } from "@/services/api";
import { useDemoRequired, demoStorageKey } from "@/context/DemoContext";
import { useAuth } from "@/context/AuthContext";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isDemo: boolean;
};

const DemoAuthContext = createContext<AuthState | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const demo = useDemoRequired();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const tokenKey = demoStorageKey(demo.slug, "token");
  const userKey = demoStorageKey(demo.slug, "user");

  useEffect(() => {
    const t = localStorage.getItem(tokenKey);
    const u = localStorage.getItem(userKey);
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u) as AuthUser);
      } catch {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
      }
    }
    setLoading(false);
  }, [tokenKey, userKey]);

  const persist = useCallback(
    (next: { user: AuthUser; token: string }) => {
      setUser(next.user);
      setToken(next.token);
      localStorage.setItem(tokenKey, next.token);
      localStorage.setItem(userKey, JSON.stringify(next.user));
    },
    [tokenKey, userKey]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{ user: AuthUser; token: string }>("/api/auth/login", {
        email,
        password,
      });
      persist(data);
      return data.user;
    },
    [persist]
  );

  const register = useCallback(async () => {
    throw new Error("Registration disabled in demo mode");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }, [tokenKey, userKey]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, isDemo: true }),
    [user, token, loading, login, register, logout]
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useAppAuth(): AuthState {
  const demoAuth = useContext(DemoAuthContext);
  const prodAuth = useAuth();
  if (demoAuth) return demoAuth;
  return { ...prodAuth, isDemo: false };
}
