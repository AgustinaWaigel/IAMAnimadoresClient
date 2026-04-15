const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

const getBaseUrl = (): string => {
  if (!BASE_URL) {
    throw new Error(
      "Falta configurar VITE_API_URL en el entorno. Creá un archivo .env con la URL del backend, por ejemplo: VITE_API_URL=https://tu-backend.com"
    );
  }

  return BASE_URL;
};

export const api = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const baseUrl = getBaseUrl();

  return cleanEndpoint.startsWith('api/')
    ? `${baseUrl}/${cleanEndpoint}`
    : `${baseUrl}/api/${cleanEndpoint}`;
};
