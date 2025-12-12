import api from "./api";

export const obtenerGastos = async () => {
  const response = await api.get("gastos/");
  return response.data;
};

export const crearGasto = async (data) => {
  const response = await api.post("gastos/", data);
  return response.data;
};

export const eliminarGasto = async (id) => {
  await api.delete(`gastos/${id}/`);
};

export const actualizarGasto = async (id, data) => {
  const response = await api.put(`gastos/${id}/`, data);
  return response.data;
};
