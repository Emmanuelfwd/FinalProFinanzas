import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="border-end bg-white" style={{ width: "260px" }}>
      <div className="p-3 fw-bold border-bottom">Panel Admin</div>

      <nav className="nav flex-column p-2 gap-1">
        <NavLink to="/admin" end className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/admin/usuarios" className="nav-link">
          Usuarios
        </NavLink>
        <NavLink to="/admin/categorias" className="nav-link">
          Categorías
        </NavLink>
        <NavLink to="/admin/monedas" className="nav-link">
          Tipo de Cambio
        </NavLink>
        <NavLink to="/admin/crear-admin" className="nav-link">
          Crear Admin
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
