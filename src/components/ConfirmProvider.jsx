import { createContext, useContext, useState } from "react";

const ConfirmContext = createContext();

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ visible: false, mensaje: "", resolver: null });

  const confirmar = ({ mensaje }) =>
    new Promise((resolver) => {
      setState({ visible: true, mensaje, resolver });
    });

  const aceptar = () => {
    state.resolver(true);
    setState({ ...state, visible: false });
  };

  const cancelar = () => {
    state.resolver(false);
    setState({ ...state, visible: false });
  };

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {state.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-4">
            <p className="text-gray-800 text-lg">{state.mensaje}</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelar} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancelar
              </button>
              <button onClick={aceptar} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
