import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearUsuario, getRegiones, getComunasPorRegion } from "../../services/api";
import "./VistaClienteYProducto.css";

export function NuevoUsuario() {
  const navigate = useNavigate();
  
  // Estado principal para almacenar los datos del nuevo usuario
  const [usuario, setUsuario] = useState({
    username: "",
    apellidos: "",
    email: "",
    rut: "",
    password: "",
    role: "cliente",
    status: "activo",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: ""
  });
  
  // Estados para gestión de contraseña y validación
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [creando, setCreando] = useState(false);
  const [errores, setErrores] = useState({});

  // Estados para gestión de regiones y comunas
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [cargandoRegiones, setCargandoRegiones] = useState(true);
  const [cargandoComunas, setCargandoComunas] = useState(false);

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
          setRegiones([]);
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
      if (usuario.region) {
        setCargandoComunas(true);
        try {
          console.log(`Cargando comunas para: ${usuario.region}`);
          const response = await getComunasPorRegion(usuario.region);
          
          if (response.data && Array.isArray(response.data)) {
            console.log(`${response.data.length} comunas cargadas para ${usuario.region}`);
            setComunas(response.data);
          } else {
            console.warn("Formato de comunas inesperado:", response.data);
            setComunas([]);
          }
          
          // Resetear comuna cuando cambia la región
          setUsuario(prev => ({ ...prev, comuna: "" }));
        } catch (error) {
          console.error(`Error al cargar comunas para ${usuario.region}:`, error);
          setComunas([]);
        } finally {
          setCargandoComunas(false);
        }
      } else {
        setComunas([]);
        setUsuario(prev => ({ ...prev, comuna: "" }));
      }
    };
    cargarComunas();
  }, [usuario.region]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    
    // Limpiar error del campo cuando el usuario escribe
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: "" }));
    }
    
    // Validar contraseña en tiempo real
    if (name === "password" || confirmarPassword) {
      validarPassword();
    }
  };

  // Validar contraseñas en tiempo real
  const validarPassword = () => {
    const nuevosErrores = { ...errores };
    
    if (usuario.password.length > 0 && usuario.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (usuario.password !== confirmarPassword) {
      nuevosErrores.password = "Las contraseñas no coinciden";
    } else {
      delete nuevosErrores.password;
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Validación de formato de email con dominios permitidos
  const validarEmail = (email) => {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => email.endsWith(dominio));
  };

  // Validación de fecha de nacimiento (mayor de 18 años)
  const validarFechaNacimiento = (fecha) => {
    if (!fecha) return true; // Opcional
    
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      return edad - 1 >= 18;
    }
    return edad >= 18;
  };

  // Validación de RUT chileno con algoritmo de dígito verificador
  const validarRUT = (rut) => {
    if (!rut) return false;
    
    // Validar formato básico: 12.345.678-9 o 12345678-9
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 8) return false;
    
    // Validar dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dvCalculado === dv;
  };

  // Validación completa del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Validar campos requeridos
    if (!usuario.username.trim()) nuevosErrores.username = "El nombre de usuario es obligatorio";
    if (!usuario.apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios";
    if (!usuario.email.trim()) nuevosErrores.email = "El email es obligatorio";
    if (!usuario.rut.trim()) nuevosErrores.rut = "El RUT es obligatorio";
    if (!usuario.password) nuevosErrores.password = "La contraseña es obligatoria";
    if (!usuario.region) nuevosErrores.region = "La región es obligatoria";
    if (!usuario.comuna) nuevosErrores.comuna = "La comuna es obligatoria";
    if (!usuario.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    
    // Validaciones específicas
    if (usuario.email && !validarEmail(usuario.email)) {
      nuevosErrores.email = "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com";
    }
    
    if (usuario.rut && !validarRUT(usuario.rut)) {
      nuevosErrores.rut = "El formato del RUT no es válido";
    }
    
    if (usuario.fechaNacimiento && !validarFechaNacimiento(usuario.fechaNacimiento)) {
      nuevosErrores.fechaNacimiento = "El usuario debe ser mayor de 18 años";
    }
    
    if (usuario.password && usuario.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (usuario.password !== confirmarPassword) {
      nuevosErrores.password = "Las contraseñas no coinciden";
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario para crear nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      alert("Por favor corrige los errores en el formulario.");
      return;
    }

    setCreando(true);

    try {
      console.log("Creando nuevo usuario:", usuario);
      const response = await crearUsuario(usuario);
      console.log("Usuario creado:", response.data);
      
      alert("Usuario creado correctamente.");
      navigate("/admin/clientes");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      
      if (error.response?.status === 400) {
        const mensajeError = error.response.data?.message || error.response.data;
        if (mensajeError.includes("email") || mensajeError.includes("correo")) {
          alert("El email ya está en uso. Intenta con otro.");
        } else if (mensajeError.includes("rut") || mensajeError.includes("RUT")) {
          alert("El RUT ya está registrado. Intenta con otro.");
        } else {
          alert(`${mensajeError}`);
        }
      } else {
        alert("No se pudo crear el usuario. Revisa los datos e intenta nuevamente.");
      }
    } finally {
      setCreando(false);
    }
  };

  // Función para limpiar completamente el formulario
  const limpiarFormulario = () => {
    setUsuario({
      username: "",
      apellidos: "",
      email: "",
      rut: "",
      password: "",
      role: "cliente",
      status: "activo",
      fechaNacimiento: "",
      region: "",
      comuna: "",
      direccion: ""
    });
    setConfirmarPassword("");
    setErrorPassword("");
    setErrores({});
  };

  // Función para formatear RUT chileno automáticamente
  const formatearRUT = (rut) => {
    if (!rut) return rut;
    
    // Remover formato existente
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length < 2) return rut;
    
    // Separar número y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toUpperCase();
    
    // Formatear con puntos y guión
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpoFormateado}-${dv}`;
  };

  // Manejar cambio específico en campo RUT con formato automático
  const handleRUTChange = (e) => {
    const rutFormateado = formatearRUT(e.target.value);
    setUsuario({ ...usuario, rut: rutFormateado });
    
    if (errores.rut) {
      setErrores(prev => ({ ...prev, rut: "" }));
    }
  };

  return (
    <div className="nuevo-usuario-container">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Crear Nuevo Usuario</h2>
          <small className="text-muted">
            Completa todos los campos obligatorios (*) para registrar un nuevo usuario
          </small>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/clientes")}
        >
          Volver al Listado
        </button>
      </header>

      <form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white">
        
        {/* Sección: Información Personal */}
        <div className="row g-3">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-4">
              Información Personal
              <small className="text-muted ms-2">(Todos los campos son obligatorios)</small>
            </h5>
          </div>

          {/* Campo: Nombre de usuario */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Nombre de usuario *
            </label>
            <input
              type="text"
              name="username"
              className={`form-control ${errores.username ? 'is-invalid' : ''}`}
              value={usuario.username}
              onChange={handleChange}
              placeholder="Ej: juanperez"
              maxLength="50"
              required
            />
            {errores.username && (
              <div className="invalid-feedback">{errores.username}</div>
            )}
            <div className="form-text">
              Máximo 50 caracteres
            </div>
          </div>

          {/* Campo: Apellidos */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Apellidos *
            </label>
            <input
              type="text"
              name="apellidos"
              className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
              value={usuario.apellidos}
              onChange={handleChange}
              placeholder="Ej: Pérez González"
              maxLength="100"
              required
            />
            {errores.apellidos && (
              <div className="invalid-feedback">{errores.apellidos}</div>
            )}
            <div className="form-text">
              Máximo 100 caracteres
            </div>
          </div>

          {/* Campo: Email */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="email"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              value={usuario.email}
              onChange={handleChange}
              placeholder="Ej: usuario@duoc.cl"
              required
            />
            {errores.email && (
              <div className="invalid-feedback">{errores.email}</div>
            )}
            <div className="form-text">
              Solo se permiten: @duoc.cl, @profesor.duoc.cl o @gmail.com
            </div>
          </div>

          {/* Campo: RUT */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              RUT *
            </label>
            <input
              type="text"
              name="rut"
              className={`form-control ${errores.rut ? 'is-invalid' : ''}`}
              value={usuario.rut}
              onChange={handleRUTChange}
              placeholder="Ej: 12.345.678-9"
              required
            />
            {errores.rut && (
              <div className="invalid-feedback">{errores.rut}</div>
            )}
            <div className="form-text">
              Formato chileno con puntos y guión. Se formatea automáticamente.
            </div>
          </div>

          {/* Campo: Fecha de Nacimiento */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              className={`form-control ${errores.fechaNacimiento ? 'is-invalid' : ''}`}
              value={usuario.fechaNacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errores.fechaNacimiento && (
              <div className="invalid-feedback">{errores.fechaNacimiento}</div>
            )}
            <div className="form-text">
              Opcional - Debe ser mayor de 18 años
            </div>
          </div>
        </div>

        {/* Sección: Ubicación Geográfica */}
        <div className="row g-3 mt-4">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-4">
              Ubicación
              <small className="text-muted ms-2">(Selecciona región y comuna)</small>
            </h5>
          </div>

          {/* Campo: Región */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Región *
            </label>
            <select
              name="region"
              className={`form-select ${errores.region ? 'is-invalid' : ''}`}
              value={usuario.region}
              onChange={handleChange}
              required
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
            {errores.region && (
              <div className="invalid-feedback">{errores.region}</div>
            )}
            {cargandoRegiones && (
              <div className="form-text">Cargando lista de regiones...</div>
            )}
          </div>

          {/* Campo: Comuna */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Comuna *
            </label>
            <select
              name="comuna"
              className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
              value={usuario.comuna}
              onChange={handleChange}
              required
              disabled={cargandoComunas || !usuario.region}
            >
              <option value="">
                {cargandoComunas 
                  ? "Cargando comunas..." 
                  : !usuario.region 
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
            {errores.comuna && (
              <div className="invalid-feedback">{errores.comuna}</div>
            )}
            {cargandoComunas && (
              <div className="form-text">Cargando comunas de {usuario.region}...</div>
            )}
            {usuario.region && comunas.length === 0 && !cargandoComunas && (
              <div className="form-text text-warning">
                No se encontraron comunas para esta región
              </div>
            )}
          </div>

          {/* Campo: Dirección */}
          <div className="col-12">
            <label className="form-label fw-semibold">
              Dirección *
            </label>
            <input
              type="text"
              name="direccion"
              className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
              value={usuario.direccion}
              onChange={handleChange}
              placeholder="Ej: Av. Principal #123, Depto 45"
              maxLength="300"
              required
            />
            {errores.direccion && (
              <div className="invalid-feedback">{errores.direccion}</div>
            )}
            <div className="form-text">
              Máximo 300 caracteres. Incluye calle, número, departamento, etc.
            </div>
          </div>
        </div>

        {/* Sección: Contraseña */}
        <div className="row g-3 mt-4">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-4">
              Contraseña
              <small className="text-muted ms-2">(La contraseña se encriptará automáticamente)</small>
            </h5>
          </div>

          {/* Campo: Contraseña principal */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              value={usuario.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              required
            />
            {errores.password && (
              <div className="invalid-feedback">{errores.password}</div>
            )}
            <div className="form-text">
              La contraseña se encriptará automáticamente en el servidor
            </div>
          </div>

          {/* Campo: Confirmación de contraseña */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repite la contraseña"
              minLength="6"
              required
            />
            {errores.password && (
              <div className="invalid-feedback">{errores.password}</div>
            )}
            <div className="form-text">
              Debe coincidir exactamente con la contraseña anterior
            </div>
          </div>
        </div>

        {/* Sección: Configuración del Usuario */}
        <div className="row g-3 mt-4">
          <div className="col-12">
            <h5 className="border-bottom pb-2 mb-4">
              Configuración del Usuario
              <small className="text-muted ms-2">(Define permisos y estado)</small>
            </h5>
          </div>

          {/* Campo: Rol del usuario */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Rol *
            </label>
            <select
              name="role"
              className="form-select"
              value={usuario.role}
              onChange={handleChange}
              required
            >
              <option value="cliente">Cliente (Solo compras y perfil personal)</option>
              <option value="vendedor">Vendedor (Gestionar productos y ver clientes)</option>
              <option value="administrador">Administrador (Acceso completo excepto eliminar)</option>
              <option value="super_admin">Super Admin (Acceso total al sistema)</option>
            </select>
            <div className="form-text mt-2">
              <strong>Cliente:</strong> Solo compras y perfil personal<br/>
              <strong>Vendedor:</strong> Gestionar productos y ver clientes<br/>
              <strong>Administrador:</strong> Acceso completo excepto eliminar<br/>
              <strong>Super Admin:</strong> Acceso total al sistema
            </div>
          </div>

          {/* Campo: Estado del usuario */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">
              Estado *
            </label>
            <select
              name="status"
              className="form-select"
              value={usuario.status}
              onChange={handleChange}
              required
            >
              <option value="activo">Activo (puede acceder al sistema)</option>
              <option value="inactivo">Inactivo (no puede acceder)</option>
            </select>
            <div className="form-text mt-2">
              <strong>Activo:</strong> Usuario puede iniciar sesión y usar el sistema<br/>
              <strong>Inactivo:</strong> Usuario no puede acceder al sistema
            </div>
          </div>
        </div>

        {/* Sección: Resumen del Usuario */}
        <div className="row g-3 mt-4">
          <div className="col-12">
            <div className="card border-info">
              <div className="card-header bg-info bg-opacity-10 d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Resumen del Usuario</h6>
                <span className={`badge ${Object.keys(errores).length === 0 ? 'bg-success' : 'bg-warning'}`}>
                  {Object.keys(errores).length === 0 ? 'Válido' : 'Revisar errores'}
                </span>
              </div>
              <div className="card-body">
                <div className="row small">
                  <div className="col-md-6">
                    <strong>Nombre:</strong> {usuario.username || "—"}<br/>
                    <strong>Apellidos:</strong> {usuario.apellidos || "—"}<br/>
                    <strong>Email:</strong> {usuario.email || "—"}<br/>
                    <strong>RUT:</strong> {usuario.rut || "—"}
                  </div>
                  <div className="col-md-6">
                    <strong>Ubicación:</strong> {usuario.comuna ? `${usuario.comuna}, ${usuario.region}` : "—"}<br/>
                    <strong>Rol:</strong> {usuario.role ? usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1) : "—"}<br/>
                    <strong>Estado:</strong> {usuario.status === 'activo' ? 'Activo' : 'Inactivo'}<br/>
                    <strong>Edad:</strong> {usuario.fechaNacimiento ? 
                      (() => {
                        const fechaNac = new Date(usuario.fechaNacimiento);
                        const hoy = new Date();
                        const edad = hoy.getFullYear() - fechaNac.getFullYear();
                        const mes = hoy.getMonth() - fechaNac.getMonth();
                        return (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) ? edad - 1 : edad;
                      })() + ' años' 
                      : "—"
                    }
                  </div>
                </div>
                
                {/* Mostrar errores de resumen */}
                {Object.keys(errores).length > 0 && (
                  <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
                    <small className="text-warning">
                      <strong>Errores a corregir:</strong>
                      <ul className="mb-0 mt-1">
                        {Object.entries(errores).map(([campo, mensaje]) => (
                          <li key={campo}>{mensaje}</li>
                        ))}
                      </ul>
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Botones de Acción */}
        <div className="d-flex justify-content-between mt-4 pt-3 border-top">
          <button 
            type="submit" 
            className="btn btn-success px-4"
            disabled={creando || Object.keys(errores).length > 0}
          >
            {creando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creando Usuario...
              </>
            ) : (
              "Crear Usuario"
            )}
          </button>
          
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={limpiarFormulario}
              disabled={creando}
            >
              Limpiar Todo
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigate("/admin/clientes")}
              disabled={creando}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}