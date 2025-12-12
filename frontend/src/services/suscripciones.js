import API from "./api";

export const obtenerSuscripciones = () => {
  return API.get("suscripciones/");
};
