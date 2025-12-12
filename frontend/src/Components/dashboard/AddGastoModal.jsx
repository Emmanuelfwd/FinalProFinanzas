import { useEffect, useState } from "react";
import api from "../../services/api";
import { crearGasto, actualizarGasto } from "../../services/gastos";

const AddGastoModal = ({ show, onClose, onSave, gastoEditar }) => {
  const isEdit = Boolean(gastoEditar);

  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);

  // OJO: usamos los nombres reales del backend
  const [idCategoria, setIdCategoria] = useState("");
  const [idMoneda, setIdMoneda] = useState("");

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const cargarCombos = async () => {
      try {
        const [catRes, monRes] = await Promise.all([
          api.get("categorias/"),
          api.get("tipocambio/"),
        ]);

        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        const mons = Array.isArray(monRes.data) ? monRes.data : [];

        // (Opcional) filtrar categorías para gastos
        const catsGasto = cats.filter(
          (c) => c.tipo === "GASTO" || c.tipo === "AMBOS"
        );

        setCategorias(catsGasto);
        setMonedas(mons);
      } catch (error) {
        console.error("Error cargando categorías/monedas:", error);
        setCategorias([]);
        setMonedas([]);
      }
    };

    cargarCombos();
  }, []);

  useEffect(() => {
    if (gastoEditar) {
      setIdCategoria(
        gastoEditar.id_categoria !== null && gastoEditar.id_categoria !== undefined
          ? String(gastoEditar.id_categoria)
          : ""
      );

      setIdMoneda(
        gastoEditar.id_moneda !== null && gastoEditar.id_moneda !== undefined
          ? String(gastoEditar.id_moneda)
          : ""
      );

      setMonto(gastoEditar.monto ?? "");
      setDescripcion(gastoEditar.descripcion ?? "");
      setFecha(gastoEditar.fecha ?? "");
    } else {
      setIdCategoria("");
      setIdMoneda("");
      setMonto("");
      setDescripcion("");
      setFecha("");
    }
  }, [gastoEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCategoria) {
      alert("Debe seleccionar una categoría.");
      return;
    }
    if (!idMoneda) {
      alert("Debe seleccionar una moneda.");
      return;
    }

    const montoNum = Number(monto);
    if (Number.isNaN(montoNum)) {
      alert("Monto inválido.");
      return;
    }

    // Payload con los campos EXACTOS del backend
    const payload = {
      id_categoria: Number(idCategoria),
      id_moneda: Number(idMoneda),
      monto: montoNum,
      fecha,
      descripcion,
    };

    try {
      if (isEdit) {
        await actualizarGasto(gastoEditar.id_gasto, payload);
      } else {
        await crearGasto(payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error guardando gasto:", error);
      alert("Error al guardar el gasto. Revisa consola para más detalle.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1055 }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Editar gasto" : "Agregar gasto"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Categoría *</label>
                  <select
                    className="form-select"
                    value={idCategoria}
                    onChange={(e) => setIdCategoria(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </select>
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
                      <option key={m.id_moneda} value={String(m.id_moneda)}>
                        {m.nombre_moneda}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Monto *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Guardar cambios" : "Guardar gasto"}
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

export default AddGastoModal;
