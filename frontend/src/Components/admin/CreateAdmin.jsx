import { useState } from "react";
import { crearAdmin } from "../../services/admin";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
  });
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      await crearAdmin(form);
      setMsg({ type: "success", text: "Administrador creado correctamente" });
      setForm({ nombre: "", correo: "", password: "" });
    } catch {
      setMsg({ type: "danger", text: "Error creando administrador" });
    }
  };

  return (
    <div style={{ maxWidth: "480px" }}>
      <h3 className="mb-3">Crear Administrador</h3>

      {msg && (
        <div className={`alert alert-${msg.type}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          className="form-control"
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          type="email"
          className="form-control"
          placeholder="Correo"
          name="correo"
          value={form.correo}
          onChange={handleChange}
        />

        <input
          type="password"
          className="form-control"
          placeholder="Contraseña"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary">
          Crear Admin
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
