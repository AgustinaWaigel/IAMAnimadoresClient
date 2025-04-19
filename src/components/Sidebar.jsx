import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Asegurate de tener lucide-react instalado
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Botón del menú */}
      <button
        onClick={() => setOpen(true)}
        className="ml-2 p-2 rounded-full bg-white text-yellow-400 hover:bg-yellow-100 shadow-md transition"
      >
        <Menu size={24} />
      </button>

      {/* Fondo oscuro */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar deslizante */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-yellow-100 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center px-4 py-4 border-b shadow-sm">
          <h2 className="text-2xl font-extrabold text-yellow-400">Menú</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-yellow-400 transition">
            <X size={28} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-4 p-6">
          <NavLink to="/inicio" setOpen={setOpen} text="Inicio" />
          <NavLink to="/informacion" setOpen={setOpen} text="Información" />
          <NavLink to="/recursos" setOpen={setOpen} text="Encuentros" />
          <NavLink to="/calendario" setOpen={setOpen} text="Calendario" />
          <NavLink to="/escuelaconjesus" setOpen={setOpen} text="Escuela con Jesús" />
          <NavLink to="/dashboard" setOpen={setOpen} text="Muro" />
          <NavLink to="/areas" setOpen={setOpen} text="Áreas" />
          <NavLink to="/noticias" setOpen={setOpen} text="Noticias y recursos" />
          {user?.rol === "admin" && (
            <NavLink to="/paneladministracion" setOpen={setOpen} text="Panel Administración" />
          )}
          {!user && (
            <p className="text-sm text-red-700 bg-red-100 p-3 rounded mt-4">
              🔐 Iniciá sesión para interactuar con la página.
            </p>
          )}
        </nav>
      </div>
    </>
  );
}

// Componente para los enlaces
function NavLink({ to, setOpen, text }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="text-gray-700 hover:text-yellow-400 font-semibold transition text-lg"
    >
      {text}
    </Link>
  );
}
