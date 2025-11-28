import { Link } from "react-router-dom";
import "../../index.css";
import "./Blogs.css";

export function Blogs() {
  // Datos de los posts del blog
  const posts = [
    {
      id: 1,
      title: "La Química del Sabor",
      summary:
        "Cómo procesos como la caramelización o la reacción de Maillard transforman la cocina en ciencia.",
      image: "/caramelo.jpg",
      author: "Equipo Hazel🌰Lab",
    },
    {
      id: 2,
      title: "Del Laboratorio al Horno",
      summary:
        "El bicarbonato y los polvos de hornear son más que simples ingredientes: son pura reacción química.",
      image: "/masita2.jpg",
      author: "María González – Química en Alimentos",
    }
  ];

  return (
    <main className="blogs-container">
      {/* Encabezado de la sección de blogs */}
      <h1 className="blogs-title">Bitácora Culinaria</h1>
      <p className="blogs-subtitle">
        ¡Ponte al día con nuestros blogs! Donde la ciencia se mezcla con el sabor, y la curiosidad con la creatividad.
      </p>

      {/* Grid de artículos del blog */}
      <div className="blogs-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            {/* Imagen del artículo */}
            <div className="blog-image-wrapper">
              <img src={post.image} alt={post.title} className="blog-image" />
            </div>
            
            {/* Contenido del artículo */}
            <div className="blog-content">
              <h2 className="blog-title">{post.title}</h2>
              <p className="blog-summary">{post.summary}</p>
              <p className="blog-author">Por {post.author}</p>
              <Link to={`/blogs/${post.id}`} className="blog-link">
                Leer más
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}