// frontend/src/Components/dashboard/ExpensesView.jsx
import React, { useEffect, useState } from "react";
import { obtenerGastos, eliminarGasto } from "../../services/gastos";
import AddGastoModal from "./AddGastoModal";
import "../../styles/expenses.css";

export default function ExpensesView() {
  const [gastos, setGastos] = useState([]);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarGastos = async () => {
    try {
      setCargando(true);
      setError("");
      const respuesta = await obtenerGastos();
      setGastos(respuesta.data || []);
    } catch (e) {
      console.error("Error cargando gastos:", e);
      setError("No se pudieron cargar los gastos.");
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminar = async (idGasto) => {
    if (!window.confirm("¿Seguro que deseas eliminar este gasto?")) return;
    try {
      await eliminarGasto(idGasto);
      await cargarGastos();
    } catch (e) {
      console.error("Error eliminando gasto:", e);
      alert("No se pudo eliminar el gasto.");
    }
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Gastos</h2>
        <button
          className="btn btn-primary"
          onClick={() => setMostrarModalAgregar(true)}
        >
          + Agregar gasto
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cargando ? (
        <p>Cargando gastos...</p>
      ) : gastos.length === 0 ? (
        <p>No tienes gastos registrados todavía.</p>
      ) : (
        <div className="row g-3">
          {gastos.map((gasto) => (
            <div className="col-md-4" key={gasto.id_gasto}>
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="h6">
                    {gasto.descripcion || "Gasto sin descripción"}
                  </h4>
                  <p className="mb-1">Monto: {gasto.monto}</p>
                  <p className="mb-2">Fecha: {gasto.fecha}</p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        alert("Pantalla de editar viene en el siguiente paso")
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => manejarEliminar(gasto.id_gasto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarModalAgregar && (
        <AddGastoModal
          show={mostrarModalAgregar}
          onClose={() => setMostrarModalAgregar(false)}
          onCreated={cargarGastos}
        />
      )}
    </div>
  );
}
