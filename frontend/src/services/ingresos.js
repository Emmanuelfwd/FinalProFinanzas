
import API from "./api";


export function obtenerIngresos(idUsuario) {
    return API.get(`ingresos/?usuario=${idUsuario}`);
}

export function crearIngreso(datos) {
    return API.post("ingresos/", datos);
}


export function actualizarIngreso(idIngreso, datos) {
    return API.put(`ingresos/${idIngreso}/`, datos);
}


export function eliminarIngreso(idIngreso) {
    return API.delete(`ingresos/${idIngreso}/`);
}


export function obtenerCategoriasIngreso() {
    return API.get("categorias/?tipo=INGRESO");
}

export function obtenerMonedas() {
    return API.get("tipocambio/");
}
