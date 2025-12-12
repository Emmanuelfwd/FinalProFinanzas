import { useEffect, useState } from "react";
import api from "../../services/api";
import { crearIngreso, actualizarIngreso } from "../../services/ingresos";

const AddIngresoModal = ({ show, onClose, onSave, ingresoEditar }) => {
  const isEdit = Boolean(ingresoEditar);

  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);

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

        // Solo categorías de INGRESO
        const cats = Array.isArray(catRes.data)
          ? catRes.data.filter(
              (c) => c.tipo === "INGRESO" || c.tipo === "AMBOS"
            )
          : [];

        setCategorias(cats);
        setMonedas(Array.isArray(monRes.data) ? monRes.data : []);
      } catch (error) {
        console.error("Error cargando combos:", error);
        setCategorias([]);
        setMonedas([]);
      }
    };

    cargarCombos();
  }, []);

  useEffect(() => {
    if (ingresoEditar) {
      setIdCategoria(String(ingresoEditar.id_categoria ?? ""));
      setIdMoneda(String(ingresoEditar.id_moneda ?? ""));
      setMonto(ingresoEditar.monto ?? "");
      setDescripcion(ingresoEditar.descripcion ?? "");
      setFecha(ingresoEditar.fecha ?? "");
    } else {
      setIdCategoria("");
      setIdMoneda("");
      setMonto("");
      setDescripcion("");
      setFecha("");
    }
  }, [ingresoEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCategoria || !idMoneda) {
      alert("Debe seleccionar categoría y moneda.");
      return;
    }

    const payload = {
      id_categoria: Number(idCategoria),
      id_moneda: Number(idMoneda),
      monto: Number(monto),
      fecha,
      descripcion,
    };

    try {
      if (isEdit) {
        await actualizarIngreso(ingresoEditar.id_ingreso, payload);
      } else {
        await crearIngreso(payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error guardando ingreso:", error);
      alert("Error al guardar ingreso.");
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
                  {isEdit ? "Editar ingreso" : "Agregar ingreso"}
                </h5>
                <button className="btn-close" onClick={onClose} />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Fuente *</label>
                  <select
                    className="form-select"
                    value={idCategoria}
                    onChange={(e) => setIdCategoria(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    {categorias.map((c) => (
                      <option key={c.id_categoria} value={c.id_categoria}>
                        {c.nombre_categoria}
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
                      <option key={m.id_moneda} value={m.id_moneda}>
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
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                  {isEdit ? "Guardar cambios" : "Guardar ingreso"}
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

export default AddIngresoModal;
