import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUsuario } from "../../services/api";
import "./Login-y-registro.css";

export function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validar formato de correo electrónico permitido
  const validarCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo);
  };

  // Validar todos los campos del formulario antes del envío
  const validarFormulario = () => {
    if (!correo.trim()) {
      setError("El correo electrónico es obligatorio");
      return false;
    }
    if (!validarCorreo(correo)) {
      setError("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return false;
    }
    if (!clave.trim()) {
      setError("La contraseña es obligatoria");
      return false;
    }
    if (clave.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return false;
    }
    setError("");
    return true;
  };

  // Manejar el proceso de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const email = correo.trim().toLowerCase();
    const password = clave.trim();

    try {
      setLoading(true);
      setError("");
      
      console.log("Enviando credenciales:", { email, password });
      
      const response = await loginUsuario(email, password);
      console.log("Respuesta del servidor:", response.data);
      
      const { token, usuario } = response.data;

      // Validar estructura de respuesta del servidor
      if (!token || !usuario) {
        setError("Error: respuesta inválida del servidor.");
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

      // Notificar a otros componentes sobre el cambio de estado de autenticación
      window.dispatchEvent(new Event('usuarioLogueado'));
      
      alert(`¡Bienvenido ${usuario.username || "Usuario"}!`);

      // Redirigir según el rol del usuario
      const rol = usuario.role?.toLowerCase() || "cliente";

      // Permite admin, super_admin y cliente
      if (["administrador", "super_admin", "admin"].includes(rol)) {
          navigate("/admin");
      } else if (["cliente", "user", "usuario"].includes(rol)) {
          navigate("/"); // Área de clientes
      } else {
          navigate("/"); // Redirigir por defecto
      }
      
    } catch (error) {
      console.error("Error completo al iniciar sesión:", error);
      
      // Manejar diferentes tipos de errores de autenticación
      if (error.response?.status === 400) {
        setError(error.response.data || "Credenciales incorrectas o acceso no autorizado.");
      } else if (error.response?.status === 404) {
        setError("Usuario no encontrado en el sistema.");
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        setError("Error de conexión. Verifica que el servidor esté ejecutándose.");
      } else {
        setError(error.response?.data || "Error al iniciar sesión. Intenta nuevamente.");
      }
      
      setClave("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container my-5">
      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>

        {/* Mostrar mensajes de error al usuario */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo de correo electrónico */}
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            maxLength="100"
            placeholder="admin@duoc.cl"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setError(""); // Limpiar errores al modificar el campo
            }}
            disabled={loading}
          />

          {/* Campo de contraseña */}
          <label htmlFor="clave">Contraseña</label>
          <input
            type="password"
            id="clave"
            name="clave"
            required
            minLength="4"
            maxLength="60"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => {
              setClave(e.target.value);
              setError(""); // Limpiar errores al modificar el campo
            }}
            disabled={loading}
          />

          {/* Botón de envío del formulario */}
          <button 
            type="submit" 
            className="login-btn mt-3" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Iniciando sesión...
              </>
            ) : (
              "Ingresar"
            )}
          </button>

          {/* Enlaces de navegación adicionales */}
          <div className="text-center mt-3">
            <Link to="/registro" className="login-link">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link to="/" className="login-link">
              Volver al Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}