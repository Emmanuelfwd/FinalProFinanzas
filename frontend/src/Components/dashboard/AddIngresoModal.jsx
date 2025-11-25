import React, { useEffect, useState } from "react";
import { crearIngreso, obtenerCategoriasIngreso, obtenerMonedas } from "../../services/ingresos";

export default function AddIngresoModal({ show, onClose, onCreated }) {
    const [listaCategorias, setListaCategorias] = useState([]);
    const [listaMonedas, setListaMonedas] = useState([]);

    const [idCategoria, setIdCategoria] = useState("");
    const [idMoneda, setIdMoneda] = useState("");
    const [monto, setMonto] = useState("");
    const [fecha, setFecha] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [estaGuardando, setEstaGuardando] = useState(false);
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        if (!show) return;

        const cargarDatos = async () => {
            try {
                setMensajeError("");

                const respuestaCategorias = await obtenerCategoriasIngreso();
                setListaCategorias(respuestaCategorias.data || []);

                const respuestaMonedas = await obtenerMonedas();
                setListaMonedas(respuestaMonedas.data || []);
            } catch (error) {
                console.error("Error cargando datos del formulario de ingreso:", error);
                setMensajeError("No se pudieron cargar las listas de categorías o monedas.");
            }
        };

        cargarDatos();
    }, [show]);


    if (!show) return null;


    const manejarCerrar = () => {
        if (estaGuardando) return;

        setMensajeError("");
        setIdCategoria("");
        setIdMoneda("");
        setMonto("");
        setFecha("");
        setDescripcion("");

        onClose();
    };


    const manejarSubmit = async (evento) => {
        evento.preventDefault();

        if (!idCategoria || !idMoneda || !monto || !fecha) {
            setMensajeError("Por favor completa todos los campos obligatorios.");
            return;
        }

        try {
            setEstaGuardando(true);
            setMensajeError("");

            const datosAEnviar = {
                id_categoria: idCategoria,
                id_moneda: idMoneda,
                monto: monto,
                fecha: fecha,
                descripcion: descripcion
            };

            console.log("📤 Enviando ingreso:", datosAEnviar);

            const respuesta = await crearIngreso(datosAEnviar);
            console.log("📥 Respuesta backend:", respuesta.data);

            if (onCreated) await onCreated();

            manejarCerrar();

        } catch (error) {
            console.error("❌ Error creando ingreso:", error);

            // LOG MEGA DETALLADO
            console.log("🎯 ERROR EXACTO DEL BACKEND:", error.response?.data);
            console.log("🔥 RESPUESTA BACKEND COMPLETA:", JSON.stringify(error.response?.data));

            let mensaje =
                error.response?.data?.detail ||
                JSON.stringify(error.response?.data) ||
                "No se pudo guardar el ingreso.";

            setMensajeError(mensaje);
        } finally {
            setEstaGuardando(false);
        }
    };


    return (
        <div className="income-modal-overlay">
            <div className="income-modal">

                <header className="income-modal-header">
                    <h3 className="income-modal-title">Agregar ingreso</h3>

                    <button
                        type="button"
                        className="income-modal-close"
                        onClick={manejarCerrar}
                    >
                        ✕
                    </button>
                </header>

                <form className="income-form" onSubmit={manejarSubmit}>
                    <div className="income-modal-body">

                        {mensajeError && (
                            <div className="income-form-error">{mensajeError}</div>
                        )}

                        <div className="income-form-row">
                            <label className="income-form-label">
                                Categoría <span className="income-required">*</span>
                            </label>

                            <select
                                className="income-form-select"
                                value={idCategoria}
                                onChange={(e) => setIdCategoria(e.target.value)}
                            >
                                <option value="">Seleccione</option>

                                {listaCategorias.map((categoria) => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="income-form-row">
                            <label className="income-form-label">
                                Moneda <span className="income-required">*</span>
                            </label>

                            <select
                                className="income-form-select"
                                value={idMoneda}
                                onChange={(e) => setIdMoneda(e.target.value)}
                            >
                                <option value="">Seleccione</option>

                                {listaMonedas.map((moneda) => (
                                    <option key={moneda.id_moneda} value={moneda.id_moneda}>
                                        {moneda.nombre_moneda}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="income-form-row income-form-row-inline">
                            <div>
                                <label className="income-form-label">
                                    Monto <span className="income-required">*</span>
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    className="income-form-input"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="Ej: 250000"
                                />
                            </div>

                            <div>
                                <label className="income-form-label">
                                    Fecha <span className="income-required">*</span>
                                </label>

                                <input
                                    type="date"
                                    className="income-form-input"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="income-form-row">
                            <label className="income-form-label">
                                Descripción
                            </label>

                            <textarea
                                className="income-form-textarea"
                                rows="3"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Ej: salario, freelance, servicios, etc."
                            />
                        </div>
                    </div>

                    <footer className="income-modal-footer">
                        <button
                            type="button"
                            className="income-secondary-button"
                            onClick={manejarCerrar}
                            disabled={estaGuardando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="income-primary-button"
                            disabled={estaGuardando}
                        >
                            {estaGuardando ? "Guardando..." : "Guardar ingreso"}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
