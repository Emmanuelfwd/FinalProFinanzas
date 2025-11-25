import React, { useEffect, useState } from "react";
import API from "../../services/api";
import AddGastoModal from "./AddGastoModal";
import "../../styles/expenses.css";

export default function ExpensesView() {
    const [gastos, setGastos] = useState([]);
    const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

    const cargarGastos = async () => {
        try {
            const idUsuario = localStorage.getItem("userId");
            const respuesta = await API.get(`gastos/?usuario=${idUsuario}`);
            setGastos(respuesta.data);
        } catch (error) {
            console.error("Error cargando gastos:", error);
        }
    };

    const eliminarGasto = async (idGasto) => {
        if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;

        try {
            await API.delete(`gastos/${idGasto}/`);
            cargarGastos();
        } catch (error) {
            console.error("Error eliminando gasto:", error);
        }
    };

    useEffect(() => {
        cargarGastos();
    }, []);

    return (
        <div className="expenses-wrapper">

            <div className="title-bar">
                <h2>Gastos</h2>

                <button
                    className="add-btn"
                    onClick={() => setMostrarModalAgregar(true)}
                >
                    + Agregar gasto
                </button>
            </div>

            <div className="expenses-list">
                {gastos.map(gasto => (
                    <div className="expense-card" key={gasto.id_gasto}>
                        <h4>{gasto.descripcion || "Gasto sin descripción"}</h4>

                        <p><strong>Monto:</strong> {gasto.monto}</p>
                        <p><strong>Fecha:</strong> {gasto.fecha}</p>

                        <div className="expense-actions">

                            <button
                                className="edit-btn"
                                onClick={() => alert("Pantalla de editar viene en el siguiente paso")}
                            >
                                Editar
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => eliminarGasto(gasto.id_gasto)}
                            >
                                Eliminar
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {mostrarModalAgregar && (
                <AddGastoModal
                    show={mostrarModalAgregar}
                    onClose={() => setMostrarModalAgregar(false)}
                    onCreated={cargarGastos}
                />
            )}
        </div>
    );
}
