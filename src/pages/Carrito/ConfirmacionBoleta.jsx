import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ConfirmacionBoleta() {
  const location = useLocation();
  const navigate = useNavigate();
  const [boleta, setBoleta] = useState(null);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  useEffect(() => {
    // Obtener la boleta de los parámetros de navegación
    if (location.state?.boleta) {
      setBoleta(location.state.boleta);
      setLoading(false);
    } else {
      // Si no hay boleta en el estado, redirigir al carrito
      navigate("/carrito");
    }
  }, [location, navigate]);

  if (loading) return <p className="text-center my-5">Cargando confirmación...</p>;
  if (!boleta) return <p className="text-center my-5">No se encontró la boleta.</p>;

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          {/* Tarjeta de confirmación */}
          <div className="card border-0 shadow-sm">
            <div className="card-header text-center py-4" style={{ backgroundColor: "#587042", color: "white" }}>
              <h1 className="h3 mb-2">¡Compra Realizada con Éxito!</h1>
              <p className="mb-0">Gracias por tu compra en Hazel Lab</p>
            </div>
            
            <div className="card-body p-4">
              {/* Encabezado de la boleta */}
              <div className="row mb-4">
                <div className="col-6">
                  <h5 className="fw-bold" style={{ color: "#587042" }}>Hazel Lab</h5>
                  <p className="mb-1">Laboratorio de productos naturales</p>
                  <p className="mb-1">contacto@hazellab.cl</p>
                </div>
                <div className="col-6 text-end">
                  <h5 className="fw-bold">BOLETA</h5>
                  <p className="mb-1"><strong>N°: {boleta.numeroBoleta}</strong></p>
                  <p className="mb-1">Fecha: {new Date(boleta.fechaEmision).toLocaleDateString('es-CL')}</p>
                  <p className="mb-0">Hora: {new Date(boleta.fechaEmision).toLocaleTimeString('es-CL')}</p>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="row mb-4 p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div className="col-12">
                  <h6 className="fw-bold mb-2">Información del Cliente</h6>
                  <p className="mb-1"><strong>Nombre:</strong> {usuario?.username || 'Cliente'}</p>
                  <p className="mb-1"><strong>Email:</strong> {usuario?.email || 'No especificado'}</p>
                  <p className="mb-0"><strong>Método de pago:</strong> {boleta.metodoPago}</p>
                  <p className="mb-0"><strong>Método de envío:</strong> {boleta.metodoEnvio}</p>
                </div>
              </div>

              {/* Detalles de los productos */}
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead style={{ backgroundColor: "#DAD7CD" }}>
                    <tr>
                      <th width="50%">Producto</th>
                      <th width="15%" className="text-center">Cantidad</th>
                      <th width="15%" className="text-end">P. Unitario</th>
                      <th width="20%" className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boleta.detalles && boleta.detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>{detalle.producto?.name || "Producto"}</td>
                        <td className="text-center">{detalle.cantidad}</td>
                        <td className="text-end">{fmt.format(detalle.precioUnitario)}</td>
                        <td className="text-end">{fmt.format(detalle.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen de montos */}
              <div className="row justify-content-end">
                <div className="col-md-6">
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{fmt.format(boleta.subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>IVA (19%):</span>
                      <span>{fmt.format(boleta.iva)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Costo de envío:</span>
                      <span>
                        {boleta.metodoEnvio === "retiro" ? "Gratis" : 
                         boleta.metodoEnvio === "estandar" ? fmt.format(3990) : 
                         boleta.metodoEnvio === "express" ? fmt.format(6990) : "Gratis"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-2 pt-2 border-top">
                      <span>TOTAL:</span>
                      <span style={{ color: "#587042" }}>{fmt.format(boleta.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-light border" role="alert">
                    <h6 className="alert-heading fw-bold">Información importante:</h6>
                    <ul className="mb-0 small">
                      <li>Guarde este número de boleta para cualquier consulta: <strong>{boleta.numeroBoleta}</strong></li>
                      <li>El tiempo de envío es de 3-5 días hábiles para envío estándar</li>
                      <li>Para retiro en tienda, presente este comprobante</li>
                      <li>Ante cualquier problema, contacte a: contacto@hazellab.cl</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="row mt-4">
                <div className="col-12 text-center">
                  <button 
                    className="btn me-3"
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: "#8C9A6C",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    📄 Imprimir Boleta
                  </button>
                  <Link 
                    to="/productos" 
                    className="btn me-3"
                    style={{
                      backgroundColor: "#DAD7CD",
                      color: "#587042",
                      fontWeight: "500",
                    }}
                  >
                    🛒 Seguir Comprando
                  </Link>
                  <Link 
                    to="/" 
                    className="btn"
                    style={{
                      backgroundColor: "#587042",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    🏠 Ir al Inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}