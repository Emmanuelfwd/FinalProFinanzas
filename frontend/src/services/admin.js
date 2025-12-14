import api from "./api";


export const obtenerUsuarios = async () => {
  const res = await api.get("admin/usuarios/");
  return res.data;
};

export const eliminarUsuario = async (id) => {
  await api.delete(`admin/usuarios/${id}/`);
};

export const cambiarPasswordUsuario = async (id, password) => {
  await api.put(`admin/usuarios/${id}/password/`, { password });
};


export const crearAdmin = async (data) => {
  const res = await api.post("admin/crear-admin/", data);
  return res.data;
};
