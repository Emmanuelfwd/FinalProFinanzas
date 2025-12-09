// frontend/src/services/ingresos.js
import API from "./api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function obtenerIngresos() {
  const idUsuario = localStorage.getItem("userId");
  return API.get(`ingresos/?usuario=${idUsuario}`, {
    headers: getAuthHeaders(),
  });
}

export function crearIngreso(datos) {
  return API.post("ingresos/", datos, { headers: getAuthHeaders() });
}

export function actualizarIngreso(idIngreso, datos) {
  return API.put(`ingresos/${idIngreso}/`, datos, {
    headers: getAuthHeaders(),
  });
}

export function eliminarIngreso(idIngreso) {
  return API.delete(`ingresos/${idIngreso}/`, { headers: getAuthHeaders() });
}

export function obtenerCategoriasIngreso() {
  return API.get("categorias/?tipo=INGRESO", { headers: getAuthHeaders() });
}

export function obtenerMonedas() {
  return API.get("tipocambio/", { headers: getAuthHeaders() });
}
