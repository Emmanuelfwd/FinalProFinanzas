import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../Pages/LandingPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Pages/Dashboard";

import ProtectedRoute from "../Components/ProtectedRoute";

const Routing = () => {
    return (
        <Routes>
            {/* Publicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route 
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Redirección automática si alguien accede a /dashboard */}
            <Route 
                path="/dashboard" 
                element={<Navigate to="/dashboard/home" replace />} 
            />

            {/* Catch-all para rutas inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default Routing;
