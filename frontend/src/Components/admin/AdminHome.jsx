import React from "react";

const AdminHome = () => {
  return (
    <div>
      <h2 className="mb-3">Dashboard Administrativo</h2>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Usuarios registrados</h6>
              <h3 className="fw-bold">—</h3>
              <small className="text-muted">
                Total de usuarios en el sistema
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Administradores</h6>
              <h3 className="fw-bold">—</h3>
              <small className="text-muted">
                Usuarios con rol administrador
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Configuraciones</h6>
              <h3 className="fw-bold">—</h3>
              <small className="text-muted">
                Categorías y monedas activas
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4">
        Desde este panel puedes administrar usuarios, categorías, tipos de
        cambio y crear nuevos administradores.
      </div>
    </div>
  );
};

export default AdminHome;
