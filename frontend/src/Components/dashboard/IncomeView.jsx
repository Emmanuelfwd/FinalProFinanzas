import React, { useEffect, useState } from "react";
import "../../styles/income.css";
import { obtenerIngresos, eliminarIngreso } from "../../services/ingresos";
import AddIngresoModal from "./AddIngresoModal";
import EditIngresoModal from "./EditIngresoModal";

export default function IncomeView() {
    const [listaIngresos, setListaIngresos] = useState([]);
    const [estaCargando, setEstaCargando] = useState(false);
    const [mensajeError, setMensajeError] = useState("");

    const [mostrarModalAgregarIngreso, setMostrarModalAgregarIngreso] = useState(false);
    const [mostrarModalEditarIngreso, setMostrarModalEditarIngreso] = useState(false);
    const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

    const cargarIngresos = async () => {
        try {
            setEstaCargando(true);
            setMensajeError("");
            const respuesta = await obtenerIngresos();
            setListaIngresos(respuesta.data || []);
        } catch (error) {
            console.error("Error cargando ingresos:", error);
            setMensajeError("No se pudieron cargar los ingresos.");
        } finally {
            setEstaCargando(false);
        }
    };

    useEffect(() => {
        cargarIngresos();
    }, []);

    const manejarAbrirModalAgregar = () => {
        setMostrarModalAgregarIngreso(true);
    };

    const manejarCerrarModalAgregar = () => {
        setMostrarModalAgregarIngreso(false);
    };

    const manejarAbrirModalEditar = (ingreso) => {
        setIngresoSeleccionado(ingreso);
        setMostrarModalEditarIngreso(true);
    };

    const manejarCerrarModalEditar = () => {
        setIngresoSeleccionado(null);
        setMostrarModalEditarIngreso(false);
    };

    const manejarEliminarIngreso = async (idIngreso) => {
        const confirmacion = window.confirm("¿Seguro deseas eliminar este ingreso?");
        if (!confirmacion) return;

        try {
            await eliminarIngreso(idIngreso);
            await cargarIngresos();
        } catch (error) {
            console.error("Error eliminando ingreso:", error);
            alert("No se pudo eliminar el ingreso.");
        }
    };

    return (
        <div className="income-container">

            <div className="income-header">
                <div>
                    <h2 className="income-title">Ingresos</h2>
                    <p className="income-subtitle">Registra y gestiona tus ingresos fácilmente.</p>
                </div>

                <button
                    className="income-add-button"
                    onClick={manejarAbrirModalAgregar}
                >
                    + Agregar ingreso
                </button>
            </div>

            {mensajeError && <div className="income-error">{mensajeError}</div>}

            {estaCargando ? (
                <div className="income-loading">Cargando ingresos...</div>
            ) : listaIngresos.length === 0 ? (
                <div className="income-empty">
                    No tienes ingresos registrados. Usa “Agregar ingreso”.
                </div>
            ) : (
                <div className="income-grid">
                    {listaIngresos.map((ingreso) => (
                        <article className="income-card" key={ingreso.id_ingreso}>
                            <header className="income-card-header">
                                <h3 className="income-description-title">
                                    {ingreso.descripcion || "Ingreso"}
                                </h3>
                                <span className="income-date">{ingreso.fecha}</span>
                            </header>

                            <div className="income-amount-row">
                                <span className="income-amount">₡ {ingreso.monto}</span>
                            </div>

                            <footer className="income-card-footer">
                                <button
                                    className="income-edit-button"
                                    onClick={() => manejarAbrirModalEditar(ingreso)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="income-delete-button"
                                    onClick={() => manejarEliminarIngreso(ingreso.id_ingreso)}
                                >
                                    Eliminar
                                </button>
                            </footer>
                        </article>
                    ))}
                </div>
            )}

            {mostrarModalAgregarIngreso && (
                <AddIngresoModal
                    show={mostrarModalAgregarIngreso}
                    onClose={manejarCerrarModalAgregar}
                    onCreated={cargarIngresos}
                />
            )}

            {mostrarModalEditarIngreso && ingresoSeleccionado && (
                <EditIngresoModal
                    show={mostrarModalEditarIngreso}
                    onClose={manejarCerrarModalEditar}
                    onUpdated={cargarIngresos}
                    ingreso={ingresoSeleccionado}
                />
            )}
        </div>
    );
}
