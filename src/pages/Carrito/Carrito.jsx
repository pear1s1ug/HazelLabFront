import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getItemsCarritoPorUsuario,
  eliminarItemCarrito,
  actualizarItemCarrito,
} from "../../services/api";
import "../../index.css";

export function Carrito() {
  // Estados del componente
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formateador de precios para moneda chilena
  const fmt = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  // Obtener información del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  // Cargar items del carrito desde el backend
  const cargarCarrito = async () => {
    if (!usuario) {
      setError("Debes iniciar sesión para ver tu carrito.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const respuesta = await getItemsCarritoPorUsuario(usuario.id);
      const datosCarrito = Array.isArray(respuesta.data) ? respuesta.data : [];
      setItems(datosCarrito);
      calcularTotal(datosCarrito);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      setError("No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito al montar el componente
  useEffect(() => {
    cargarCarrito();
  }, []);

  // Escuchar eventos de actualización del carrito desde otros componentes
  useEffect(() => {
    const manejarActualizacionCarrito = () => {
      cargarCarrito();
    };

    window.addEventListener('carritoActualizado', manejarActualizacionCarrito);
    return () => {
      window.removeEventListener('carritoActualizado', manejarActualizacionCarrito);
    };
  }, []);

  // Calcular el total del carrito
  const calcularTotal = (listaItems) => {
    const totalCalculado = listaItems.reduce(
      (acumulador, item) => acumulador + (item.producto?.cost || 0) * item.quantity,
      0
    );
    setTotal(totalCalculado);
  };

  // Actualizar cantidad de un item en el carrito
  const actualizarCantidad = async (item, nuevaCantidad) => {
    try {
      await actualizarItemCarrito(item.id, nuevaCantidad);
      
      // ACTUALIZAR ESTADO INMEDIATAMENTE
      const itemsActualizados = items.map((itemActual) =>
        itemActual.id === item.id ? { ...itemActual, quantity: nuevaCantidad } : itemActual
      );
      
      setItems(itemsActualizados);
      calcularTotal(itemsActualizados);
      
      window.dispatchEvent(new Event('carritoActualizado'));
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      alert("No se pudo actualizar la cantidad del producto.");
    }
  };

  // Incrementar cantidad de un producto
  const aumentarCantidad = (item) =>
    actualizarCantidad(item, item.quantity + 1);

  // Decrementar cantidad de un producto
  const disminuirCantidad = (item) => {
    if (item.quantity > 1) actualizarCantidad(item, item.quantity - 1);
  };

  // Eliminar producto del carrito
  const quitarDelCarrito = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto del carrito?")) return;
    try {
      await eliminarItemCarrito(id);
      const itemsFiltrados = items.filter((item) => item.id !== id);
      setItems(itemsFiltrados);
      calcularTotal(itemsFiltrados);
      
      // Notificar a otros componentes sobre la actualización
      window.dispatchEvent(new Event('carritoActualizado'));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto del carrito.");
    }
  };

  // Estado de carga
  if (loading) return <p className="text-center my-5">Cargando carrito...</p>;

  // Estado de error
  if (error)
    return (
      <div className="text-center my-5">
        <p>{error}</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar sesión
        </Link>
      </div>
    );

  return (
    <main className="container my-5">
      <h1
        className="mb-4"
        style={{ color: "#587042", fontWeight: "700", textAlign: "center" }}
      >
        Tu Carrito de Compras
      </h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p>Tu carrito está vacío.</p>
          <Link to="/productos" className="btn btn-primary">
            Explorar Productos
          </Link>
        </div>
      ) : (
        <>
          {/* Tabla de productos en el carrito */}
          <table className="table table-bordered align-middle">
            <thead style={{ backgroundColor: "#DAD7CD" }}>
              <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.producto?.name || "Producto sin nombre"}</td>
                  <td>{fmt.format(item.producto?.cost || 0)}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#FAFAFA",
                          color: "#587042",
                          border: "1px solid #8C9A6C",
                        }}
                        onClick={() => disminuirCantidad(item)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "25px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#8C9A6C",
                          color: "white",
                          border: "1px solid #8C9A6C",
                        }}
                        onClick={() => aumentarCantidad(item)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{fmt.format((item.producto?.cost || 0) * item.quantity)}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#486d53ff",
                        color: "white",
                        border: "none",
                        transition: "0.2s",
                      }}
                      onClick={() => quitarDelCarrito(item.id)}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#bd5851ff")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#486d53ff")
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total del carrito */}
          <p className="text-end mt-3 fs-5" style={{ color: "#587042" }}>
            <strong>Total: {fmt.format(total)}</strong>
          </p>

          {/* Botones de navegación */}
          <div className="d-flex justify-content-between mt-4">
            <Link
              to="/productos"
              className="btn"
              style={{
                backgroundColor: "#DAD7CD",
                color: "#587042",
                fontWeight: "500",
              }}
            >
              Continuar Comprando
            </Link>
            <Link
              to="/checkout"
              className="btn"
              style={{
                backgroundColor: "#587042",
                color: "white",
                fontWeight: "600",
              }}
            >
              Proceder al Pago
            </Link>
          </div>
        </>
      )}
    </main>
  );
}