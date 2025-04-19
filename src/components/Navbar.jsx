import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Slidebar from "./Sidebar";
import { getDeterministicAvatar } from "../data/avatarOptions";

export default function Navbar() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const avatarUrl = user?.avatarUrl || getDeterministicAvatar(user?.username)?.src;

  return (
    <nav className="w-full sticky top-0 z-50 bg-gray-50 text-white p-4 flex justify-between items-center shadow-md">
      {/* Sidebar y Logo */}
      <div className="flex items-center">
        <Slidebar />
      </div>

      {/* Centro (opcional) */}

      {/* Botones y Avatar */}
      <div className="flex items-center space-x-6">
        {/* Mientras carga, no mostrar nada */}
        {isLoading ? null : (
          <>
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                    />
                  )}
                </div>

                <Link
                  to="/profile"
                  className="text-sm font-medium text-yellow-500 hover:text-yellow-900 transition"
                >
                  Perfil
                </Link>

                <button
                  onClick={logout}
                  className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
