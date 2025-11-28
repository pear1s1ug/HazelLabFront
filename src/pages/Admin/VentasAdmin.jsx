import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBoletas, getEstadisticasVentas } from "../../services/api";
import "./VentasAdmin.css";

// ✅ EXPORTACIÓN POR DEFECTO (RECOMENDADO)
export default function VentasAdmin() {
  const [boletas, setBoletas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODAS");
  const [error, setError] = useState("");

  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      console.log("🔄 Cargando datos de ventas...");
      setError("");
      
      const [boletasRes, statsRes] = await Promise.all([
        getAllBoletas(),
        getEstadisticasVentas()
      ]);
      
      // ✅ VALIDACIÓN CRÍTICA: Verificar que boletas sea un array
      if (!Array.isArray(boletasRes.data)) {
        console.error("❌ Error: boletas no es un array", boletasRes.data);
        setError("Error en el formato de datos recibidos");
        setBoletas([]);
      } else {
        console.log("✅ Boletas cargadas:", boletasRes.data.length);
        setBoletas(boletasRes.data);
      }
      
      console.log("✅ Estadísticas cargadas:", statsRes.data);
      setEstadisticas(statsRes.data || {});
      
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setError("No se pudieron cargar los datos de ventas");
      setBoletas([]);
      setEstadisticas({});
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDACIÓN: Asegurar que boletas sea array antes de filter
  const boletasFiltradas = Array.isArray(boletas) 
    ? (filtroEstado === "TODAS" 
        ? boletas 
        : boletas.filter(b => b && b.estado === filtroEstado))
    : [];

  // ✅ VALIDACIÓN: Calcular estadísticas de respaldo
  const calcularEstadisticasRespaldo = () => {
    if (!Array.isArray(boletas)) return { totalVentas: 0, ventasPagadas: 0, ventasPendientes: 0, ingresosTotales: 0 };
    
    return {
      totalVentas: boletas.length,
      ventasPagadas: boletas.filter(b => b && b.estado === "PAGADA").length,
      ventasPendientes: boletas.filter(b => b && b.estado === "PENDIENTE").length,
      ingresosTotales: boletas.reduce((sum, b) => sum + (b?.total || 0), 0)
    };
  };

  const statsRespaldo = calcularEstadisticasRespaldo();

  const getEstadoBadge = (estado) => {
    const clases = {
      PAGADA: "bg-success",
      PENDIENTE: "bg-warning", 
      ANULADA: "bg-danger"
    };
    return <span className={`badge ${clases[estado] || "bg-secondary"}`}>{estado}</span>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Cargando historial de ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <h5>Error</h5>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarDatos}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="ventas-admin-container">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Historial de Ventas</h2>
          <p className="text-muted mb-0">Gestión completa de todas las transacciones</p>
        </div>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODAS">Todas las ventas</option>
            <option value="PAGADA">Pagadas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="ANULADA">Anuladas</option>
          </select>
          <button className="btn btn-outline-primary" onClick={cargarDatos}>
            🔄 Actualizar
          </button>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stats-card bg-primary text-white">
            <div className="stats-content">
              <h3>{estadisticas.totalVentas || statsRespaldo.totalVentas}</h3>
              <p>Total Ventas</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card bg-success text-white">
            <div className="stats-content">
              <h3>{estadisticas.ventasPagadas || statsRespaldo.ventasPagadas}</h3>
              <p>Ventas Pagadas</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card bg-warning text-dark">
            <div className="stats-content">
              <h3>{fmt.format(estadisticas.ingresosTotales || statsRespaldo.ingresosTotales)}</h3>
              <p>Ingresos Totales</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card bg-info text-white">
            <div className="stats-content">
              <h3>{estadisticas.ventasPendientes || statsRespaldo.ventasPendientes}</h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>N° Boleta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Método Pago</th>
                  <th>Envío</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {boletasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      {Array.isArray(boletas) && boletas.length === 0 
                        ? "No hay ventas registradas" 
                        : "No hay ventas que coincidan con el filtro"}
                    </td>
                  </tr>
                ) : (
                  boletasFiltradas.map((boleta) => (
                    <tr key={boleta.id}>
                      <td>
                        <strong>{boleta.numeroBoleta}</strong>
                      </td>
                      <td>
                        {boleta.fechaEmision ? new Date(boleta.fechaEmision).toLocaleDateString('es-CL') : 'N/A'}
                      </td>
                      <td>
                        <div>
                          <strong>{boleta.usuario?.username || 'Cliente'}</strong>
                          <br />
                          <small className="text-muted">{boleta.usuario?.email || 'Sin email'}</small>
                        </div>
                      </td>
                      <td>{boleta.metodoPago || 'N/A'}</td>
                      <td>{boleta.metodoEnvio || 'N/A'}</td>
                      <td>{getEstadoBadge(boleta.estado)}</td>
                      <td>
                        <strong style={{ color: "#587042" }}>
                          {fmt.format(boleta.total || 0)}
                        </strong>
                      </td>
                      <td>
                        <Link 
                          to={`/admin/ventas/${boleta.numeroBoleta}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver Detalle
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}