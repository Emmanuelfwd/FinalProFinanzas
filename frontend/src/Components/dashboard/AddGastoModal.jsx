import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { crearGasto } from "../../services/gastos";

export default function AddGastoModal({ show, onClose, onCreated }) {
    const [categorias, setCategorias] = useState([]);
    const [monedas, setMonedas] = useState([]);

    const [form, setForm] = useState({
        id_categoria: "",
        id_moneda: "",
        monto: "",
        fecha: "",
        descripcion: ""
    });

    useEffect(() => {
        if (!show) return;

        API.get("categorias/")
            .then(res => setCategorias(res.data))
            .catch(() => setCategorias([]));

        API.get("tipocambio/")
            .then(res => setMonedas(res.data))
            .catch(() => setMonedas([]));
    }, [show]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            id_usuario: Number(localStorage.getItem("userId"))  // ✔ CLAVE CORRECTA
        };

        try {
            await crearGasto(payload);
            onCreated && onCreated();
            onClose && onClose();
        } catch (error) {
            console.error("Error creando gasto:", error);
            alert("Error al crear gasto. Revisa la consola del servidor.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3 className="mb-3">Registrar Gasto</h3>

                <form onSubmit={handleSubmit}>

                    <div className="mb-2">
                        <label>Categoría</label>
                        <select
                            className="form-control"
                            name="id_categoria"
                            value={form.id_categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {categorias.map(c => (
                                <option key={c.id_categoria} value={c.id_categoria}>
                                    {c.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label>Moneda</label>
                        <select
                            className="form-control"
                            name="id_moneda"
                            value={form.id_moneda}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {monedas.map(m => (
                                <option key={m.id_moneda} value={m.id_moneda}>
                                    {m.nombre_moneda}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label>Monto</label>
                        <input
                            type="number"
                            className="form-control"
                            name="monto"
                            value={form.monto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label>Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fecha"
                            value={form.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label>Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
