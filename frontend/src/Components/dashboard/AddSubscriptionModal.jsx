import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  crearSuscripcion,
  actualizarSuscripcion,
} from "../../services/suscripciones";

const AddSubscriptionModal = ({ show, onClose, onSave, subEditar }) => {
  const isEdit = Boolean(subEditar);

  const [nombreServicio, setNombreServicio] = useState("");
  const [monto, setMonto] = useState("");
  const [idMoneda, setIdMoneda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [estado, setEstado] = useState(true);

  const [monedas, setMonedas] = useState([]);

  /* ===============================
     Cargar monedas (TipoCambio)
  =============================== */
  useEffect(() => {
    const cargarMonedas = async () => {
      try {
        const res = await api.get("tipocambio/");
        setMonedas(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error cargando monedas:", e);
        setMonedas([]);
      }
    };
    cargarMonedas();
  }, []);

  /* ===============================
     Precarga al editar
  =============================== */
  useEffect(() => {
    if (subEditar) {
      setNombreServicio(subEditar.nombre_servicio ?? "");
      setMonto(subEditar.monto_mensual ?? "");
      setIdMoneda(String(subEditar.id_moneda ?? ""));
      setFechaInicio(subEditar.fecha_inicio ?? "");
      setEstado(Boolean(subEditar.estado));
    } else {
      setNombreServicio("");
      setMonto("");
      setIdMoneda("");
      setFechaInicio("");
      setEstado(true);
    }
  }, [subEditar]);

  /* ===============================
     Guardar
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreServicio || !monto || !idMoneda || !fechaInicio) {
      alert("Complete todos los campos obligatorios.");
      return;
    }

    const payload = {
      nombre_servicio: nombreServicio,
      monto_mensual: Number(monto),
      id_moneda: Number(idMoneda),
      fecha_inicio: fechaInicio,
      estado: estado,
    };

    try {
      if (isEdit) {
        await actualizarSuscripcion(subEditar.id_suscripcion, payload);
      } else {
        await crearSuscripcion(payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(
        "Error guardando suscripción:",
        error.response?.data || error
      );
      alert("Error al guardar la suscripción. Revisa consola.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Editar suscripción" : "Nueva suscripción"}
                </h5>
                <button className="btn-close" onClick={onClose} />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Servicio *</label>
                  <input
                    className="form-control"
                    value={nombreServicio}
                    onChange={(e) => setNombreServicio(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Costo mensual *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Moneda *</label>
                  <select
                    className="form-select"
                    value={idMoneda}
                    onChange={(e) => setIdMoneda(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    {monedas.map((m) => (
                      <option key={m.id_moneda} value={m.id_moneda}>
                        {m.nombre_moneda}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de inicio *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Suscripción activa
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050, pointerEvents: "none" }}
      />
    </>
  );
};

export default AddSubscriptionModal;
