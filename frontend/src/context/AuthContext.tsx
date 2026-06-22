import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type User = {
  id: string;
  _id: string; 
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
// decode the jwt token -> jwt has header,payload and signature
// decode-> convert the token into the redadable object 
function decodeToken(token: string): { id: string; exp: number } | null {
  try {
    const payload = token.split(".")[1]; //extract the payload part from the token
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
  return decoded.exp * 1000 < Date.now(); // the exp  is the expiry time in sec *1000 -> coz javescript usese the mili sec
} 

// ─── Helper: ms until token expires ──────────────────────────────────────────
function msUntilExpiry(token: string): number { // return the millisec before token expires
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
  const isAdmin = user?.role === "admin"; // control the admin dashboard visiblity etc 

  // ── logout ────────────────────────────────────────────────────────────────
  // reason="expired" → came from auto-expiry timer
  // reason="manual"  → user clicked logout button
  const logout = useCallback((reason: "expired" | "manual" = "manual") => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // clear the browser storage 
    localStorage.removeItem("user");

    if (reason === "expired") {
      // Store flag so Login page can show "session expired" message
      sessionStorage.setItem("sessionExpired", "true");
    }

    fetch("http://localhost:5000/api/auth/logout", { method: "POST" }).catch(() => {});
  }, []);

  // ── On mount: restore from localStorage + validate token ─────────────────
  useEffect(() => { // this happend when app reload 
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      // If token is already expired on page load → log out immediately
      if (isTokenExpired(storedToken)) { // if token expire then force restart
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.setItem("sessionExpired", "true");
      } else {
        try {
          setToken(storedToken); // else restore the session 
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
  useEffect(() => { // kind of security system 
    if (!token) return; 

    const ms = msUntilExpiry(token); // calculate the remainin time
    if (ms <= 0) {// if already expire 
      logout("expired");// then logout
      return;
    }

    // Schedule auto-logout at the exact moment the token expires
    const timer = setTimeout(() => { // set the time out that logout the user when the tokend expires
      logout("expired");
    }, ms);

    return () => clearTimeout(timer); // cleanup on token change
  }, [token, logout]);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = (newToken: string, newUser: User) => {
    setToken(newToken); // svae the satate 
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

export const useAuth = () => useContext(AuthContext);
