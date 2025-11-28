import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductos, agregarItemCarrito } from "../../services/api";
import "../../index.css";

export function DetalleProducto() {
  // Configuración inicial y estados del componente
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregando, setAgregando] = useState(false);
  const [imagenError, setImagenError] = useState(false);
  
  // Constantes y formateadores
  const PLACEHOLDER_IMG = "/wooden.jpg";
  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  // Cargar datos del producto al montar el componente
  useEffect(() => {
    getProductos()
      .then((res) => {
        const productoEncontrado = res.data.find((prod) => String(prod.id) === String(id));
        if (!productoEncontrado) {
          setError("Producto no encontrado");
        } else {
          setProducto(productoEncontrado);
        }
      })
      .catch(() => setError("Error al cargar producto."))
      .finally(() => setCargando(false));
  }, [id]);

  // Manejar agregar producto al carrito
  const agregarAlCarrito = async () => {
    if (!producto) return;

    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }

    setAgregando(true);

    try {
      await agregarItemCarrito(usuario.id, producto.id, 1);
      window.dispatchEvent(new Event('carritoActualizado'));
      alert(`"${producto.name}" agregado al carrito`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("usuarioLogueado");
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("Producto no encontrado en el sistema.");
      } else {
        alert("No se pudo agregar el producto al carrito. Intenta nuevamente.");
      }
    } finally {
      setAgregando(false);
    }
  };

  // Manejar errores de carga de imagen
  const manejarErrorImagen = () => {
    setImagenError(true);
  };

  // Estados de carga
  if (cargando)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p>Cargando producto...</p>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  // Estado de error
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p className="text-danger">{error}</p>
        <button
          onClick={() => navigate("/productos")}
          className="home-product-button"
          style={{ marginTop: "1rem" }}
        >
          Volver a productos
        </button>
      </div>
    );

  // Determinar fuente de imagen (producto o placeholder)
  const imagenSrc = (!producto.image || imagenError) ? PLACEHOLDER_IMG : producto.image;

  return (
    <main className="container my-5">
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "3rem",
        alignItems: "flex-start",
        justifyContent: "center",
      }}>
        
        {/* Sección de imagen del producto */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          <div style={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(88, 112, 66, 0.15)",
            backgroundColor: (!producto.image || imagenError) ? "#f8f8f8" : "transparent"
          }}>
            <img
              src={imagenSrc}
              alt={producto.name}
              className="home-product-image"
              onError={manejarErrorImagen}
              style={{
                height: "400px",
                backgroundColor: (!producto.image || imagenError) ? "#f8f8f8" : "transparent"
              }}
            />
          </div>
        </div>

        {/* Sección de información del producto */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          {/* Nombre del producto */}
          <h1 className="home-product-name" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            {producto.name}
          </h1>
          
          {/* Categoría del producto */}
          {producto.category && (
            <p style={{ color: "#6c757d", marginBottom: "1rem" }}>
              <strong>Categoría:</strong> {producto.category.nombre}
            </p>
          )}

          {/* Descripción del producto */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5 style={{ color: "#333", marginBottom: "0.5rem" }}>Descripción:</h5>
            <p className="home-product-description" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
              {producto.description || "Sin descripción disponible."}
            </p>
          </div>

          {/* Información detallada del producto */}
          <div style={{ marginBottom: "2rem" }}>
            <h5 style={{ color: "#333", marginBottom: "1rem" }}>Información del producto:</h5>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <p><strong>Precio:</strong> 
                <span style={{ color: "#587042", fontSize: "1.2rem", fontWeight: "bold" }}>
                  {fmt.format(producto.cost || 0)}
                </span>
              </p>
              <p><strong>Stock disponible:</strong> {producto.stock || 0} unidades</p>
              {producto.batchCode && <p><strong>Lote:</strong> {producto.batchCode}</p>}
              {producto.proveedor && <p><strong>Proveedor:</strong> {producto.proveedor}</p>}
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={agregarAlCarrito}
              className="home-product-button"
              disabled={agregando}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1.1rem",
                opacity: agregando ? 0.6 : 1,
                cursor: agregando ? "not-allowed" : "pointer",
                flex: "1"
              }}
            >
              {agregando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Agregando...
                </>
              ) : (
                "Añadir al carrito"
              )}
            </button>

            <Link
              to="/productos"
              className="btn"
              style={{
                backgroundColor: "#DAD7CD",
                color: "#587042",
                fontWeight: "600",
                padding: "0.75rem 2rem",
                border: "none",
                textDecoration: "none",
                textAlign: "center",
                flex: "1"
              }}
            >
              Volver a productos
            </Link>
          </div>

          {/* Mensaje para usuarios no autenticados */}
          {!localStorage.getItem("usuarioLogueado") && (
            <div style={{ 
              marginTop: "1rem", 
              padding: "0.75rem", 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffeaa7",
              borderRadius: "6px",
              fontSize: "0.9rem"
            }}>
              Debes <Link to="/login" style={{ color: "#587042", fontWeight: "600" }}>iniciar sesión</Link> para agregar productos al carrito
            </div>
          )}
        </div>
      </div>
    </main>
  );
}