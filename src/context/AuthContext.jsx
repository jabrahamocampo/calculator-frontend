import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      try {
        console.log("Token recibido:", token);
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error("Invalid JWT Token: incorrect format");
        }
        const payload = parts[1];
        const decodedPayload = atob(payload);
        const decoded = JSON.parse(decodedPayload);
        setUser({ id: decoded.id, username: decoded.username });
      } catch (error) {
        console.error("Error on decode token:", error);
        setUser(null);
        setToken(''); // clean invalid token
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
