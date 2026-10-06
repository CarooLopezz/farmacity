import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Convierte los errores del backend en un texto legible
export function mensajeError(error) {
  const msg = error.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('. ');
  return msg || 'No se pudo conectar con el servidor';
}