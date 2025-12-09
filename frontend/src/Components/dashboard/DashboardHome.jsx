// frontend/src/Components/dashboard/DashboardHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Wallet, TrendingUp, TrendingDown, CalendarClock } from "lucide-react";
import { obtenerGastos } from "../../services/gastos";
import { obtenerIngresos } from "../../services/ingresos";
import { obtenerSuscripciones } from "../../services/suscripciones";
import API from "../../services/api";
import "../../styles/dashboard.css";

const COLORS = [
  "#6366F1",
  "#EC4899",
  "#22C55E",
  "#F97316",
  "#06B6D4",
  "#A855F7",
  "#EAB308",
];

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resumen, setResumen] = useState({
    saldoActual: 0,
    ingresosMes: 0,
    gastosMes: 0,
    suscripcionesActivas: 0,
  });

  const [gastosMes, setGastosMes] = useState([]);
  const [inversionMes, setIngresosMes] = useState([]); // nombre interno, no se muestra
  const [ingresosMes, setIngresosMesState] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const [gastosRes, ingresosRes, categoriasRes, suscripcionesRes] =
          await Promise.all([
            obtenerGastos(),
            obtenerIngresos(),
            API.get("categorias/"),
            obtenerSuscripciones(),
          ]);

        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anioActual = hoy.getFullYear();

        const esDelMesActual = (fechaStr) => {
          if (!fechaStr) return false;
          const fecha = new Date(fechaStr);
          return (
            fecha.getMonth() + 1 === mesActual &&
            fecha.getFullYear() === anioActual
          );
        };

        const gastosTodos = gastosRes.data || [];
        const ingresosTodos = ingresosRes.data || [];
        const categoriasTodas = categoriasRes.data || [];
        const suscripcionesTodas = suscripcionesRes.data || [];

        const gastosFiltrados = gastosTodos.filter((g) =>
          esDelMesActual(g.fecha)
        );
        const ingresosFiltrados = ingresosTodos.filter((i) =>
          esDelMesActual(i.fecha)
        );

        const totalGastosMes = gastosFiltrados.reduce(
          (acc, g) => acc + Number(g.monto || 0),
          0
        );
        const totalIngresosMes = ingresosFiltrados.reduce(
          (acc, i) => acc + Number(i.monto || 0),
          0
        );
        const saldoActual = totalIngresosMes - totalGastosMes;

        const suscripcionesActivas = suscripcionesTodas.filter(
          (s) => s.estado === true
        ).length;

        setResumen({
          saldoActual,
          ingresosMes: totalIngresosMes,
          gastosMes: totalGastosMes,
          suscripcionesActivas,
        });

        setGastosMes(gastosFiltrados);
        setIngresosMes(ingresosFiltrados);
        setIngresosMesState(ingresosFiltrados);
        setCategorias(categoriasTodas);
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setError(
          "No se pudieron cargar los datos del resumen. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // --- Helper para formatear moneda ---
  const formatoMoneda = (valor) => {
    const numero = Number(valor || 0);
    if (Number.isNaN(numero)) return "₡0";
    return numero.toLocaleString("es-CR", {
      style: "currency",
      currency: "CRC",
      minimumFractionDigits: 0,
    });
  };

  // --- Datos para "Gastos por categoría" ---
  const gastosPorCategoria = useMemo(() => {
    if (!gastosMes.length || !categorias.length) return [];

    const mapaCategorias = new Map(
      categorias.map((c) => [c.id_categoria, c])
    );

    const acumulado = {};

    gastosMes.forEach((g) => {
      const categoria = mapaCategorias.get(g.id_categoria);
      const nombre = categoria?.nombre_categoria || "Sin categoría";
      acumulado[nombre] = (acumulado[nombre] || 0) + Number(g.monto || 0);
    });

    return Object.entries(acumulado).map(([name, value]) => ({
      name,
      value,
    }));
  }, [gastosMes, categorias]);

  // --- Datos para "Comparación por categoría" ---
  const comparacionPorCategoria = useMemo(() => {
    if ((!gastosMes.length && !ingresosMes.length) || !categorias.length)
      return [];

    const mapaCategorias = new Map(
      categorias.map((c) => [c.id_categoria, c])
    );

    const gastosAcumulados = {};
    const ingresosAcumulados = {};

    gastosMes.forEach((g) => {
      const categoria = mapaCategorias.get(g.id_categoria);
      const nombre = categoria?.nombre_categoria || "Sin categoría";
      gastosAcumulados[nombre] =
        (gastosAcumulados[nombre] || 0) + Number(g.monto || 0);
    });

    ingresosMes.forEach((i) => {
      const categoria = mapaCategorias.get(i.id_categoria);
      const nombre = categoria?.nombre_categoria || "Sin categoría";
      ingresosAcumulados[nombre] =
        (ingresosAcumulados[nombre] || 0) + Number(i.monto || 0);
    });

    const nombresCategorias = new Set([
      ...Object.keys(gastosAcumulados),
      ...Object.keys(ingresosAcumulados),
    ]);

    return Array.from(nombresCategorias).map((nombre) => ({
      categoria: nombre,
      gastos: gastosAcumulados[nombre] || 0,
      ingresos: ingresosAcumulados[nombre] || 0,
    }));
  }, [gastosMes, ingresosMes, categorias]);

  return (
    <div>
      <h2 className="mb-3">Inicio del Dashboard</h2>
      <p className="text-muted mb-4">
        Aquí tienes un resumen de tus finanzas del mes actual.
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Tarjetas resumen (parte verde de tu imagen) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card dashboard-summary-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="dashboard-summary-icon me-3 bg-primary-subtle text-primary">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-muted mb-1 small">Saldo Actual</p>
                <h5 className="mb-0 fw-bold">
                  {formatoMoneda(resumen.saldoActual)}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card dashboard-summary-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="dashboard-summary-icon me-3 bg-success-subtle text-success">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-muted mb-1 small">Ingresos del Mes</p>
                <h5 className="mb-0 fw-bold">
                  {formatoMoneda(resumen.ingresosMes)}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card dashboard-summary-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="dashboard-summary-icon me-3 bg-danger-subtle text-danger">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-muted mb-1 small">Gastos del Mes</p>
                <h5 className="mb-0 fw-bold">
                  {formatoMoneda(resumen.gastosMes)}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card dashboard-summary-card h-100 border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="dashboard-summary-icon me-3 bg-warning-subtle text-warning">
                <CalendarClock size={24} />
              </div>
              <div>
                <p className="text-muted mb-1 small">Suscripciones Activas</p>
                <h5 className="mb-0 fw-bold">
                  {resumen.suscripcionesActivas}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de "Lo que más gastaste este mes" */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-3">
          <h5 className="card-title mb-0">Lo que más gastaste este mes</h5>
          <p className="text-muted small mb-0">
            Un vistazo rápido a tus principales categorías de gasto.
          </p>
        </div>
      </div>

      {/* Gráficos (parte roja de tu imagen) */}
      <div className="row g-3">
        {/* PieChart: Gastos por categoría */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Gastos por Categoría</h5>
              {loading ? (
                <p className="text-muted">Cargando datos...</p>
              ) : gastosPorCategoria.length === 0 ? (
                <p className="text-muted">
                  No hay datos de gastos para este mes.
                </p>
              ) : (
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        dataKey="value"
                        data={gastosPorCategoria}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {gastosPorCategoria.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatoMoneda(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BarChart: Comparación por categoría */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                Comparación por Categoría
              </h5>
              {loading ? (
                <p className="text-muted">Cargando datos...</p>
              ) : comparacionPorCategoria.length === 0 ? (
                <p className="text-muted">
                  No hay suficientes datos de ingresos y gastos para
                  comparar.
                </p>
              ) : (
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={comparacionPorCategoria}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatoMoneda(value)} />
                      <Legend />
                      <Bar dataKey="gastos" name="Gastos" />
                      <Bar dataKey="ingresos" name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
