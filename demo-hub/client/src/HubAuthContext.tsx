import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { TOKEN_KEY, type HubUser } from "./api";

type HubAuthState = {
  user: HubUser | null;
  loading: boolean;
  logout: () => void;
  setUser: (u: HubUser) => void;
};

const HubAuthContext = createContext<HubAuthState | null>(null);

export function HubAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem("hub_user");
    if (token && raw) {
      try {
        setUser(JSON.parse(raw) as HubUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("hub_user");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("hub_user");
    setUser(null);
  };

  const setUserPersist = (u: HubUser) => {
    setUser(u);
    localStorage.setItem("hub_user", JSON.stringify(u));
  };

  return (
    <HubAuthContext.Provider value={{ user, loading, logout, setUser: setUserPersist }}>
      {children}
    </HubAuthContext.Provider>
  );
}

export function useHubAuth() {
  const ctx = useContext(HubAuthContext);
  if (!ctx) throw new Error("useHubAuth requires HubAuthProvider");
  return ctx;
}
