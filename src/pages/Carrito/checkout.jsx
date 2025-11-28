import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getItemsCarritoPorUsuario, generarBoleta } from "../../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  // Estados del componente
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  // Estados para opciones de envío y pago
  const [metodoEnvio, setMetodoEnvio] = useState("retiro");
  const [metodoPago, setMetodoPago] = useState("");

  // Formateador de precios para moneda chilena
  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  // Obtener información del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const token = localStorage.getItem("token");

  // Cargar items del carrito desde el backend
  useEffect(() => {
    if (hasFetched.current || !usuario || !token) {
      return;
    }

    const cargarCarrito = async () => {
      console.log("🔄 Cargando carrito (solo una vez)");
      hasFetched.current = true;

      try {
        setLoading(true);
        
        const respuesta = await getItemsCarritoPorUsuario(usuario.id);
        console.log("✅ Carrito cargado exitosamente:", respuesta.data);
        
        const datosCarrito = Array.isArray(respuesta?.data) ? respuesta.data : [];
        setItems(datosCarrito);
        
      } catch (error) {
        console.error("❌ Error al cargar el carrito:", error);
        setError("No se pudo cargar tu carrito.");
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, [usuario, token]);

  // Si no hay usuario o token, mostrar error
  useEffect(() => {
    if (!usuario || !token) {
      setError("Debes iniciar sesión para continuar con el pago.");
      setLoading(false);
    }
  }, [usuario, token]);

  // Calcular subtotal basado en los items del carrito
  const subtotal = useMemo(
    () => items.reduce((acumulador, item) => 
      acumulador + Number(item.producto?.cost ?? 0) * Number(item.quantity ?? 1), 0),
    [items]
  );

  // Calcular costo de envío según el método seleccionado
  const costoEnvio = useMemo(() => {
    if (metodoEnvio === "estandar") return 3990;
    if (metodoEnvio === "express") return 6990;
    return 0;
  }, [metodoEnvio]);

  // Calcular IVA (19% Chile)
  const iva = useMemo(() => subtotal * 0.19, [subtotal]);

  // Calcular total final incluyendo envío e IVA
  const total = useMemo(() => subtotal + iva + costoEnvio, [subtotal, iva, costoEnvio]);

  // Manejar la confirmación de la compra - VERSIÓN CORREGIDA
  const confirmarCompra = async () => {
    if (!usuario || !token) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    if (!items.length) {
      alert("Tu carrito está vacío.");
      navigate("/carrito");
      return;
    }

    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return;
    }

    if (metodoPago === "efectivo" && metodoEnvio !== "retiro") {
      alert("El pago en efectivo solo está disponible para retiro en tienda.");
      return;
    }

    try {
      setProcesando(true);
      
      console.log("📤 Generando boleta...", {
        usuarioId: usuario.id,
        metodoPago,
        metodoEnvio,
        itemsCount: items.length,
        subtotal,
        iva,
        costoEnvio,
        total
      });
      
      // DEBUG: Mostrar datos que se enviarán
      console.log("📨 Datos a enviar al backend:", {
        usuarioId: usuario.id,
        metodoPago,
        metodoEnvio
      });
      
      const response = await generarBoleta(usuario.id, metodoPago, metodoEnvio);
      
      console.log("✅ Boleta generada exitosamente:", response.data);
      
      // Redirigir a confirmación con los datos de la boleta
      navigate("/confirmacion-boleta", { 
        state: { 
          boleta: response.data,
          metodoEnvio,
          costoEnvio
        } 
      });
      
    } catch (error) {
      console.error("❌ Error completo al generar boleta:", error);
      console.error("❌ Response data:", error.response?.data);
      console.error("❌ Response status:", error.response?.status);
      console.error("❌ Response headers:", error.response?.headers);
      
      let errorMessage = "Error al procesar la compra. Intenta nuevamente.";
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcesando(false);
    }
  };

  // Estados de carga inicial
  if (loading) {
    return (
      <main className="container my-5">
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Preparando tu pedido...</p>
        </div>
      </main>
    );
  }

  // Estados de error
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          <h5>Error</h5>
          <p>{error}</p>
          {(!usuario || !token) && (
            <Link to="/login" className="btn btn-primary mt-3">
              Iniciar sesión
            </Link>
          )}
          <div className="mt-3">
            <Link to="/carrito" className="btn btn-outline-secondary me-2">
              Volver al carrito
            </Link>
            <Link to="/productos" className="btn btn-outline-primary">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container my-5" style={{ maxWidth: 1100 }}>
      <h1 className="mb-4" style={{ color: "#587042", fontWeight: 700, textAlign: "center" }}>
        Finalizar Compra
      </h1>

      {items.length === 0 ? (
        <div className="text-center">
          <div className="alert alert-warning">
            <p className="mb-3">No tienes productos en tu carrito.</p>
            <Link to="/productos" className="btn btn-primary">
              Explorar Productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-7">
            <div className="p-4 border rounded-3 shadow-sm">
              <h5 className="mb-3" style={{ color: "#587042", fontWeight: 700 }}>
                Método de Entrega
              </h5>
              <select
                className="form-select mb-4"
                value={metodoEnvio}
                onChange={(e) => setMetodoEnvio(e.target.value)}
              >
                <option value="retiro">📦 Retiro en tienda (Gratis)</option>
                <option value="estandar">🚚 Envío estándar ({fmt.format(3990)})</option>
                <option value="express">⚡ Envío express ({fmt.format(6990)})</option>
              </select>

              <h5 className="mb-3" style={{ color: "#587042", fontWeight: 700 }}>
                Método de Pago
              </h5>
              <select
                className="form-select mb-4"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="">Selecciona método de pago</option>
                <option value="tarjeta">💳 Tarjeta débito/crédito</option>
                <option value="transferencia">🏦 Transferencia bancaria</option>
                <option value="efectivo">💰 Efectivo (solo retiro)</option>
              </select>

              <div className="card bg-light border-0">
                <div className="card-body">
                  <h6 className="card-title" style={{ color: "#587042" }}>
                    👤 Información del comprador
                  </h6>
                  <p className="card-text mb-1">
                    <strong>Nombre:</strong> {usuario?.username}
                  </p>
                  <p className="card-text mb-0">
                    <strong>Email:</strong> {usuario?.email}
                  </p>
                  {usuario?.rut && (
                    <p className="card-text mb-0">
                      <strong>RUT:</strong> {usuario.rut}
                    </p>
                  )}
                </div>
              </div>

              {/* Información de contacto para envío */}
              {metodoEnvio !== "retiro" && (
                <div className="card bg-light border-0 mt-3">
                  <div className="card-body">
                    <h6 className="card-title" style={{ color: "#587042" }}>
                      📍 Dirección de Envío
                    </h6>
                    {usuario?.direccion ? (
                      <>
                        <p className="card-text mb-1">
                          <strong>Dirección:</strong> {usuario.direccion}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Comuna:</strong> {usuario.comuna}
                        </p>
                        <p className="card-text mb-0">
                          <strong>Región:</strong> {usuario.region}
                        </p>
                      </>
                    ) : (
                      <p className="text-warning mb-0">
                        ⚠️ No tienes dirección registrada. Actualiza tu perfil.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="d-flex gap-2 mt-4">
                <Link to="/carrito" className="btn btn-outline-secondary flex-fill">
                  ← Volver al carrito
                </Link>
                <button 
                  className="btn flex-fill" 
                  style={{ backgroundColor: "#587042", color: "white", fontWeight: 600 }} 
                  onClick={confirmarCompra}
                  disabled={procesando || !metodoPago}
                >
                  {procesando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </>
                  ) : (
                    "✅ Confirmar Compra"
                  )}
                </button>
              </div>

              {!metodoPago && (
                <div className="alert alert-warning mt-3 mb-0">
                  ⚠️ Selecciona un método de pago
                </div>
              )}

              {/* Información adicional */}
              <div className="mt-3">
                <small className="text-muted">
                  💡 Al confirmar la compra, se generará una boleta electrónica y recibirás un correo de confirmación.
                </small>
              </div>
            </div>
          </section>

          <aside className="col-12 col-lg-5">
            <div className="p-4 border rounded-3 shadow-sm">
              <h5 className="mb-3" style={{ color: "#587042", fontWeight: 700 }}>
                Resumen del Pedido
              </h5>

              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">P. Unit.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <small>
                            {item.producto?.name || "Producto"}
                            {item.producto?.activeStatus === false && (
                              <span className="badge bg-warning ms-1">Inactivo</span>
                            )}
                          </small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary">x{item.quantity}</span>
                        </td>
                        <td className="text-end">
                          <small>{fmt.format(item.producto?.cost || 0)}</small>
                        </td>
                        <td className="text-end">
                          <small>{fmt.format((item.producto?.cost || 0) * item.quantity)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{fmt.format(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>IVA (19%):</span>
                <span>{fmt.format(iva)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Costo de Envío:</span>
                <span>{metodoEnvio === "retiro" ? "Gratis" : fmt.format(costoEnvio)}</span>
              </div>

              <div className="d-flex justify-content-between mt-3 pt-2 border-top fw-bold fs-5">
                <span>Total Final:</span>
                <span style={{ color: "#587042" }}>{fmt.format(total)}</span>
              </div>

              {/* Resumen de productos */}
              <div className="mt-3 pt-3 border-top">
                <h6 className="small text-muted">Resumen de productos:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {items.map((item, index) => (
                    <span key={index} className="badge bg-light text-dark">
                      {item.producto?.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Información de garantía */}
              <div className="mt-3 p-3 bg-light rounded">
                <h6 className="small text-muted mb-2">📦 Información de entrega:</h6>
                <ul className="small mb-0">
                  <li>Retiro en tienda: Disponible inmediatamente</li>
                  <li>Envío estándar: 3-5 días hábiles</li>
                  <li>Envío express: 1-2 días hábiles</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}