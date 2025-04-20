import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import "./index.css";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import RecursosEdad from "./pages/RecursosEdad";
import Recursos from "./pages/Encuentros";
import Calendario from "./pages/Calendario";
import Inicio from "./pages/Inicio";
import Areas from "./pages/Areas";
import Noticias from "./pages/Noticias";
import EscuelaConJesus from "./pages/EscuelaConJesus";
import Comunicacion from "./pages/Comunicacion";
import PanelAdministracion from "./pages/AdminPanel";
import Animacion from "./pages/Animacion";
import Formacion from "./pages/Formacion";
import Espiritualidad from "./pages/Espiritualidad";
import Logistica from "./pages/Logistica";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Informacion from "./pages/Informacion";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // o <Spinner /> si querés mostrar cargando

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recursos/:edad" element={<RecursosEdad />} />
          <Route path="/informacion" element={<Informacion />} />

          <Route path="/areas" element={<Areas />} />

          <Route path="/noticias" element={<Noticias />} />

          <Route path="/comunicacion" element={<Comunicacion />} />

          <Route path="/logistica" element={<Logistica />} />

          <Route path="/formacion" element={<Formacion />} />

          <Route path="/espiritualidad" element={<Espiritualidad />} />

          <Route path="/animacion" element={<Animacion />} />

          <Route path="/escuelaconjesus" element={<EscuelaConJesus />} />


          <Route
            path="/paneladministracion"
            element={<PanelAdministracion />}
          />

          <Route path="/recursos" element={<Recursos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto w-full py-4 text-center text-sm text-gray-500 border-t">
        <p>© {new Date().getFullYear()} App para Animadores</p>
        <p className="text-xs mt-1">Siempre hagamos todo con ❤️</p>
        <div className="flex justify-center gap-4 mt-2 text-blue-600">
          <a href="https://www.youtube.com/channel/UCShR66tuvm-N-I5ZUZ6Oo6Q" className="hover:underline">
            Youtube
          </a>
          <a
            href="https://www.instagram.com/iamarqparana/?hl=es"
            target="_blank"
            className="hover:underline"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
