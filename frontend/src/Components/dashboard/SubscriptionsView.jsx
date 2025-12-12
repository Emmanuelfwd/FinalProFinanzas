import { useEffect, useState } from "react";
import {
  obtenerSuscripciones,
  eliminarSuscripcion,
} from "../../services/suscripciones";
import AddSubscriptionModal from "./AddSubscriptionModal";

const SubscriptionsView = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subEditar, setSubEditar] = useState(null);

  const cargarTodo = async () => {
    try {
      const subsRes = await obtenerSuscripciones();
      setSuscripciones(Array.isArray(subsRes) ? subsRes : []);
    } catch (error) {
      console.error("Error cargando suscripciones:", error);
      setSuscripciones([]);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta suscripción?")) return;
    await eliminarSuscripcion(id);
    cargarTodo();
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Suscripciones</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSubEditar(null);
            setShowModal(true);
          }}
        >
          Nueva Suscripción
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Costo Mensual</th>
              <th>Moneda</th>
              <th>Estado</th>
              <th style={{ width: "160px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suscripciones.length > 0 ? (
              suscripciones.map((s) => (
                <tr key={s.id_suscripcion}>
                  <td>{s.nombre_servicio}</td>
                  <td>
                    {Number(s.monto_mensual).toLocaleString("es-CR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{s.moneda_nombre || "—"}</td>
                  <td>
                    {s.estado ? (
                      <span className="badge bg-success">Activa</span>
                    ) : (
                      <span className="badge bg-secondary">Inactiva</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setSubEditar(s);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(s.id_suscripcion)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No hay suscripciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddSubscriptionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={cargarTodo}
        subEditar={subEditar}
      />
    </div>
  );
};

export default SubscriptionsView;
