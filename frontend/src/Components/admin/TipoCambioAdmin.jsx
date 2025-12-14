import { useEffect, useState } from "react";
import api from "../../services/api";

const TipoCambioAdmin = () => {
  const [monedas, setMonedas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [tasa, setTasa] = useState("");

  const cargar = async () => {
    const res = await api.get("tipocambio/");
    setMonedas(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nombre || !tasa) return;

    await api.post("tipocambio/", {
      nombre_moneda: nombre,
      tasa_cambio: tasa,
    });

    setNombre("");
    setTasa("");
    cargar();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar moneda?")) return;
    await api.delete(`tipocambio/${id}/`);
    cargar();
  };

  return (
    <div>
      <h3 className="mb-3">Tipo de Cambio</h3>

      <form className="row g-2 mb-4" onSubmit={handleCrear}>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Nombre moneda"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="Tasa"
            value={tasa}
            onChange={(e) => setTasa(e.target.value)}
          />
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
            <th>Moneda</th>
            <th>Tasa</th>
            <th style={{ width: "120px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {monedas.map((m) => (
            <tr key={m.id_moneda}>
              <td>{m.nombre_moneda}</td>
              <td>{m.tasa_cambio}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleEliminar(m.id_moneda)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {monedas.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No hay monedas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TipoCambioAdmin;
