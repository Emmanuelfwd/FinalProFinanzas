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
import { Wallet, TrendingUp, TrendingDown, CalendarClock } from "lucide-react";

const COLORS = ["#0d6efd", "#dc3545", "#198754", "#ffc107", "#6f42c1", "#20c997"];

const DashboardHome = () => {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selector de periodo (por defecto: mes/año actual)
  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth()); // 0-11
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  /* =========================================================
     Fetch principal (usa tu API real: ids en FK + tipocambio)
  ========================================================= */
  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        const [gastosRes, ingresosRes, susRes, catRes, monRes] = await Promise.all([
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
     Helpers: maps y conversión a CRC
  ========================================================= */
  const categoriaNombrePorId = useMemo(() => {
    const map = {};
    categorias.forEach((c) => {
      map[c.id_categoria] = c.nombre_categoria;
    });
    return map;
  }, [categorias]);

  const monedaPorId = useMemo(() => {
    // id_moneda -> { nombre_moneda, tasa_cambio }
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
    // Normalizamos YYYY-MM-DD
    const f = new Date(String(fechaStr).slice(0, 10) + "T00:00:00");
    if (Number.isNaN(f.getTime())) return false;
    return f.getMonth() === mesSeleccionado && f.getFullYear() === anioSeleccionado;
  };

  const finDeMesSeleccionado = useMemo(() => {
    // Último día del mes seleccionado: new Date(año, mes+1, 0)
    return new Date(anioSeleccionado, mesSeleccionado + 1, 0, 23, 59, 59);
  }, [anioSeleccionado, mesSeleccionado]);

  const aCRC = (monto, idMoneda) => {
    const m = Number(monto || 0);
    if (Number.isNaN(m)) return 0;

    // Si no hay moneda o no hay tasa, asumimos 1 (útil si CRC está en BD con tasa 1)
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
     Filtrados por periodo (mes/año) + KPIs con conversión
  ========================================================= */
  const gastosMes = useMemo(
    () => gastos.filter((g) => esDelPeriodo(g.fecha)),
    [gastos, mesSeleccionado, anioSeleccionado]
  );

  const ingresosMes = useMemo(
    () => ingresos.filter((i) => esDelPeriodo(i.fecha)),
    [ingresos, mesSeleccionado, anioSeleccionado]
  );

  // Suscripciones que aplican al mes seleccionado:
  // - activas
  // - fecha_inicio <= fin de mes seleccionado
  const suscripcionesPeriodo = useMemo(() => {
    return suscripciones.filter((s) => {
      if (s.estado !== true) return false;
      if (!s.fecha_inicio) return true;

      const fi = new Date(String(s.fecha_inicio).slice(0, 10) + "T00:00:00");
      if (Number.isNaN(fi.getTime())) return true;

      return fi <= finDeMesSeleccionado;
    });
  }, [suscripciones, finDeMesSeleccionado]);

  const totalSuscripcionesMesCRC = useMemo(() => {
    return suscripcionesPeriodo.reduce(
      (acc, s) => acc + aCRC(s.monto_mensual, s.id_moneda),
      0
    );
  }, [suscripcionesPeriodo, monedaPorId]);

  const totalGastosMesCRC = useMemo(() => {
    const gastosNormales = gastosMes.reduce(
      (acc, g) => acc + aCRC(g.monto, g.id_moneda),
      0
    );
    // ✅ IMPORTANTE: gastos del mes incluye suscripciones
    return gastosNormales + totalSuscripcionesMesCRC;
  }, [gastosMes, monedaPorId, totalSuscripcionesMesCRC]);

  const totalIngresosMesCRC = useMemo(
    () => ingresosMes.reduce((acc, i) => acc + aCRC(i.monto, i.id_moneda), 0),
    [ingresosMes, monedaPorId]
  );

  const saldoMesCRC = totalIngresosMesCRC - totalGastosMesCRC;

  const suscripcionesActivas = useMemo(() => {
    // ✅ Cuenta activas que aplican al mes seleccionado
    return suscripcionesPeriodo.length;
  }, [suscripcionesPeriodo]);

  /* =========================================================
     Gráfica: Gastos por categoría (Pie)
     ✅ Incluye una categoría "Suscripciones"
  ========================================================= */
  const dataGastosPorCategoria = useMemo(() => {
    const map = {};

    gastosMes.forEach((g) => {
      const idCat = g.id_categoria;
      const nombre = categoriaNombrePorId[idCat] || "Sin categoría";
      map[nombre] = (map[nombre] || 0) + aCRC(g.monto, g.id_moneda);
    });

    if (totalSuscripcionesMesCRC > 0) {
      map["Suscripciones"] = (map["Suscripciones"] || 0) + totalSuscripcionesMesCRC;
    }

    return Object.entries(map).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [gastosMes, categoriaNombrePorId, monedaPorId, totalSuscripcionesMesCRC]);

  /* =========================================================
     Gráfica: Comparación por categoría (Bar)
     ✅ Gastos incluye "Suscripciones"
  ========================================================= */
  const dataComparacion = useMemo(() => {
    const map = {};

    gastosMes.forEach((g) => {
      const nombre = categoriaNombrePorId[g.id_categoria] || "Sin categoría";
      map[nombre] = map[nombre] || { categoria: nombre, gastos: 0, ingresos: 0 };
      map[nombre].gastos += aCRC(g.monto, g.id_moneda);
    });

    // ✅ sumar suscripciones a "Suscripciones" como gasto
    if (totalSuscripcionesMesCRC > 0) {
      const nombre = "Suscripciones";
      map[nombre] = map[nombre] || { categoria: nombre, gastos: 0, ingresos: 0 };
      map[nombre].gastos += totalSuscripcionesMesCRC;
    }

    ingresosMes.forEach((i) => {
      const nombre = categoriaNombrePorId[i.id_categoria] || "Sin categoría";
      map[nombre] = map[nombre] || { categoria: nombre, gastos: 0, ingresos: 0 };
      map[nombre].ingresos += aCRC(i.monto, i.id_moneda);
    });

    return Object.values(map).map((x) => ({
      ...x,
      gastos: Math.round(x.gastos),
      ingresos: Math.round(x.ingresos),
    }));
  }, [gastosMes, ingresosMes, categoriaNombrePorId, monedaPorId, totalSuscripcionesMesCRC]);

  return (
    <div className="p-3">
      <h2>Inicio del Dashboard</h2>
      <p>Aquí tienes un resumen de tus finanzas del mes seleccionado.</p>

      {/* Selector de mes/año */}
      <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
        <div>
          <label className="form-label mb-1">Mes</label>
          <select
            className="form-select"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
          >
            {meses.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
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

      {/* Cards (mantén tus clases existentes) */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-primary">
              <Wallet size={22} />
            </div>
            <div>
              <div><strong>Saldo Actual</strong></div>
              <div style={{ fontSize: 22 }}>{loading ? "..." : formatearCRC(saldoMesCRC)}</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-success">
              <TrendingUp size={22} />
            </div>
            <div>
              <div><strong>Ingresos del Mes</strong></div>
              <div style={{ fontSize: 22 }}>{loading ? "..." : formatearCRC(totalIngresosMesCRC)}</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-danger">
              <TrendingDown size={22} />
            </div>
            <div>
              <div><strong>Gastos del Mes</strong></div>
              <div style={{ fontSize: 22 }}>{loading ? "..." : formatearCRC(totalGastosMesCRC)}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Incluye suscripciones activas</div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-warning">
              <CalendarClock size={22} />
            </div>
            <div>
              <div><strong>Suscripciones Activas</strong></div>
              <div style={{ fontSize: 22 }}>{loading ? "..." : suscripcionesActivas}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Total: {loading ? "..." : formatearCRC(totalSuscripcionesMesCRC)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de gráficas */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Gastos por Categoría</h5>
            <div className="text-muted mb-3">Conversión aplicada a CRC según TipoCambio.</div>

            {loading ? (
              <div className="text-muted">Cargando...</div>
            ) : dataGastosPorCategoria.length === 0 ? (
              <div className="text-muted">No hay datos de gastos para este periodo.</div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={dataGastosPorCategoria}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {dataGastosPorCategoria.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Comparación por Categoría</h5>
            <div className="text-muted mb-3">Ingresos vs Gastos (CRC) en el periodo.</div>

            {loading ? (
              <div className="text-muted">Cargando...</div>
            ) : dataComparacion.length === 0 ? (
              <div className="text-muted">No hay suficientes datos para comparar en este periodo.</div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={dataComparacion}>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
