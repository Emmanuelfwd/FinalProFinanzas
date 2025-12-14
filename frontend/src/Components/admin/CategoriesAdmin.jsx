import { useEffect, useState } from "react";
import api from "../../services/api";

const CategoriesAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("GASTO");

  const cargar = async () => {
    const res = await api.get("categorias/");
    setCategorias(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nombre) return;

    await api.post("categorias/", {
      nombre_categoria: nombre,
      tipo,
    });

    setNombre("");
    setTipo("GASTO");
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar categoría?")) return;
    await api.delete(`categorias/${id}/`);
    cargar();
  };

  return (
    <div>
      <h3 className="mb-3">Categorías</h3>

      <form className="row g-2 mb-4" onSubmit={handleCrear}>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Nombre categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>

        <div className="col-md-3">
          <button className="btn btn-primary w-100">
            Agregar
          </button>
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th style={{ width: "120px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id_categoria}>
              <td>{c.nombre_categoria}</td>
              <td>{c.tipo}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(c.id_categoria)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {categorias.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No hay categorías
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesAdmin;
