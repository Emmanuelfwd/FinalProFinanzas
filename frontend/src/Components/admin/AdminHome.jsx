import React, { useEffect, useMemo, useState } from "react";
import { obtenerUsuarios } from "../../services/admin";
import api from "../../services/api";

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [error, setError] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);

    try {
      const [users, catsRes, monedasRes] = await Promise.all([
        obtenerUsuarios(), 
        api.get("categorias/"), 
        api.get("tipocambio/"),
      ]);

      setUsuarios(Array.isArray(users) ? users : []);
      setCategorias(Array.isArray(catsRes.data) ? catsRes.data : []);
      setMonedas(Array.isArray(monedasRes.data) ? monedasRes.data : []);
    } catch (e) {
      setError(
        "No se pudieron cargar los datos del panel admin. Verifica que el backend esté corriendo y que el usuario sea admin."
      );
      setUsuarios([]);
      setCategorias([]);
      setMonedas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const totalUsuarios = usuarios.length;

  const totalAdmins = useMemo(() => {
    return usuarios.filter((u) => u.is_admin === true).length;
  }, [usuarios]);

  const categoriasActivas = categorias.length;
  const monedasActivas = monedas.length;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dashboard Administrativo</h2>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={cargar}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Usuarios registrados</h6>
              <h3 className="fw-bold mb-1">
                {loading ? "—" : totalUsuarios}
              </h3>
              <small className="text-muted">Total de usuarios en el sistema</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Administradores</h6>
              <h3 className="fw-bold mb-1">
                {loading ? "—" : totalAdmins}
              </h3>
              <small className="text-muted">Usuarios con rol administrador</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Configuraciones</h6>
              <h3 className="fw-bold mb-1">
                {loading ? "—" : `${categoriasActivas} / ${monedasActivas}`}
              </h3>
              <small className="text-muted">
                Categorías activas / Monedas registradas
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4 mb-0">
        Desde este panel puedes administrar usuarios, categorías, tipos de cambio y crear nuevos administradores.
      </div>
    </div>
  );
};

export default AdminHome;
