import React from "react";
import { Link } from "react-router-dom";

const SidebarDashboard = () => {
    return (
        <div className="bg-light border-end" style={{ width: "220px", height: "100vh" }}>
            <ul className="list-group list-group-flush">

                <li className="list-group-item">
                    <Link to="/dashboard/home">Inicio</Link>
                </li>

                <li className="list-group-item">
                    <Link to="/dashboard/gastos">Gastos</Link>
                </li>

                <li className="list-group-item">
                    <Link to="/dashboard/ingresos">Ingresos</Link>
                </li>

                <li className="list-group-item">
                    <Link to="/dashboard/suscripciones">Suscripciones</Link>
                </li>

                <li className="list-group-item">
                    <Link to="/dashboard/charts">Gráficas</Link>
                </li>

                <li className="list-group-item">
                    <Link to="/dashboard/historial">Historial</Link>
                </li>

            </ul>
        </div>
    );
};

export default SidebarDashboard;
