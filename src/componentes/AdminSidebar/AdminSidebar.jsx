import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para cerrar sesión del administrador
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada correctamente.");
    navigate("/");
    window.location.reload(); // Recargar para limpiar el estado global
  };

  // Función para redirigir al Home principal del sitio
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <aside id="menu-sidebar" className="admin-sidebar">
      {/* Logo clickeable que redirige al Home principal */}
      <div 
        id="logo" 
        className="text-center fw-bold mb-4"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
        title="Ir al sitio principal"
      >
        Hazel🌰Lab
      </div>

      {/* Menú de navegación del panel de administración */}
      <nav id="menu">
        <ul className="list-unstyled text-center flex-grow-1">
          {/* Enlace al Dashboard principal */}
          <li className="mb-3">
            <Link
              to="/admin"
              className={`text-decoration-none fw-semibold ${
                location.pathname === "/admin" ? "active-link" : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          
          {/* Enlace a la gestión de usuarios/clientes */}
          <li className="mb-3">
            <Link
              to="/admin/clientes"
              className={`text-decoration-none fw-semibold ${
                location.pathname.startsWith("/admin/clientes") ? "active-link" : ""
              }`}
            >
              Ver Usuarios
            </Link>
          </li>
          
          {/* Enlace a la gestión de inventario de productos */}
          <li className="mb-3">
            <Link
              to="/admin/productos"
              className={`text-decoration-none fw-semibold ${
                location.pathname.startsWith("/admin/productos") ? "active-link" : ""
              }`}
            >
              Ver Inventario
            </Link>
          </li>

          {/* NUEVO: Historial de Ventas */}
          <li className="mb-3">
            <Link
              to="/admin/ventas"
              className={`text-decoration-none fw-semibold ${
                location.pathname.startsWith("/admin/ventas") ? "active-link" : ""
              }`}
            >
              Historial de Ventas
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botón para cerrar sesión - Posicionado en la parte inferior */}
      <button className="logout-btn mt-auto mb-4" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}