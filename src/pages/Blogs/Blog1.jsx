// src/pages/Blogs/Blog1.jsx
import { Link } from "react-router-dom";
import "./Blog-detalle.css";

export function Blog1() {
  return (
    <main className="blog-detalle-container">
      {/* Imagen principal del artículo */}
      <img
        src="/caramelo.jpg"
        alt="La Química del Sabor"
        className="blog-detalle-image"
      />

      {/* Contenido principal del artículo */}
      <article className="blog-detalle-content">
        <h1 className="blog-detalle-title">
          La Química del Sabor: cómo las reacciones crean experiencias únicas
        </h1>
        <p className="blog-detalle-author">Por Equipo Hazel🌰Lab</p>

        {/* Primer párrafo explicando procesos químicos */}
        <p>
          La cocina es, en esencia, un laboratorio. Cada plato que preparamos
          está lleno de transformaciones químicas que despiertan nuestros
          sentidos. Cuando calientas el azúcar y se convierte en caramelo, estás
          presenciando una reacción fascinante: la <strong>caramelización</strong>.
          Lo mismo ocurre cuando la carne o el pan adquieren ese tono dorado y
          ese aroma irresistible — un efecto conocido como la{" "}
          <strong>reacción de Maillard</strong>, una danza entre aminoácidos y
          azúcares reductores.
        </p>

        {/* Segundo párrafo sobre la importancia de entender los procesos */}
        <p>
          Entender estos procesos te permite ir más allá de las recetas y
          convertirte en un verdadero creador de sabores. La ciencia detrás de
          la cocina no le quita la magia; al contrario, la multiplica. Cada
          temperatura, cada textura, cada color tiene una historia molecular que
          contar.
        </p>

        {/* Tercer párrafo sobre la filosofía de Hazel Lab */}
        <p>
          En Hazel🌰Lab creemos que conocer la química de los ingredientes es la
          base para cocinar con confianza y creatividad. Porque cuando comprendes
          la ciencia del sabor, dejas de seguir recetas y comienzas a crear
          experiencias.
        </p>

        {/* Navegación al final del artículo */}
        <div className="blog-detalle-footer">
          <Link to="/blogs" className="blog-volver-button">
            Volver a Blogs
          </Link>
        </div>
      </article>
    </main>
  );
}