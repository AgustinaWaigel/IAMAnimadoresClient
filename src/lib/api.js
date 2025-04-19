const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export const api = (endpoint) => {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return cleanEndpoint.startsWith('api/')
    ? `${BASE_URL}/${cleanEndpoint}`
    : `${BASE_URL}/api/${cleanEndpoint}`;
};
