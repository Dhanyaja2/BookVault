import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = "http://localhost:3000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // 1. Save token + user to localStorage
  // --------------------------------------------------
  const saveSession = (token, userObj) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userObj));

    setAccessToken(token);
    setUser(userObj);
  };

  // --------------------------------------------------
  // 2. Load user by calling /me (after refresh or login)
  // --------------------------------------------------
  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return false;
      }

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch {
      return false;
    }
  };

  // --------------------------------------------------
  // 3. Refresh token when reopening the app
  // --------------------------------------------------
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return false;

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);

      return true;
    } catch {
      return false;
    }
  };

  // --------------------------------------------------
  // 4. On first page load → restore session
  // --------------------------------------------------
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        // Try validating token
        const ok = await fetchUser(storedToken);
        if (ok) {
          setLoading(false);
          return;
        }
      }

      // Otherwise try refresh
      const refreshed = await refreshToken();
      if (refreshed) {
        const newToken = localStorage.getItem("accessToken");
        await fetchUser(newToken);
      }

      setLoading(false);
    };

    init();
  }, []);

  // --------------------------------------------------
  // 5. LOGIN
  // --------------------------------------------------
  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    saveSession(data.accessToken, data.user);
  };

  // --------------------------------------------------
  // 6. SIGNUP
  // --------------------------------------------------
  const signup = async (name, email, password) => {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return true;
  };

  // --------------------------------------------------
  // 7. LOGOUT
  // --------------------------------------------------
  const logout = async () => {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
