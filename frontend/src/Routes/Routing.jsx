import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../Pages/LandingPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Pages/Dashboard";
import AdminDashboard from "../Pages/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const Routing = () => {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Usuario */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;
