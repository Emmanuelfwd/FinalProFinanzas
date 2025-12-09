import API from "./api";

// Obtiene las suscripciones del usuario autenticado (el backend filtra por JWT)
export const obtenerSuscripciones = () => {
  return API.get("suscripciones/");
};
