import { Link } from "react-router-dom";
import "./Blog-detalle.css";

export function Blog2() {
  return (
    <main className="blog-detalle-container">
      {/* Imagen principal del artículo */}
      <img
        src="/masita2.jpg"
        alt="Del laboratorio al horno"
        className="blog-detalle-image"
      />

      {/* Contenido principal del artículo */}
      <article className="blog-detalle-content">
        <h1 className="blog-detalle-title">
          Del laboratorio al horno: la magia detrás de los polvos de hornear
        </h1>
        <p className="blog-detalle-author">Por María González – Química en Alimentos</p>

        {/* Primer párrafo del artículo */}
        <p>
          Hay algo casi poético en ver un pastel crecer dentro del horno.
          Detrás de ese instante esponjoso hay una reacción química precisa y
          calculada: los <strong>agentes leudantes</strong> como el bicarbonato y
          los polvos de hornear liberan dióxido de carbono cuando entran en
          contacto con la humedad o el calor. Esas burbujas de gas son las que
          crean la textura ligera y aireada que tanto amamos.
        </p>

        {/* Segundo párrafo del artículo */}
        <p>
          Pero no todos los leudantes son iguales. Algunos actúan de inmediato,
          mientras que otros lo hacen en etapas, asegurando un crecimiento más
          controlado. Saber cuál usar puede marcar la diferencia entre un bizcocho
          plano y uno perfectamente elevado.
        </p>

        {/* Tercer párrafo del artículo */}
        <p>
          En Hazel🌰Lab defendemos el equilibrio entre química y arte. Entender la
          función de cada ingrediente te permite experimentar con seguridad y
          precisión, sin dejar de lado la creatividad. La cocina no deja de ser
          un laboratorio: solo que aquí, los resultados se saborean.
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