// frontend/src/Components/dashboard/DashboardHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  FileText,
} from "lucide-react";
import { exportHistorialPDF } from "../../services/exportHistorialPDF";

const COLORS = [
  "#0d6efd",
  "#dc3545",
  "#198754",
  "#ffc107",
  "#6f42c1",
  "#20c997",
];

const DashboardHome = () => {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selector de periodo
  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  /* =========================================================
     Fetch principal
  ========================================================= */
  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        const [
          gastosRes,
          ingresosRes,
          susRes,
          catRes,
          monRes,
        ] = await Promise.all([
          API.get(`gastos/?usuario=${userId}`),
          API.get(`ingresos/?usuario=${userId}`),
          API.get(`suscripciones/?usuario=${userId}`),
          API.get("categorias/"),
          API.get("tipocambio/"),
        ]);

        setGastos(Array.isArray(gastosRes.data) ? gastosRes.data : []);
        setIngresos(Array.isArray(ingresosRes.data) ? ingresosRes.data : []);
        setSuscripciones(Array.isArray(susRes.data) ? susRes.data : []);
        setCategorias(Array.isArray(catRes.data) ? catRes.data : []);
        setMonedas(Array.isArray(monRes.data) ? monRes.data : []);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        setGastos([]);
        setIngresos([]);
        setSuscripciones([]);
        setCategorias([]);
        setMonedas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  /* =========================================================
     Helpers
  ========================================================= */
  const categoriaNombrePorId = useMemo(() => {
    const map = {};
    categorias.forEach((c) => {
      map[c.id_categoria] = c.nombre_categoria;
    });
    return map;
  }, [categorias]);

  const monedaPorId = useMemo(() => {
    const map = {};
    monedas.forEach((m) => {
      map[m.id_moneda] = {
        nombre: m.nombre_moneda,
        tasa: parseFloat(m.tasa_cambio),
      };
    });
    return map;
  }, [monedas]);

  const esDelPeriodo = (fechaStr) => {
    if (!fechaStr) return false;
    const f = new Date(String(fechaStr).slice(0, 10) + "T00:00:00");
    if (Number.isNaN(f.getTime())) return false;
    return (
      f.getMonth() === mesSeleccionado &&
      f.getFullYear() === anioSeleccionado
    );
  };

  const finDeMesSeleccionado = useMemo(
    () => new Date(anioSeleccionado, mesSeleccionado + 1, 0, 23, 59, 59),
    [anioSeleccionado, mesSeleccionado]
  );

  const aCRC = (monto, idMoneda) => {
    const m = Number(monto || 0);
    if (Number.isNaN(m)) return 0;
    const info = monedaPorId[idMoneda];
    const tasa = info?.tasa;
    if (!tasa || Number.isNaN(tasa)) return m;
    return m * tasa;
  };

  const formatearCRC = (valor) => {
    const numero = Number(valor || 0);
    if (Number.isNaN(numero)) return "₡0";
    return numero.toLocaleString("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    });
  };

  /* =========================================================
     Filtrado por periodo
  ========================================================= */
  const gastosMes = useMemo(
    () => gastos.filter((g) => esDelPeriodo(g.fecha)),
    [gastos, mesSeleccionado, anioSeleccionado]
  );

  const ingresosMes = useMemo(
    () => ingresos.filter((i) => esDelPeriodo(i.fecha)),
    [ingresos, mesSeleccionado, anioSeleccionado]
  );

  const suscripcionesPeriodo = useMemo(() => {
    return suscripciones.filter((s) => {
      if (s.estado !== true) return false;
      if (!s.fecha_inicio) return true;
      const fi = new Date(String(s.fecha_inicio).slice(0, 10) + "T00:00:00");
      if (Number.isNaN(fi.getTime())) return true;
      return fi <= finDeMesSeleccionado;
    });
  }, [suscripciones, finDeMesSeleccionado]);

  const totalSuscripcionesMesCRC = useMemo(
    () =>
      suscripcionesPeriodo.reduce(
        (acc, s) => acc + aCRC(s.monto_mensual, s.id_moneda),
        0
      ),
    [suscripcionesPeriodo, monedaPorId]
  );

  const totalGastosMesCRC = useMemo(() => {
    const gastosNormales = gastosMes.reduce(
      (acc, g) => acc + aCRC(g.monto, g.id_moneda),
      0
    );
    return gastosNormales + totalSuscripcionesMesCRC;
  }, [gastosMes, monedaPorId, totalSuscripcionesMesCRC]);

  const totalIngresosMesCRC = useMemo(
    () => ingresosMes.reduce((acc, i) => acc + aCRC(i.monto, i.id_moneda), 0),
    [ingresosMes, monedaPorId]
  );

  const saldoMesCRC = totalIngresosMesCRC - totalGastosMesCRC;

  const suscripcionesActivas = useMemo(
    () => suscripcionesPeriodo.length,
    [suscripcionesPeriodo]
  );

  /* =========================================================
     Exportar PDF (HISTORIAL COMPLETO)
  ========================================================= */
  const exportarPDF = () => {
    const movimientos = [
      ...gastos.map((g) => ({
        tipo: "Gasto",
        fecha: g.fecha,
        descripcion:
          categoriaNombrePorId[g.id_categoria] || "Gasto",
        monto: formatearCRC(aCRC(g.monto, g.id_moneda)),
        eliminado: g.eliminado,
      })),
      ...ingresos.map((i) => ({
        tipo: "Ingreso",
        fecha: i.fecha,
        descripcion:
          categoriaNombrePorId[i.id_categoria] || "Ingreso",
        monto: formatearCRC(aCRC(i.monto, i.id_moneda)),
        eliminado: i.eliminado,
      })),
      ...suscripciones.map((s) => ({
        tipo: "Suscripción",
        fecha: s.fecha_inicio,
        descripcion: s.nombre_servicio,
        monto: formatearCRC(aCRC(s.monto_mensual, s.id_moneda)),
        eliminado: s.eliminado,
      })),
    ];

    exportHistorialPDF({
      movimientos,
      titulo: "Historial completo de movimientos",
      nombreArchivo: "historial_dashboard.pdf",
    });
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>Inicio del Dashboard</h2>

        <button className="btn btn-outline-dark" onClick={exportarPDF}>
          <FileText size={16} className="me-1" />
          Exportar PDF
        </button>
      </div>

      <p>Aquí tienes un resumen de tus finanzas del mes seleccionado.</p>

      {/* Selector mes/año */}
      <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
        <div>
          <label className="form-label mb-1">Mes</label>
          <select
            className="form-select"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
          >
            {meses.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label mb-1">Año</label>
          <input
            type="number"
            className="form-control"
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
          />
        </div>

        <div className="ms-auto text-muted" style={{ paddingTop: 28 }}>
          Mostrando: <strong>{meses[mesSeleccionado]} {anioSeleccionado}</strong>
        </div>
      </div>

      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-primary">
              <Wallet size={22} />
            </div>
            <div>
              <strong>Saldo Actual</strong>
              <div style={{ fontSize: 22 }}>
                {loading ? "..." : formatearCRC(saldoMesCRC)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-success">
              <TrendingUp size={22} />
            </div>
            <div>
              <strong>Ingresos del Mes</strong>
              <div style={{ fontSize: 22 }}>
                {loading ? "..." : formatearCRC(totalIngresosMesCRC)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-danger">
              <TrendingDown size={22} />
            </div>
            <div>
              <strong>Gastos del Mes</strong>
              <div style={{ fontSize: 22 }}>
                {loading ? "..." : formatearCRC(totalGastosMesCRC)}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Incluye suscripciones activas
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-warning">
              <CalendarClock size={22} />
            </div>
            <div>
              <strong>Suscripciones Activas</strong>
              <div style={{ fontSize: 22 }}>
                {loading ? "..." : suscripcionesActivas}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Total: {loading ? "..." : formatearCRC(totalSuscripcionesMesCRC)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Gastos por Categoría</h5>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      gastosMes.reduce((acc, g) => {
                        const n =
                          categoriaNombrePorId[g.id_categoria] ||
                          "Sin categoría";
                        acc[n] = (acc[n] || 0) + aCRC(g.monto, g.id_moneda);
                        return acc;
                      }, {})
                    ).map(([name, value]) => ({
                      name,
                      value: Math.round(value),
                    }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {Object.entries(
                      gastosMes.reduce((acc, g) => {
                        const n =
                          categoriaNombrePorId[g.id_categoria] ||
                          "Sin categoría";
                        acc[n] = (acc[n] || 0) + aCRC(g.monto, g.id_moneda);
                        return acc;
                      }, {})
                    ).map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Comparación por Categoría</h5>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart
                  data={Object.values(
                    [...gastosMes, ...ingresosMes].reduce((acc, x) => {
                      const n =
                        categoriaNombrePorId[x.id_categoria] ||
                        "Sin categoría";
                      acc[n] = acc[n] || {
                        categoria: n,
                        gastos: 0,
                        ingresos: 0,
                      };
                      if (x.monto && x.id_gasto) {
                        acc[n].gastos += aCRC(x.monto, x.id_moneda);
                      } else {
                        acc[n].ingresos += aCRC(x.monto, x.id_moneda);
                      }
                      return acc;
                    }, {})
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#198754" />
                  <Bar dataKey="gastos" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
