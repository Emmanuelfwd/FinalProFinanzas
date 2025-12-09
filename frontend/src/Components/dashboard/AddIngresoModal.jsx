import React, { useEffect, useState } from "react";
import {
  crearIngreso,
  obtenerCategoriasIngreso,
  obtenerMonedas,
} from "../../services/ingresos";

export default function AddIngresoModal({ show, onClose, onCreated }) {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaMonedas, setListaMonedas] = useState([]);
  const [idCategoria, setIdCategoria] = useState("");
  const [idMoneda, setIdMoneda] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (!show) return;

    const cargarDatos = async () => {
      try {
        setMensajeError("");
        const respuestaCategorias = await obtenerCategoriasIngreso();
        setListaCategorias(respuestaCategorias.data || []);
        const respuestaMonedas = await obtenerMonedas();
        setListaMonedas(respuestaMonedas.data || []);
      } catch (error) {
        console.error(
          "Error cargando datos del formulario de ingreso:",
          error
        );
        setMensajeError(
          "No se pudieron cargar las listas de categorías o monedas."
        );
      }
    };

    cargarDatos();
  }, [show]);

  if (!show) return null;

  const manejarCerrar = () => {
    if (estaGuardando) return;
    setMensajeError("");
    setIdCategoria("");
    setIdMoneda("");
    setMonto("");
    setFecha("");
    setDescripcion("");
    onClose();
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    if (!idCategoria || !idMoneda || !monto || !fecha) {
      setMensajeError("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      setEstaGuardando(true);
      setMensajeError("");

      const datosAEnviar = {
        id_categoria: idCategoria,
        id_moneda: idMoneda,
        monto,
        fecha,
        descripcion,
      };

      const respuesta = await crearIngreso(datosAEnviar);
      console.log("Respuesta backend:", respuesta.data);

      if (onCreated) await onCreated();
      manejarCerrar();
    } catch (error) {
      console.error("Error creando ingreso:", error);
      let mensaje =
        error.response?.data?.detail ||
        JSON.stringify(error.response?.data) ||
        "No se pudo guardar el ingreso.";
      setMensajeError(mensaje);
    } finally {
      setEstaGuardando(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content income-modal">
          <form onSubmit={manejarSubmit}>
            <header className="modal-header">
              <h5 className="modal-title">Agregar ingreso</h5>
              <button
                type="button"
                className="btn-close"
                onClick={manejarCerrar}
              ></button>
            </header>

            <div className="modal-body">
              {mensajeError && (
                <div className="alert alert-danger">{mensajeError}</div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={idCategoria}
                  onChange={(e) => setIdCategoria(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {listaCategorias.map((categoria) => (
                    <option
                      key={categoria.id_categoria}
                      value={categoria.id_categoria}
                    >
                      {categoria.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Moneda <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={idMoneda}
                  onChange={(e) => setIdMoneda(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {listaMonedas.map((moneda) => (
                    <option
                      key={moneda.id_moneda}
                      value={moneda.id_moneda}
                    >
                      {moneda.nombre_moneda}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Monto <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 250000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Fecha <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: salario, freelance, servicios, etc."
                  rows="2"
                />
              </div>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={manejarCerrar}
                disabled={estaGuardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={estaGuardando}
              >
                {estaGuardando ? "Guardando..." : "Guardar ingreso"}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
}
