import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="/imagenes/nino.png"
        alt="Cargando"
        className="w-32 h-32 animate-bounce"
      />
      <p className="mt-4 text-red-600 font-bold text-lg tracking-wide">
        Cargando...
      </p>
    </div>
  );
}
