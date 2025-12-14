import { useEffect, useMemo, useState } from "react";
import AddIngresoModal from "./AddIngresoModal";
import api from "../../services/api";
import { obtenerIngresos, eliminarIngreso } from "../../services/ingresos";

const IncomeView = () => {
  const [ingresos, setIngresos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [ingresoEditar, setIngresoEditar] = useState(null);

  /*
     Cargar categorías y monedas
*/
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

  /*Cargar ingresos  */
  const cargarIngresos = async () => {
    try {
      const data = await obtenerIngresos(); 
      setIngresos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando ingresos:", error);
      setIngresos([]);
    }
  };

  useEffect(() => {
    cargarCombos();
    cargarIngresos();
  }, []);

  /* Maps id → nombre*/
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

  /*Acciones*/
  const handleEliminar = async (id) => {
    await eliminarIngreso(id);
    cargarIngresos();
  };

  const handleEditar = (ingreso) => {
    setIngresoEditar(ingreso);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setIngresoEditar(null);
    setShowModal(true);
  };

  /* Render*/
  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Ingresos</h4>
        <button className="btn btn-primary" onClick={handleNuevo}>
          Agregar Ingreso
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Fuente</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Moneda</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((i) => (
              <tr key={i.id_ingreso}>
                <td>{i.fecha}</td>
                <td>{categoriasMap[i.id_categoria] || "—"}</td>
                <td>{i.descripcion}</td>
                <td>{i.monto}</td>
                <td>{monedasMap[i.id_moneda] || "—"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditar(i)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(i.id_ingreso)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {ingresos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay ingresos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddIngresoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={cargarIngresos}
        ingresoEditar={ingresoEditar}
      />
    </div>
  );
};

export default IncomeView;
