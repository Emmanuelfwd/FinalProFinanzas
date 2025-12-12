import api from "./api";

/* ===============================
   OBTENER INGRESOS
   (devuelve DATA directamente)
=============================== */
export const obtenerIngresos = async () => {
  const response = await api.get("ingresos/");
  return response.data;
};

/* ===============================
   CREAR INGRESO
=============================== */
export const crearIngreso = async (data) => {
  const response = await api.post("ingresos/", data);
  return response.data;
};

/* ===============================
   ACTUALIZAR INGRESO
=============================== */
export const actualizarIngreso = async (id, data) => {
  const response = await api.put(`ingresos/${id}/`, data);
  return response.data;
};

/* ===============================
   ELIMINAR INGRESO
=============================== */
export const eliminarIngreso = async (id) => {
  const response = await api.delete(`ingresos/${id}/`);
  return response.data;
};
