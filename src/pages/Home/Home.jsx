import { useEffect, useState } from "react";
import { Navbar } from "../../componentes/Navbar/Navbar";
import { getProductosDestacados } from "../../services/api";
import { agregarItemCarrito } from "../../services/api";
import "../../index.css";

// Configuración de imágenes y constantes
const PLACEHOLDER_IMG = "/wooden.jpg";
const IMAGENES_CARRUSEL = [
  "/empanadas.jpg",
  "/galletas.jpg",
  "/masita.jpg",
  "/pan.jpg",
];

// Función para agregar productos al carrito de compras
async function agregarAlCarrito(productoId) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuario) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    return;
  }

  try {
    await agregarItemCarrito(usuario.id, productoId, 1);
    alert("Producto agregado al carrito");
    
    // Disparar evento global para actualizar componentes del carrito
    window.dispatchEvent(new Event('carritoActualizado'));
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
    } else {
      alert("No se pudo agregar el producto al carrito.");
    }
  }
}

export function Home() {
  // Estados del componente
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [indiceImagen, setIndiceImagen] = useState(0);
  
  // Formateador de precios para moneda chilena
  const fmt = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  // Cargar productos destacados al montar el componente
  useEffect(() => {
    getProductosDestacados()
      .then((res) => {
        setDestacados(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al obtener productos destacados:", err);
        setCargando(false);
      });
  }, []);

  // Configurar carrusel automático con intervalo
  useEffect(() => {
    const intervalo = setInterval(() => {
      siguienteImagen();
    }, 5000);
    return () => clearInterval(intervalo);
  }, [indiceImagen]);

  // Navegación del carrusel - siguiente imagen
  const siguienteImagen = () => {
    setIndiceImagen((prev) =>
      prev === IMAGENES_CARRUSEL.length - 1 ? 0 : prev + 1
    );
  };

  // Navegación del carrusel - imagen anterior
  const anteriorImagen = () => {
    setIndiceImagen((prev) =>
      prev === 0 ? IMAGENES_CARRUSEL.length - 1 : prev - 1
    );
  };

  // Estilo para transformación del carrusel
  const transformStyle = {
    transform: `translateX(-${indiceImagen * 100}%)`,
  };

  return (
    <>
      <div className="container">
        <Navbar />
      </div>

      <main>
        {/* Sección principal del carrusel hero */}
        <section className="home-hero">
          <div className="home-hero-images-container" style={transformStyle}>
            {IMAGENES_CARRUSEL.map((imagen, index) => (
              <img
                key={index}
                src={imagen}
                alt={`Imagen promocional ${index + 1}`}
                className="home-hero-image"
                onError={(e) => {
                  e.target.src = "/stockcocina.jpg";
                }}
              />
            ))}
          </div>

          {/* Controles de navegación del carrusel */}
          <button
            className="home-hero-arrow home-hero-arrow-left"
            onClick={anteriorImagen}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            className="home-hero-arrow home-hero-arrow-right"
            onClick={siguienteImagen}
            aria-label="Siguiente imagen"
          >
            ›
          </button>

          {/* Indicadores de posición del carrusel */}
          <div className="home-hero-indicators">
            {IMAGENES_CARRUSEL.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceImagen(index)}
                className={`home-hero-indicator ${
                  index === indiceImagen ? "active" : ""
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Texto superpuesto en el carrusel */}
          <div className="home-hero-text">
            <h1 className="home-hero-title">
              La fórmula del sabor, con rigor científico.
            </h1>
          </div>
        </section>

        {/* Sección de productos destacados */}
        <section className="home-products container">
          <h2 className="home-products-title">Nuestros productos destacados</h2>

          {/* Estados de carga y contenido */}
          {cargando ? (
            <p className="home-loading">Cargando productos...</p>
          ) : destacados.length === 0 ? (
            <p className="home-no-products">No hay productos destacados disponibles.</p>
          ) : (
            <div className="home-products-grid">
              {destacados.map((producto) => (
                <article key={producto.id} className="home-product-card">
                  {/* Imagen del producto */}
                  <img
                    src={producto.image || PLACEHOLDER_IMG}
                    alt={producto.name}
                    className="home-product-image"
                  />
                  
                  {/* Nombre del producto */}
                  <h3 className="home-product-name">{producto.name}</h3>
                  
                  {/* Descripción del producto */}
                  <p className="home-product-description">
                    {producto.description?.substring(0, 120)}
                    {producto.description?.length > 120 ? "…" : ""}
                  </p>
                  
                  {/* Precio del producto */}
                  <p className="home-product-price">{fmt.format(producto.cost)}</p>
                  
                  {/* Botón para agregar al carrito */}
                  <button
                    type="button"
                    className="home-product-button"
                    onClick={() => {
                      agregarAlCarrito(producto.id);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}