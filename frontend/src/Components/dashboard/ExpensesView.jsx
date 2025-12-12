import { useEffect, useMemo, useState } from "react";
import AddGastoModal from "./AddGastoModal";
import api from "../../services/api";
import { obtenerGastos, eliminarGasto } from "../../services/gastos";

const ExpensesView = () => {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [gastoEditar, setGastoEditar] = useState(null);

  /* ===============================
     Cargar categorías y monedas
  =============================== */
  const cargarCombos = async () => {
    try {
      const [catRes, monRes] = await Promise.all([
        api.get("categorias/"),
        api.get("tipocambio/"),
      ]);

      setCategorias(Array.isArray(catRes.data) ? catRes.data : []);
      setMonedas(Array.isArray(monRes.data) ? monRes.data : []);
    } catch (error) {
      console.error("Error cargando combos:", error);
      setCategorias([]);
      setMonedas([]);
    }
  };

  /* ===============================
     Cargar gastos (✔️ CORRECTO)
  =============================== */
  const cargarGastos = async () => {
    try {
      const data = await obtenerGastos(); // ⬅️ data REAL
      setGastos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando gastos:", error);
      setGastos([]);
    }
  };

  useEffect(() => {
    cargarCombos();
    cargarGastos();
  }, []);

  /* ===============================
     Maps id → nombre
  =============================== */
  const categoriasMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => {
      map[c.id_categoria] = c.nombre_categoria;
    });
    return map;
  }, [categorias]);

  const monedasMap = useMemo(() => {
    const map = {};
    monedas.forEach((m) => {
      map[m.id_moneda] = m.nombre_moneda;
    });
    return map;
  }, [monedas]);

  /* ===============================
     Acciones
  =============================== */
  const handleEliminar = async (id) => {
    await eliminarGasto(id);
    cargarGastos();
  };

  const handleEditar = (gasto) => {
    setGastoEditar(gasto);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setGastoEditar(null);
    setShowModal(true);
  };

  /* ===============================
     Render
  =============================== */
  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Gastos</h4>
        <button className="btn btn-primary" onClick={handleNuevo}>
          Agregar Gasto
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Moneda</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((g) => (
              <tr key={g.id_gasto}>
                <td>{g.fecha}</td>
                <td>{categoriasMap[g.id_categoria] || "—"}</td>
                <td>{g.descripcion}</td>
                <td>{g.monto}</td>
                <td>{monedasMap[g.id_moneda] || "—"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditar(g)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(g.id_gasto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {gastos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay gastos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddGastoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={cargarGastos}
        gastoEditar={gastoEditar}
      />
    </div>
  );
};

export default ExpensesView;
