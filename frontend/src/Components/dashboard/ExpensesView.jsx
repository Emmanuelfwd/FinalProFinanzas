import React, { useEffect, useState } from "react";
import { obtenerGastos, eliminarGasto } from "../../services/gastos";

export default function ExpensesView() {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarGastos = async () => {
        try {
            const res = await obtenerGastos();
            setGastos(res.data);
        } catch (error) {
            console.error("Error al cargar gastos:", error);
        }
        setLoading(false);
    };

    const borrar = async (id) => {
        await eliminarGasto(id);
        cargarGastos();
    };

    useEffect(() => {
        cargarGastos();
    }, []);

    if (loading) return <p>Cargando gastos...</p>;

    return (
        <div className="container">
            <h2 className="mb-4">Gastos</h2>

            {gastos.length === 0 && <p>No hay gastos registrados.</p>}

            <ul className="list-group">
                {gastos.map(g => (
                    <li
                        key={g.id_gasto}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{g.descripcion}</strong>
                            <br />
                            Monto: ₡{g.monto}
                            <br />
                            Fecha: {g.fecha}
                        </div>

                        <button
                            className="btn btn-danger"
                            onClick={() => borrar(g.id_gasto)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
