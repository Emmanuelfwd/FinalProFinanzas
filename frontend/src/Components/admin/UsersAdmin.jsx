import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  eliminarUsuario,
  cambiarPasswordUsuario,
} from "../../services/admin";

const UsersAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [password, setPassword] = useState("");

  const cargar = async () => {
    setUsuarios(await obtenerUsuarios());
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar usuario?")) {
      await eliminarUsuario(id);
      cargar();
    }
  };

  const handlePassword = async (id) => {
    if (!password) return;
    await cambiarPasswordUsuario(id, password);
    alert("Contraseña actualizada");
    setPassword("");
  };

  return (
    <>
      <h3 className="mb-3">Usuarios</h3>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.is_admin ? "Sí" : "No"}</td>
              <td className="d-flex gap-2">
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="Nueva clave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handlePassword(u.id_usuario)}
                >
                  Cambiar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(u.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersAdmin;
