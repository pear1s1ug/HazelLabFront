// src/pages/Nosotros/Nosotros.jsx
import { Navbar } from "../../componentes/Navbar/Navbar";
import "./Nosotros.css";

export function Nosotros() {
  return (
    <>
      <div className="container">
        <Navbar />
      </div>

      <main className="nosotros-container">
        {/* Encabezado principal con presentación de la marca */}
        <section className="nosotros-hero">
          <h1>Hazel🌰Lab: Ciencia y Sabor en tu Cocina</h1>
          <p>
            Donde la química alimentaria y la creatividad culinaria se
            encuentran.
          </p>
        </section>

        {/* Sección de enfoque dual: ciencia y repostería */}
        <section className="nosotros-seccion doble">
          <div className="nosotros-card">
            <h2>Precisión de la Química</h2>
            <p>
              Hazel🌰Lab nace del entusiasmo por unir ciencia y arte culinario.
              Cada fórmula, cada textura y cada aroma son el resultado de años
              de exploración científica aplicada al placer gastronómico.
            </p>
            <ul>
              <li>Ingredientes funcionales y estabilizantes de grado alimenticio</li>
              <li>Formulaciones precisas para procesos repetibles y eficientes</li>
              <li>Control y trazabilidad en cada lote</li>
            </ul>
          </div>

          <div className="nosotros-card">
            <h2>Arte de la Repostería</h2>
            <p>
              En Hazel🌰Lab creemos que cocinar también es experimentar. Cada
              receta es una oportunidad para explorar, innovar y perfeccionar.
            </p>
            <ul>
              <li>Utensilios y materias primas para cada desafío</li>
              <li>Apoyo para recetas clásicas y vanguardistas</li>
              <li>Soporte técnico y orientación personalizada</li>
            </ul>
          </div>
        </section>

        {/* Sección de beneficios para los clientes */}
        <section className="nosotros-seccion">
          <h2>¿Por qué elegir Hazel🌰Lab?</h2>
          <div className="nosotros-beneficios">
            <div className="beneficio-card">
              <h3>Pedidos Personalizados</h3>
              <p>
                Guarda tus combinaciones favoritas y repítelas en segundos.
                Ideal para negocios que buscan eficiencia y precisión.
              </p>
            </div>
            <div className="beneficio-card">
              <h3>Programa de Fidelidad</h3>
              <p>
                Acumula puntos, accede a descuentos exclusivos y participa en
                sorteos con tus compras frecuentes.
              </p>
            </div>
            <div className="beneficio-card">
              <h3>Asesoría Científico-Gastronómica</h3>
              <p>
                ¿Buscas optimizar una receta o innovar en formulaciones? Te
                guiamos paso a paso con soporte técnico especializado.
              </p>
            </div>
            <div className="beneficio-card">
              <h3>Soluciones para Empresas</h3>
              <p>
                Desde tu primer emprendimiento hasta la producción industrial:
                crecemos contigo y con tu visión.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de filosofía y valores de la empresa */}
        <section className="nosotros-seccion filosofia">
          <h2>Nuestra Filosofía</h2>
          <blockquote>
            "Somos el puente entre el rigor científico y la creatividad
            repostera. En Hazel🌰Lab no solo vendemos ingredientes: fomentamos
            la innovación, la comunidad y la curiosidad por comprender lo que
            comemos."
          </blockquote>
        </section>

        {/* Galería visual de productos y ambiente de trabajo */}
        <section className="mb-5 nosotros-galeria-section">
          <h2 className="text-center mb-4">Galería</h2>

          <div
            id="carouselExample"
            className="carousel slide position-relative mx-auto nosotros-carrusel"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner rounded-4 shadow-lg">
              <div className="carousel-item active">
                <img src="/slide1.jpg" className="d-block w-100" alt="Presentación de productos Hazel🌰Lab" />
              </div>
              <div className="carousel-item">
                <img src="/mesaTrabajo.jpg" className="d-block w-100" alt="Área de trabajo y preparación" />
              </div>
              <div className="carousel-item">
                <img src="/productos.webp" className="d-block w-100" alt="Nuestra línea de productos" />
              </div>
              <div className="carousel-item">
                <img src="/reposteria.jpg" className="d-block w-100" alt="Ejemplos de repostería creada con nuestros productos" />
              </div>
            </div>

            {/* Controles de navegación del carrusel */}
            <button
              className="carousel-control-prev nosotros-carrusel-arrow"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span aria-hidden="true">‹</span>
              <span className="visually-hidden">Imagen anterior</span>
            </button>

            <button
              className="carousel-control-next nosotros-carrusel-arrow"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span aria-hidden="true">›</span>
              <span className="visually-hidden">Siguiente imagen</span>
            </button>

            {/* Indicadores de posición del carrusel */}
            <div className="home-hero-indicators">
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
            </div>
          </div>
        </section>

        {/* Sección de futuras innovaciones y desarrollos */}
        <section className="nosotros-seccion futuro">
          <h2>Próximas Innovaciones en Hazel🌰Lab</h2>
          <div className="nosotros-futuro-tags">
            <span>Dashboard de Consumos</span>
            <span>Alertas de Reabastecimiento</span>
            <span>App Móvil</span>
            <span>Cursos Online y Recetarios</span>
          </div>
        </section>
      </main>
    </>
  );
}