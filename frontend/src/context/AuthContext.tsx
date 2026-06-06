// Global auth state — with JWT expiry detection and auto-logout

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: (reason?: "expired" | "manual") => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

// ─── Helper: decode JWT payload without a library ────────────────────────────
function decodeToken(token: string): { id: string; exp: number } | null {
  try {
    const payload = token.split(".")[1];
    // atob decodes base64 → JSON string
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ─── Helper: check if token is expired ───────────────────────────────────────
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // exp is in seconds, Date.now() is in ms
  return decoded.exp * 1000 < Date.now();
}

// ─── Helper: ms until token expires ──────────────────────────────────────────
function msUntilExpiry(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded) return 0;
  return decoded.exp * 1000 - Date.now();
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived: is the current user an admin?
  const isAdmin = user?.role === "admin";

  // ── logout ────────────────────────────────────────────────────────────────
  // reason="expired" → came from auto-expiry timer
  // reason="manual"  → user clicked logout button
  const logout = useCallback((reason: "expired" | "manual" = "manual") => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (reason === "expired") {
      // Store flag so Login page can show "session expired" message
      sessionStorage.setItem("sessionExpired", "true");
    }

    fetch("http://localhost:5000/api/auth/logout", { method: "POST" }).catch(() => {});
  }, []);

  // ── On mount: restore from localStorage + validate token ─────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      // If token is already expired on page load → log out immediately
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.setItem("sessionExpired", "true");
      } else {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  // ── Auto-logout timer: fires exactly when token expires ───────────────────
  useEffect(() => {
    if (!token) return;

    const ms = msUntilExpiry(token);
    if (ms <= 0) {
      logout("expired");
      return;
    }

    // Schedule auto-logout at the exact moment the token expires
    const timer = setTimeout(() => {
      logout("expired");
    }, ms);

    return () => clearTimeout(timer); // cleanup on token change
  }, [token, logout]);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    sessionStorage.removeItem("sessionExpired"); // clear any old flag
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Usage: const { user, isAdmin, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

