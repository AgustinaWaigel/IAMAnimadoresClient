// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(api("/usuarios"), {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("❌ Error al obtener usuarios:", err);
      }
    };

    if (user?.rol === "admin") {
      fetchUsuarios();
    }
  }, [user]);

  const cambiarRol = async (id, nuevoRol) => {
    try {
      const res = await fetch(api(`/usuarios/${id}/rol`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ rol: nuevoRol }),
      });

      const data = await res.json();
      if (data.success) {
        setUsuarios((prev) =>
          prev.map((u) => (u._id === id ? { ...u, rol: nuevoRol } : u))
        );
      }
    } catch (err) {
      console.error("❌ Error al cambiar rol:", err);
    }
  };

  if (!user || user.rol !== "admin") {
    return (
      <p className="text-red-600 text-center mt-10">
        No estás autorizado para ver esta página.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Panel de Administración</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Foto</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="border p-2">
                  <img
                    src={u.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="border p-2">
                  {u.nombre} {u.apellido}
                  <br />
                  <span className="text-sm text-gray-500">@{u.username}</span>
                </td>
                <td className="border p-2 capitalize">{u.rol}</td>
                <td className="border p-2">
                  <select
                    value={u.rol}
                    onChange={(e) => cambiarRol(u._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
