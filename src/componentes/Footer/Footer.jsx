import './Footer.css';

export function Footer() {
  return (
    <footer className="footer mt-auto py-3">
      <div className="container text-center">
        <p className="mb-1">© {new Date().getFullYear()} Hazel🌰Lab — Todos los derechos reservados.</p>
        <p className="mb-0">
          <a href="#">Instagram</a> | 
          <a href="#"> Twitter</a> | 
          <a href="#"> Whatsapp</a>
        </p>
      </div>
    </footer>
  );
}
