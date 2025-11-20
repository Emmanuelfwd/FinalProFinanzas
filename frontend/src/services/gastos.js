
import API from "./api";

export const obtenerGastos = async () => {
  
  return API.get("gastos/");
};

export const crearGasto = async (data) => {
  return API.post("gastos/", data);
};

export const eliminarGasto = async (id) => {
  return API.delete(`gastos/${id}/`);
};

export const actualizarGasto = async (id, data) => {
  return API.put(`gastos/${id}/`, data);
};
