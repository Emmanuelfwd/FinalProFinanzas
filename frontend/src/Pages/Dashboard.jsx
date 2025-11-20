import React from "react";
import { Routes, Route } from "react-router-dom";

import NavbarDashboard from "../Components/dashboard/NavbarDashboard";
import SidebarDashboard from "../Components/dashboard/SidebarDashboard";

import { Navigate } from "react-router-dom";
import DashboardHome from "../Components/dashboard/DashboardHome";
import ExpensesView from "../Components/dashboard/ExpensesView";
import IncomeView from "../Components/dashboard/IncomeView";
import SubscriptionsView from "../Components/dashboard/SubscriptionsView";
import ChartsView from "../Components/dashboard/ChartsView";
import HistoryView from "../Components/dashboard/HistoryView";

const Dashboard = () => {
    return (
        <div>
            <NavbarDashboard />

            <div style={{ display: "flex" }}>
                
                <SidebarDashboard />

                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="home" />} />

                        <Route path="home" element={<DashboardHome />} />
                        <Route path="gastos" element={<ExpensesView />} />
                        <Route path="ingresos" element={<IncomeView />} />
                        <Route path="suscripciones" element={<SubscriptionsView />} />
                        <Route path="charts" element={<ChartsView />} />
                        <Route path="historial" element={<HistoryView />} />
                    </Routes>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
