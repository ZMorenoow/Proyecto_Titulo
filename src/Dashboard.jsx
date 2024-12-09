import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  const [kpis, setKpis] = useState({});
  const [reservasEstado, setReservasEstado] = useState([]);
  const [pagosMes, setPagosMes] = useState([]);
  const [serviciosSolicitados, setServiciosSolicitados] = useState([]);
  const [comentariosRecientes, setComentariosRecientes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          kpisRes,
          reservasEstadoRes,
          pagosMesRes,
          serviciosRes,
          comentariosRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/dashboard/kpis"),
          axios.get("http://localhost:3000/api/dashboard/reservas-estado"),
          axios.get("http://localhost:3000/api/dashboard/pagos-mes"),
          axios.get("http://localhost:3000/api/dashboard/servicios-solicitados"),
          axios.get("http://localhost:3000/api/dashboard/comentarios"),
        ]);

        setKpis(kpisRes.data);
        setReservasEstado(reservasEstadoRes.data);
        setPagosMes(pagosMesRes.data);
        setServiciosSolicitados(serviciosRes.data);
        setComentariosRecientes(comentariosRes.data);
      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="dashboard-container">
      <button className="back-button" onClick={handleBack}>
        ← Volver
      </button>
      <h1 className="dashboard-title">Dashboard Administrativo</h1>

      {/* KPIs */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Ingresos Totales</h3>
          <p>${kpis.ingresosTotales || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Total Reservas</h3>
          <p>{kpis.totalReservas || 0}</p>
        </div>
        <div className="kpi-card">
          <h3>Tasa de Cancelación</h3>
          <p>{kpis.tasaCancelacion || 0}%</p>
        </div>
        <div className="kpi-card">
          <h3>Valoraciones Promedio</h3>
          <p>{kpis.valoracionesPromedio || 0}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="chart-container">
        <div className="chart-card">
          <h2>Reservas por Estado</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={reservasEstado}
              dataKey="total"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {reservasEstado.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"][index % 5]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="chart-card">
          <h2>Pagos por Mes</h2>
          <LineChart
            width={500}
            height={300}
            data={pagosMes}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickFormatter={(value) => {
                const date = new Date(value);
                return new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                  year: "numeric",
                }).format(date);
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          </LineChart>
        </div>

        <div className="chart-card">
          <h2>Servicios Más Solicitados</h2>
          <BarChart
            width={500}
            height={300}
            data={serviciosSolicitados}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="servicio" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Comentarios Recientes */}
      <div className="comments-container">
        <h2>Comentarios Recientes</h2>
        <ul>
          {comentariosRecientes.map((comentario, index) => (
            <li key={index}>
              <p>
                <strong>{comentario.cliente}:</strong> {comentario.texto}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
