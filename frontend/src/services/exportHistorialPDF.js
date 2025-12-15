import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exporta un historial de movimientos a PDF
 * @param {Array} movimientos
 * @param {String} titulo
 * @param {String} nombreArchivo
 */
export const exportHistorialPDF = ({
  movimientos = [],
  titulo = "Historial de movimientos",
  nombreArchivo = "historial_movimientos.pdf",
}) => {
  const doc = new jsPDF();

  /* ============================
     Encabezado
  ============================ */
  doc.setFontSize(16);
  doc.text(titulo, 14, 15);

  doc.setFontSize(10);
  doc.text(
    `Generado el: ${new Date().toLocaleString("es-CR")}`,
    14,
    22
  );

  /* ============================
     Tabla
  ============================ */
  const columnas = [
    { header: "Tipo", dataKey: "tipo" },
    { header: "Fecha", dataKey: "fecha" },
    { header: "Descripción", dataKey: "descripcion" },
    { header: "Monto (CRC)", dataKey: "monto" },
    { header: "Estado", dataKey: "estado" },
  ];

const filas = movimientos.map((m) => ({
  tipo: m.tipo,
  fecha: m.fecha || "-",
  descripcion: m.descripcion || "-",
  monto: (
  typeof m.monto === "number"
    ? m.monto
    : parseFloat(String(m.monto).replace(/[^0-9.]/g, ""))
).toFixed(2)
, 
  estado: m.eliminado ? "Eliminado" : "Activo",
}));


  autoTable(doc, {
    startY: 30,
    columns: columnas,
    body: filas,
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [33, 37, 41], 
      textColor: 255,
    },
  });

  /*
     Guardar
 */
  doc.save(nombreArchivo);
};
