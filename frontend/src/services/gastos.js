import API from "./api";

export const obtenerGastos = async () => {
    const userId = localStorage.getItem("userId");
    return API.get(`/gastos/?usuario=${userId}`);
};

export const crearGasto = async (data) => {
    const userId = localStorage.getItem("userId");

    return API.post("/gastos/", {
        ...data,
        user_id: Number(userId)  
    });
};
export const eliminarGasto = async (id) => {
    return API.delete(`/gastos/${id}/`);
};

export const actualizarGasto = async (id, data) => {
    return API.put(`/gastos/${id}/`, data);
};
