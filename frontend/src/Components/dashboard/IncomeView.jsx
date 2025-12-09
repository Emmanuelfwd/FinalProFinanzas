import React, { useEffect, useState } from "react";
import "../../styles/income.css";
import {
  obtenerIngresos,
  eliminarIngreso,
} from "../../services/ingresos";
import AddIngresoModal from "./AddIngresoModal";
import EditIngresoModal from "./EditIngresoModal";

export default function IncomeView() {
  const [listaIngresos, setListaIngresos] = useState([]);
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarModalAgregarIngreso, setMostrarModalAgregarIngreso] =
    useState(false);
  const [mostrarModalEditarIngreso, setMostrarModalEditarIngreso] =
    useState(false);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

  const cargarIngresos = async () => {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const respuesta = await obtenerIngresos();
      setListaIngresos(respuesta.data || []);
    } catch (error) {
      console.error("Error cargando ingresos:", error);
      setMensajeError("No se pudieron cargar los ingresos.");
    } finally {
      setEstaCargando(false);
    }
  };

  useEffect(() => {
    cargarIngresos();
  }, []);

  const manejarAbrirModalAgregar = () => {
    setMostrarModalAgregarIngreso(true);
  };

  const manejarCerrarModalAgregar = () => {
    setMostrarModalAgregarIngreso(false);
  };

  const manejarAbrirModalEditar = (ingreso) => {
    setIngresoSeleccionado(ingreso);
    setMostrarModalEditarIngreso(true);
  };

  const manejarCerrarModalEditar = () => {
    setIngresoSeleccionado(null);
    setMostrarModalEditarIngreso(false);
  };

  const manejarEliminarIngreso = async (idIngreso) => {
    const confirmacion = window.confirm(
      "¿Seguro deseas eliminar este ingreso?"
    );
    if (!confirmacion) return;
    try {
      await eliminarIngreso(idIngreso);
      await cargarIngresos();
    } catch (error) {
      console.error("Error eliminando ingreso:", error);
      alert("No se pudo eliminar el ingreso.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Ingresos</h2>
        <button
          className="btn btn-primary"
          onClick={manejarAbrirModalAgregar}
        >
          + Agregar ingreso
        </button>
      </div>

      {mensajeError && (
        <div className="alert alert-danger">{mensajeError}</div>
      )}

      {estaCargando ? (
        <p>Cargando ingresos...</p>
      ) : listaIngresos.length === 0 ? (
        <p>No tienes ingresos registrados. Usa “Agregar ingreso”.</p>
      ) : (
        <div className="row g-3">
          {listaIngresos.map((ingreso) => (
            <div className="col-md-4" key={ingreso.id_ingreso}>
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h6">
                    {ingreso.descripcion || "Ingreso"}
                  </h3>
                  <p className="mb-1">{ingreso.fecha}</p>
                  <p className="mb-2">₡ {ingreso.monto}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => manejarAbrirModalEditar(ingreso)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        manejarEliminarIngreso(ingreso.id_ingreso)
                      }
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

      {mostrarModalAgregarIngreso && (
        <AddIngresoModal
          show={mostrarModalAgregarIngreso}
          onClose={manejarCerrarModalAgregar}
          onCreated={cargarIngresos}
        />
      )}

      {mostrarModalEditarIngreso && ingresoSeleccionado && (
        <EditIngresoModal
          show={mostrarModalEditarIngreso}
          ingreso={ingresoSeleccionado}
          onClose={manejarCerrarModalEditar}
          onUpdated={cargarIngresos}
        />
      )}
    </div>
  );
}
