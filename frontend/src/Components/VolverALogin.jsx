import React from "react";
import { useNavigate } from "react-router-dom";

const VolverALogin = () => {
    const navigate = useNavigate();

    const volver = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="text-center mt-5">
            <h3>Debes iniciar sesión nuevamente</h3>
            <button onClick={volver} className="btn btn-primary mt-3">
                Volver al Login
            </button>
        </div>
    );
};

export default VolverALogin;
