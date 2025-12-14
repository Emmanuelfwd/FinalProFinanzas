import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Trash2,
  RotateCcw,
  Filter,
  FileText,
} from "lucide-react";
import api from "../../services/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { exportHistorialPDF } from "../../services/exportHistorialPDF";

const HistoryView = () => {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);

  const [tab, setTab] = useState("todos");
  const [loading, setLoading] = useState(true);

  // Filtros
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [estado, setEstado] = useState("todos"); 

  // Modal eliminar
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [gRes, iRes, sRes] = await Promise.all([
        api.get("gastos/?incluir_eliminados=1"),
        api.get("ingresos/?incluir_eliminados=1"),
        api.get("suscripciones/?incluir_eliminados=1"),
      ]);

      setGastos(Array.isArray(gRes.data) ? gRes.data : []);
      setIngresos(Array.isArray(iRes.data) ? iRes.data : []);
      setSuscripciones(Array.isArray(sRes.data) ? sRes.data : []);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const restaurar = async (endpoint, id) => {
    try {
      await api.patch(`${endpoint}/${id}/restore/`);
      cargarTodo();
    } catch (error) {
      console.error("Error restaurando:", error);
      alert("No se pudo restaurar el registro.");
    }
  };

  const solicitarEliminar = (endpoint, id) => {
    setDeleteTarget({ endpoint, id });
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`${deleteTarget.endpoint}/${deleteTarget.id}/force/`);
      setShowModal(false);
      setDeleteTarget(null);
      cargarTodo();
    } catch (error) {
      console.error("Error eliminando definitivamente:", error);
      alert("No se pudo eliminar definitivamente.");
    }
  };

  const filas = useMemo(() => {
    return [
      ...gastos.map((g) => ({
        tipo: "gasto",
        id: g.id_gasto,
        fecha: g.fecha,
        descripcion: g.descripcion || "-",
        monto: g.monto,
        eliminado: g.eliminado,
        endpoint: "gastos",
      })),
      ...ingresos.map((i) => ({
        tipo: "ingreso",
        id: i.id_ingreso,
        fecha: i.fecha,
        descripcion: i.descripcion || "-",
        monto: i.monto,
        eliminado: i.eliminado,
        endpoint: "ingresos",
      })),
      ...suscripciones.map((s) => ({
        tipo: "suscripcion",
        id: s.id_suscripcion,
        fecha: s.fecha_inicio,
        descripcion: s.nombre_servicio,
        monto: s.monto_mensual,
        eliminado: s.eliminado,
        endpoint: "suscripciones",
      })),
    ];
  }, [gastos, ingresos, suscripciones]);

  const filasFiltradas = useMemo(() => {
    let data = [...filas];

    // Tab por tipo
    if (tab !== "todos") {
      data = data.filter((f) => f.tipo === tab);
    }

    // Estado
    if (estado === "activos") {
      data = data.filter((f) => !f.eliminado);
    } else if (estado === "eliminados") {
      data = data.filter((f) => f.eliminado);
    }

    // Fechas (YYYY-MM-DD)
    if (desde) data = data.filter((f) => f.fecha >= desde);
    if (hasta) data = data.filter((f) => f.fecha <= hasta);

    return data;
  }, [filas, tab, estado, desde, hasta]);

  const iconoTipo = (tipo) => {
    switch (tipo) {
      case "gasto":
        return <ArrowDownCircle size={18} className="text-danger me-1" />;
      case "ingreso":
        return <ArrowUpCircle size={18} className="text-success me-1" />;
      case "suscripcion":
        return <Repeat size={18} className="text-primary me-1" />;
      default:
        return null;
    }
  };

  const exportarPDF = () => {
    const mapTipo = (t) => {
      if (t === "gasto") return "Gasto";
      if (t === "ingreso") return "Ingreso";
      if (t === "suscripcion") return "Suscripción";
      return t;
    };

    const movimientosPDF = filasFiltradas.map((f) => ({
      tipo: mapTipo(f.tipo),
      fecha: f.fecha,
      descripcion: f.descripcion,
      monto: f.monto,
      eliminado: f.eliminado,
    }));

    exportHistorialPDF({
      movimientos: movimientosPDF,
      titulo: "Historial de movimientos (filtrado)",
      nombreArchivo: "historial_movimientos.pdf",
    });
  };

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Historial de movimientos</h3>

        <button className="btn btn-outline-dark" onClick={exportarPDF}>
          <FileText size={16} className="me-1" />
          Exportar PDF
        </button>
      </div>

      {/* FILTROS */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Desde</label>
              <input
                type="date"
                className="form-control"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Hasta</label>
              <input
                type="date"
                className="form-control"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="eliminados">Eliminados</option>
              </select>
            </div>

            <div className="col-md-3 text-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setDesde("");
                  setHasta("");
                  setEstado("todos");
                }}
              >
                <Filter size={16} className="me-1" />
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-3">
        {[
          { key: "todos", label: "Todos" },
          { key: "gasto", label: "Gastos" },
          { key: "ingreso", label: "Ingresos" },
          { key: "suscripcion", label: "Suscripciones" },
        ].map((t) => (
          <li className="nav-item" key={t.key}>
            <button
              className={`nav-link ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* TABLA */}
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Estado</th>
            <th style={{ width: "220px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filasFiltradas.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                Sin registros
              </td>
            </tr>
          )}

          {filasFiltradas.map((f, idx) => (
            <tr key={idx}>
              <td className="fw-semibold text-capitalize">
                {iconoTipo(f.tipo)}
                {f.tipo}
              </td>
              <td>{f.fecha}</td>
              <td>{f.descripcion}</td>
              <td>{f.monto}</td>
              <td>
                {f.eliminado ? (
                  <span className="badge bg-secondary">Eliminado</span>
                ) : (
                  <span className="badge bg-success">Activo</span>
                )}
              </td>
              <td>
                {f.eliminado ? (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => restaurar(f.endpoint, f.id)}
                  >
                    <RotateCcw size={16} className="me-1" />
                    Restaurar
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => solicitarEliminar(f.endpoint, f.id)}
                  >
                    <Trash2 size={16} className="me-1" />
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmarEliminar}
        title="Eliminar definitivamente"
        message="Esto eliminará el registro de forma permanente. ¿Deseas continuar?"
      />
    </div>
  );
};

export default HistoryView;
