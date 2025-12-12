import api from "./api";

export const obtenerSuscripciones = async () => {
  const res = await api.get("suscripciones/");
  return res.data;
};

export const crearSuscripcion = async (data) => {
  const res = await api.post("suscripciones/", data);
  return res.data;
};

export const actualizarSuscripcion = async (id, data) => {
  const res = await api.put(`suscripciones/${id}/`, data);
  return res.data;
};

export const eliminarSuscripcion = async (id) => {
  const res = await api.delete(`suscripciones/${id}/`);
  return res.data;
};
