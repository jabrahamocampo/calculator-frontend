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
          throw new Error("Token JWT inválido: formato incorrecto");
        }
        const payload = parts[1];
        const decodedPayload = atob(payload);
        const decoded = JSON.parse(decodedPayload);
        setUser({ id: decoded.id, username: decoded.username });
      } catch (error) {
        console.error("Error al decodificar token:", error);
        setUser(null);
        setToken(''); // Limpiar token inválido
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
