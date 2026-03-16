import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ConfirmFn = (opts: { mensaje: string }) => Promise<boolean>;

interface ConfirmState {
  visible: boolean;
  mensaje: string;
  resolver: ((value: boolean) => void) | null;
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({ visible: false, mensaje: "", resolver: null });

  const confirmar: ConfirmFn = ({ mensaje }) =>
    new Promise<boolean>((resolver) => {
      setState({ visible: true, mensaje, resolver });
    });

  const aceptar = () => {
    state.resolver?.(true);
    setState({ ...state, visible: false });
  };

  const cancelar = () => {
    state.resolver?.(false);
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
