import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
    if (!token) {
      setIsLoading(false);
      return;
    }
  
    try {
      jwtDecode(token); // Validamos token
      fetch(api("/me"), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser({
              ...data.user,
              token, // 👈🏼 Guarda el token también
            });
          } else {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setIsLoading(false);
    }
  }, []);
  

  const login = (token, remember) => {
    if (remember) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  
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
            token, // 👈🏼 Aca agregás el token al usuario
          });
        }
      });
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
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
