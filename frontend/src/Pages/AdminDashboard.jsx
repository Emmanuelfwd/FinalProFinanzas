import { Routes, Route } from "react-router-dom";
import NavbarDashboard from "../Components/dashboard/NavbarDashboard";
import AdminSidebar from "../Components/admin/AdminSidebar";

import AdminHome from "../Components/admin/AdminHome";
import UsersAdmin from "../Components/admin/UsersAdmin";
import CategoriesAdmin from "../Components/admin/CategoriesAdmin";
import TipoCambioAdmin from "../Components/admin/TipoCambioAdmin";
import CreateAdmin from "../Components/admin/CreateAdmin";

const AdminDashboard = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarDashboard />

      <div className="d-flex flex-grow-1">
        <AdminSidebar />

        <main className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="usuarios" element={<UsersAdmin />} />
            <Route path="categorias" element={<CategoriesAdmin />} />
            <Route path="monedas" element={<TipoCambioAdmin />} />
            <Route path="crear-admin" element={<CreateAdmin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
