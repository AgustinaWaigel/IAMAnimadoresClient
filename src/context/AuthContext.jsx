import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ Solo localStorage

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      jwtDecode(token); // valida el token

      fetch(api("/me"), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser({
              ...data.user,
              token, // ✅ guardamos token en estado
            });
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch {
      localStorage.removeItem("token");
      setIsLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token); // ✅ siempre guarda en localStorage

    return fetch(api("/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({
            ...data.user,
            token,
          });
        }
      });
  };

  const logout = () => {
    localStorage.removeItem("token"); // ✅ ya no hace falta limpiar sessionStorage
    setUser(null);
    window.location.href = "/login";
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
