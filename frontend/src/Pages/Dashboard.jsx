import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarDashboard from "../Components/dashboard/NavbarDashboard";
import SidebarDashboard from "../Components/dashboard/SidebarDashboard";

import DashboardHome from "../Components/dashboard/DashboardHome";
import ExpensesView from "../Components/dashboard/ExpensesView";
import IncomeView from "../Components/dashboard/IncomeView";
import SubscriptionsView from "../Components/dashboard/SubscriptionsView";
import ChartsView from "../Components/dashboard/ChartsView";
import HistoryView from "../Components/dashboard/HistoryView";

import "../styles/dashboard-bg.css";

const Dashboard = () => {
  return (
    <div className="dashboard-bg">
      <div className="dashboard-overlay d-flex flex-column">
        <NavbarDashboard />

        <div className="d-flex flex-grow-1">
          <SidebarDashboard />

          <main className="flex-grow-1 dashboard-main">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="gastos" element={<ExpensesView />} />
              <Route path="ingresos" element={<IncomeView />} />
              <Route path="suscripciones" element={<SubscriptionsView />} />
              <Route path="graficas" element={<ChartsView />} />
              <Route path="historial" element={<HistoryView />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
