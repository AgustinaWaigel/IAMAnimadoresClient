import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/api';
import type { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user"); // 👈 también leemos el user

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      jwtDecode(token); // valida formato del token

      // Si hay user guardado, lo cargamos directamente
      if (savedUser) {
        setUser({ ...JSON.parse(savedUser), token });
      }

      // Igual consultamos al backend para confirmar que sigue siendo válido
      fetch(api("/me"), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async res => {
          const contentType = res.headers.get("content-type") || "";

          if (!res.ok) {
            throw new Error(`Error HTTP ${res.status}`);
          }

          if (!contentType.includes("application/json")) {
            throw new Error("La API no devolvió JSON al validar la sesión");
          }

          return res.json();
        })
        .then(data => {
          if (data.success) {
            setUser({
              ...data.user,
              token,
            });
            localStorage.setItem("user", JSON.stringify(data.user)); // 🔄 actualizamos user guardado
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });

    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoading(false);
    }
  }, []);


  const login = (token: string): Promise<void> => {
    localStorage.setItem("token", token);

    return fetch(api("/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (!contentType.includes("application/json")) {
          throw new Error("La API no devolvió JSON al validar la sesión");
        }

        return res.json();
      })
      .then(data => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user)); // 👈 guarda user
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

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => prev ? ({
      ...prev,
      ...updatedFields,
    }) : prev);
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
