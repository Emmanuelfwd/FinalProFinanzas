
import API from "./api";

// Obtiene los gastos del usuario autenticado
export const obtenerGastos = async () => {
  const userId = localStorage.getItem("userId");
  return API.get(`/gastos/?usuario=${userId}`);
};

// Crea un gasto nuevo (el backend asigna id_usuario desde el JWT)
export const crearGasto = async (data) => {
  return API.post("/gastos/", data);
};

export const eliminarGasto = async (id) => {
  return API.delete(`/gastos/${id}/`);
};

export const actualizarGasto = async (id, data) => {
  return API.put(`/gastos/${id}/`, data);
};
