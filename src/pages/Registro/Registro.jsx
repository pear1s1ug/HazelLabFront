import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario, getRegiones, getComunasPorRegion } from "../../services/api";
import "../InicioSesion/Login-y-registro.css";

export function Registro() {
  const navigate = useNavigate();

  // Estado para manejar los datos del formulario de registro
  const [formData, setFormData] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    clave: "",
    confirmarClave: "",
  });

  // Estados para gestión de regiones y comunas
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [cargandoRegiones, setCargandoRegiones] = useState(true);
  const [cargandoComunas, setCargandoComunas] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Efecto para cargar las regiones al inicializar el componente
  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        setCargandoRegiones(true);
        console.log("Cargando regiones desde API...");
        const response = await getRegiones();
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`${response.data.length} regiones cargadas`);
          setRegiones(response.data);
        } else {
          console.warn("Formato de datos inesperado:", response.data);
          // Datos de respaldo en caso de error de API
          setRegiones([
            "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
            "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble",
            "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
          ]);
        }
      } catch (error) {
        console.error("Error al cargar regiones:", error);
        // Datos de respaldo en caso de error de API
        setRegiones([
          "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
          "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble",
          "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
        ]);
      } finally {
        setCargandoRegiones(false);
      }
    };
    cargarRegiones();
  }, []);

  // Efecto para cargar comunas cuando cambia la región seleccionada
  useEffect(() => {
    const cargarComunas = async () => {
      if (formData.region) {
        setCargandoComunas(true);
        try {
          console.log(`Cargando comunas para: ${formData.region}`);
          const response = await getComunasPorRegion(formData.region);
          
          if (response.data && Array.isArray(response.data)) {
            console.log(`${response.data.length} comunas cargadas para ${formData.region}`);
            setComunas(response.data);
          } else {
            console.warn("Formato de comunas inesperado:", response.data);
            setComunas([]);
          }
          
          // Resetear comuna cuando cambia la región
          setFormData(prev => ({ ...prev, comuna: "" }));
        } catch (error) {
          console.error(`Error al cargar comunas para ${formData.region}:`, error);
          setComunas([]);
        } finally {
          setCargandoComunas(false);
        }
      } else {
        setComunas([]);
        setFormData(prev => ({ ...prev, comuna: "" }));
      }
    };
    
    cargarComunas();
  }, [formData.region]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validaciones de formato para RUN y correo electrónico
  const validarRun = (run) => {
    // Aceptar ambos formatos: 12.345.678-9 y 12345678-9
    const rutRegex = /^(\d{1,2}(?:\.?\d{3}){2}-[\dkK])|(\d{7,8}-[\dkK])$/;
    return rutRegex.test(run);
  };

  const validarCorreo = (correo) =>
    /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);

  // Función para formatear RUN mientras se escribe
  const handleRunChange = (e) => {
    let value = e.target.value;
    
    // Permitir borrado
    if (value.length < formData.run.length) {
      setFormData(prev => ({ ...prev, run: value }));
      return;
    }
    
    // Limpiar caracteres no numéricos excepto puntos y guión
    let cleanValue = value.replace(/[^0-9kK\.-]/g, '');
    
    // Si ya tiene el formato completo, no hacer más cambios
    if (cleanValue.match(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)) {
      setFormData(prev => ({ ...prev, run: cleanValue }));
      return;
    }
    
    // Formatear automáticamente
    let numbersOnly = cleanValue.replace(/[^0-9kK]/g, '');
    
    if (numbersOnly.length > 0) {
      const dv = numbersOnly.slice(-1).toUpperCase();
      const numbers = numbersOnly.slice(0, -1);
      
      if (numbers.length <= 2) {
        cleanValue = numbers + (dv ? '-' + dv : '');
      } else if (numbers.length <= 5) {
        cleanValue = numbers.slice(0, 2) + '.' + numbers.slice(2) + (dv ? '-' + dv : '');
      } else if (numbers.length <= 8) {
        cleanValue = numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5) + (dv ? '-' + dv : '');
      } else {
        cleanValue = numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5, 8) + '-' + dv;
      }
    }
    
    setFormData(prev => ({ ...prev, run: cleanValue }));
  };

  // Procesar el envío del formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const {
      run,
      nombre,
      apellidos,
      correo,
      fechaNacimiento,
      region,
      comuna,
      direccion,
      clave,
      confirmarClave,
    } = formData;

    // Validaciones frontend antes del envío
    if (!run.trim()) {
      setErrorMsg("El RUN es obligatorio");
      return;
    }

    if (!validarRun(run)) {
      setErrorMsg("RUN inválido. Use formato: 12.345.678-9");
      return;
    }

    if (!validarCorreo(correo)) {
      setErrorMsg("Correo inválido. Solo @duoc.cl / @profesor.duoc.cl / @gmail.com");
      return;
    }

    if (clave.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (clave !== confirmarClave) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (!region) {
      setErrorMsg("Debe seleccionar una región");
      return;
    }

    if (!comuna) {
      setErrorMsg("Debe seleccionar una comuna");
      return;
    }

    // Preparar datos para enviar al backend según estructura esperada
    const payload = {
      rut: run,
      username: nombre.trim(),
      apellidos: apellidos.trim(),
      email: correo.trim().toLowerCase(),
      password: clave,
      role: "cliente",
      status: "activo",
      region: region.trim(),
      comuna: comuna.trim(),
      direccion: direccion.trim(),
      fechaNacimiento: fechaNacimiento || null
    };

    console.log("Enviando datos de registro:", payload);

    try {
      setSubmitting(true);
      
      // 1. Crear el usuario
      const res = await crearUsuario(payload);
      console.log("Usuario creado:", res.data);
      
      // 2. Redirigir al login en lugar de hacer login automático
      alert(`¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.`);
      
      // Redirigir al login
      navigate("/login");
      
    } catch (err) {
      console.error("Error completo al registrar usuario:", err);
      
      // Manejar diferentes tipos de errores
      if (err.message && err.message.includes("RUT")) {
        setErrorMsg(err.message);
      } else if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          if (errorData.includes("duplicate") || errorData.includes("unique")) {
            setErrorMsg("El email o RUT ya están registrados. Usa otros datos.");
          } else {
            setErrorMsg(errorData);
          }
        } else {
          setErrorMsg("Error en los datos del formulario. Verifica la información.");
        }
      } else if (err.response?.status === 500) {
        setErrorMsg("Error interno del servidor. Intenta nuevamente.");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setErrorMsg("Error de conexión. Verifica tu internet y que el servidor esté ejecutándose.");
      } else {
        setErrorMsg(err.message || "No se pudo registrar el usuario. Verifica los datos e inténtalo nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container my-5">
      <div className="login-container">
        <h1 className="login-title">Registro de Usuario</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Mostrar mensajes de error */}
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}

          {/* Campo RUN */}
          <label htmlFor="run">RUN</label>
          <input
            type="text"
            id="run"
            name="run"
            required
            minLength="9"
            maxLength="12"
            placeholder="Ej: 12.345.678-9"
            value={formData.run}
            onChange={handleRunChange}
          />
          <small className="text-muted">Formato: 12.345.678-9 (se formatea automáticamente)</small>

          {/* Campo Nombre */}
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            maxLength="50"
            placeholder="Ingrese su nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          {/* Campo Apellidos */}
          <label htmlFor="apellidos">Apellidos</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            required
            maxLength="100"
            placeholder="Ingrese sus apellidos"
            value={formData.apellidos}
            onChange={handleChange}
          />

          {/* Campo Correo Electrónico */}
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            required
            maxLength="100"
            placeholder="usuario@duoc.cl"
            value={formData.correo}
            onChange={handleChange}
          />

          {/* Campo Fecha de Nacimiento (Opcional) */}
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento (opcional)</label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />

          {/* Campo Región */}
          <label htmlFor="region">Región</label>
          <select
            id="region"
            name="region"
            required
            className="form-select"
            value={formData.region}
            onChange={handleChange}
            disabled={cargandoRegiones}
          >
            <option value="">
              {cargandoRegiones ? "Cargando regiones..." : "Seleccionar región..."}
            </option>
            {regiones.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {cargandoRegiones && (
            <small className="text-muted">Cargando lista de regiones...</small>
          )}

          {/* Campo Comuna */}
          <label htmlFor="comuna">Comuna</label>
          <select
            id="comuna"
            name="comuna"
            required
            className="form-select"
            value={formData.comuna}
            onChange={handleChange}
            disabled={cargandoComunas || !formData.region}
          >
            <option value="">
              {cargandoComunas 
                ? "Cargando comunas..." 
                : !formData.region 
                  ? "Primero selecciona una región" 
                  : "Seleccionar comuna..."
              }
            </option>
            {comunas.map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
          {cargandoComunas && (
            <small className="text-muted">Cargando comunas de {formData.region}...</small>
          )}
          {formData.region && comunas.length === 0 && !cargandoComunas && (
            <small className="text-warning">
              No se encontraron comunas para esta región
            </small>
          )}

          {/* Campo Dirección */}
          <label htmlFor="direccion">Dirección</label>
          <textarea
            id="direccion"
            name="direccion"
            required
            maxLength="300"
            placeholder="Ingrese su dirección"
            value={formData.direccion}
            onChange={handleChange}
            rows="3"
          ></textarea>

          {/* Campo Contraseña */}
          <label htmlFor="clave">Contraseña</label>
          <input
            type="password"
            id="clave"
            name="clave"
            required
            minLength="6"
            maxLength="50"
            placeholder="Mínimo 6 caracteres"
            value={formData.clave}
            onChange={handleChange}
          />

          {/* Campo Confirmar Contraseña */}
          <label htmlFor="confirmarClave">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmarClave"
            name="confirmarClave"
            required
            minLength="6"
            maxLength="50"
            placeholder="Repita su contraseña"
            value={formData.confirmarClave}
            onChange={handleChange}
          />

          {/* Botón de envío del formulario */}
          <button type="submit" className="login-btn mt-3" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>

          {/* Enlaces de navegación */}
          <div className="text-center mt-3">
            <Link to="/" className="login-link me-3">
              Volver al Home
            </Link>
            <Link to="/login" className="login-link">
              Ir a Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}