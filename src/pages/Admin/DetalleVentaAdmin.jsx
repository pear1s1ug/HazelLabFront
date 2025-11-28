import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBoletaPorNumero } from "../../services/api";
import "./DetalleVentaAdmin.css";

export default function DetalleVentaAdmin() {
  const { numeroBoleta } = useParams();
  const navigate = useNavigate();
  const [boleta, setBoleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("🔍 Parámetro recibido:", numeroBoleta); // DEBUG

  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  useEffect(() => {
    const cargarDetalleBoleta = async () => {
      // ✅ MEJOR VALIDACIÓN
      if (!numeroBoleta || numeroBoleta === "undefined") {
        setError("Número de boleta no válido: " + numeroBoleta);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        console.log("🔍 Cargando detalle de boleta:", numeroBoleta);
        
        const response = await getBoletaPorNumero(numeroBoleta);
        console.log("✅ Detalle de boleta cargado:", response.data);
        
        if (response.data) {
          setBoleta(response.data);
        } else {
          setError("Boleta no encontrada en la respuesta");
        }
      } catch (error) {
        console.error("❌ Error al cargar detalle:", error);
        setError(`No se pudo cargar el detalle de la boleta: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalleBoleta();
  }, [numeroBoleta]);

  // ✅ FUNCIÓN MEJORADA para navegar a ventas
  const handleVerTodasVentas = () => {
    navigate("/admin/ventas");
  };

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
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Cargando detalle de la boleta {numeroBoleta}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          <h5>Error</h5>
          <p>{error}</p>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <button 
              className="btn btn-outline-primary" 
              onClick={handleVerTodasVentas}
            >
              📋 Ver todas las ventas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!boleta) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning text-center">
          <h5>Boleta no encontrada</h5>
          <p>La boleta {numeroBoleta} no existe o fue eliminada.</p>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <button 
              className="btn btn-outline-primary" 
              onClick={handleVerTodasVentas}
            >
              📋 Ver todas las ventas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button 
            className="btn btn-outline-secondary mb-2"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <h1 className="mb-0" style={{ color: "#587042" }}>
            Detalle de Boleta
          </h1>
          <p className="text-muted mb-0">Número: {boleta.numeroBoleta}</p>
        </div>
        <button 
          className="btn btn-outline-primary" 
          onClick={handleVerTodasVentas}
        >
          📋 Ver todas las ventas
        </button>
      </div>

      {/* Resto del contenido igual... */}
      <div className="row">
        {/* Información Principal */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📦 Información de la Venta</h5>
              {getEstadoBadge(boleta.estado)}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Número de Boleta:</strong> {boleta.numeroBoleta}</p>
                  <p><strong>Fecha de Emisión:</strong> {new Date(boleta.fechaEmision).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Método de Pago:</strong> {boleta.metodoPago}</p>
                  <p><strong>Método de Envío:</strong> {boleta.metodoEnvio}</p>
                  <p><strong>Subtotal:</strong> {fmt.format(boleta.subtotal || 0)}</p>
                  <p><strong>IVA (19%):</strong> {fmt.format(boleta.iva || 0)}</p>
                  <p><strong>Total:</strong> 
                    <span className="h5 ms-2" style={{ color: "#587042" }}>
                      {fmt.format(boleta.total || 0)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">💰 Resumen de Montos</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{fmt.format(boleta.subtotal || 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>IVA (19%):</span>
                <span>{fmt.format(boleta.iva || 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>{boleta.metodoEnvio === 'retiro' ? 'Gratis' : 'Incluido'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span style={{ color: "#587042" }}>{fmt.format(boleta.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}