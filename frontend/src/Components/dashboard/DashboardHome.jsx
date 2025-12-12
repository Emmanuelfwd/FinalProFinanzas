import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Wallet, TrendingUp, TrendingDown, CalendarCheck } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ===============================
   TIPOS DE CAMBIO (DEFAULT)
   Puedes ajustarlos cuando quieras
================================ */
const TIPOS_CAMBIO_DEFAULT = {
  USD: 530,
  EUR: 580,
};

const COLORS = ["#0d6efd", "#dc3545", "#198754", "#ffc107", "#6f42c1"];

const DashboardHome = () => {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);

  const hoy = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear());

  /* ===============================
     CARGA DE DATOS (SIN TIPO-CAMBIO)
  =============================== */
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [gastosRes, ingresosRes, susRes] = await Promise.all([
          api.get("gastos/"),
          api.get("ingresos/"),
          api.get("suscripciones/"),
        ]);

        setGastos(Array.isArray(gastosRes.data) ? gastosRes.data : []);

        const ingresosData =
          ingresosRes.data?.results ??
          ingresosRes.data?.ingresos ??
          ingresosRes.data ??
          [];
        setIngresos(Array.isArray(ingresosData) ? ingresosData : []);

        setSuscripciones(Array.isArray(susRes.data) ? susRes.data : []);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };

    cargarTodo();
  }, []);

  /* ===============================
     HELPERS FINANCIEROS
  =============================== */

  const convertirAColones = (monto, moneda) => {
    const m = Number(monto);
    if (Number.isNaN(m)) return 0;
    if (!moneda || moneda === "CRC") return m;

    const tipo = TIPOS_CAMBIO_DEFAULT[moneda];
    return tipo ? m * tipo : m;
  };

  const perteneceAlPeriodo = (fecha) => {
    if (!fecha) return false;
    const f = new Date(String(fecha).slice(0, 10) + "T00:00:00");
    return (
      f.getMonth() === mesSeleccionado &&
      f.getFullYear() === anioSeleccionado
    );
  };

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ];

  /* ===============================
     DATOS FILTRADOS
  =============================== */

  const gastosPeriodo = gastos.filter((g) => perteneceAlPeriodo(g.fecha));
  const ingresosPeriodo = ingresos.filter((i) => perteneceAlPeriodo(i.fecha));

  /* ===============================
     KPIs
  =============================== */

  const totalGastos = useMemo(
    () =>
      gastosPeriodo.reduce(
        (acc, g) => acc + convertirAColones(g.monto, g.moneda),
        0
      ),
    [gastosPeriodo]
  );

  const totalIngresos = useMemo(
    () =>
      ingresosPeriodo.reduce(
        (acc, i) => acc + convertirAColones(i.monto, i.moneda),
        0
      ),
    [ingresosPeriodo]
  );

  const saldoActual = totalIngresos - totalGastos;

  const suscripcionesActivas = suscripciones.filter(
    (s) => s.estado === true
  ).length;

  /* ===============================
     GRÁFICAS
  =============================== */

  const gastosPorCategoria = useMemo(() => {
    const map = {};
    gastosPeriodo.forEach((g) => {
      const cat = g.categoria_nombre || "Sin categoría";
      map[cat] =
        (map[cat] || 0) + convertirAColones(g.monto, g.moneda);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [gastosPeriodo]);

  const comparacionCategorias = useMemo(() => {
    const map = {};

    gastosPeriodo.forEach((g) => {
      const cat = g.categoria_nombre || "Sin categoría";
      map[cat] = map[cat] || { categoria: cat, gastos: 0, ingresos: 0 };
      map[cat].gastos += convertirAColones(g.monto, g.moneda);
    });

    ingresosPeriodo.forEach((i) => {
      const cat = i.categoria_nombre || "Sin categoría";
      map[cat] = map[cat] || { categoria: cat, gastos: 0, ingresos: 0 };
      map[cat].ingresos += convertirAColones(i.monto, i.moneda);
    });

    return Object.values(map);
  }, [gastosPeriodo, ingresosPeriodo]);

  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-3">
      <h3>Inicio del Dashboard</h3>
      <p>Resumen financiero del mes seleccionado.</p>

      {/* Selector de periodo */}
      <div className="d-flex gap-2 mb-3 align-items-end">
        <div>
          <label className="form-label">Mes</label>
          <select
            className="form-select"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
          >
            {meses.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Año</label>
          <input
            type="number"
            className="form-control"
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
          />
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
              <h6>Saldo</h6>
              <h4>₡{saldoActual.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-success">
              <TrendingUp size={22} />
            </div>
            <div>
              <h6>Ingresos</h6>
              <h4>₡{totalIngresos.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-danger">
              <TrendingDown size={22} />
            </div>
            <div>
              <h6>Gastos</h6>
              <h4>₡{totalGastos.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-icon bg-warning">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h6>Suscripciones Activas</h6>
              <h4>{suscripcionesActivas}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h6>Gastos por Categoría</h6>
            {gastosPorCategoria.length === 0 ? (
              <p className="text-muted">Sin gastos en este periodo.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={gastosPorCategoria} dataKey="value" nameKey="name">
                    {gastosPorCategoria.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h6>Comparación por Categoría</h6>
            {comparacionCategorias.length === 0 ? (
              <p className="text-muted">Sin datos suficientes.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparacionCategorias}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ingresos" fill="#198754" />
                  <Bar dataKey="gastos" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
