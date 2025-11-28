import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsuarios, eliminarUsuario } from "../../services/api";
import "./VistaClienteYProducto.css";

export function VistaClientes() {
  // Estados para gestión de datos y UI
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroRegion, setFiltroRegion] = useState("todos");

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10;

  // Obtener información del usuario logueado y permisos
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const esSuperAdmin = usuarioLogueado?.role?.toLowerCase() === "super_admin";
  const esVendedor = usuarioLogueado?.role?.toLowerCase() === "vendedor";

  // Efecto para cargar usuarios al montar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await getUsuarios();
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarUsuarios();
  }, []);

  // Filtrar usuarios basado en búsqueda y filtros aplicados
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.role?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.rut?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.region?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.comuna?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellidos?.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideRol =
      filtroRol === "todos" || usuario.role?.toLowerCase() === filtroRol;
    
    const coincideEstado =
      filtroEstado === "todos" || usuario.status?.toLowerCase() === filtroEstado;
    
    const coincideRegion =
      filtroRegion === "todos" || usuario.region === filtroRegion;

    return coincideBusqueda && coincideRol && coincideEstado && coincideRegion;
  });

  // Cálculos para paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(
    indiceInicio,
    indiceInicio + usuariosPorPagina
  );

  // Obtener valores únicos para filtros
  const rolesUnicos = [...new Set(usuarios.map((u) => u.role).filter(Boolean))];
  const regionesUnicas = [...new Set(usuarios.map((u) => u.region).filter(Boolean))];

  // Función para formatear fecha de nacimiento
  const formatearFechaNacimiento = (fecha) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString('es-CL');
    } catch (error) {
      return "—";
    }
  };

  // Función para eliminar usuario con confirmación
  const handleEliminar = async (id, username) => {
    if (!window.confirm(`¿Eliminar al usuario "${username}"?`)) return;
    try {
      setEliminando(id);
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el usuario.");
    } finally {
      setEliminando(null);
    }
  };

  // Estado de carga
  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p>Cargando usuarios...</p>
      </div>
    );

  return (
    <div className="vista-clientes-container">
      {/* Encabezado con título y botón de acción */}
      <header className="clientes-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Listado de Usuarios</h2>
          {esVendedor && (
            <small className="text-muted">
              Permisos de Vendedor: Solo edición
            </small>
          )}
          {esSuperAdmin && (
            <small className="text-muted">
              Permisos de Super Admin: Acceso completo
            </small>
          )}
        </div>
        <Link to="/admin/clientes/nuevo" className="btn btn-primary">
          Nuevo Usuario
        </Link>
      </header>

      {/* Sección de filtros y búsqueda */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Campo de búsqueda */}
            <div className="col-md-3">
              <label className="form-label small text-muted">
                Buscar usuarios
              </label>
              <div className="input-group">
                <span className="input-group-text">Buscar</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre, email, RUT, región..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>
            </div>

            {/* Filtro por rol */}
            <div className="col-md-2">
              <label className="form-label small text-muted">Rol</label>
              <select
                value={filtroRol}
                onChange={(e) => {
                  setFiltroRol(e.target.value);
                  setPaginaActual(1);
                }}
                className="form-select"
              >
                <option value="todos">Todos los roles</option>
                {rolesUnicos.map((rol) => (
                  <option key={rol} value={rol.toLowerCase()}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por región */}
            <div className="col-md-2">
              <label className="form-label small text-muted">Región</label>
              <select
                value={filtroRegion}
                onChange={(e) => {
                  setFiltroRegion(e.target.value);
                  setPaginaActual(1);
                }}
                className="form-select"
              >
                <option value="todos">Todas las regiones</option>
                {regionesUnicas.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div className="col-md-2">
              <label className="form-label small text-muted">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setPaginaActual(1);
                }}
                className="form-select"
              >
                <option value="todos">Todos</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>

            {/* Contador de resultados */}
            <div className="col-md-3">
              <label className="form-label small text-muted">Resultados</label>
              <div className="text-center p-2 border rounded bg-light">
                <strong className="text-primary">{usuariosFiltrados.length}</strong>
                <small className="text-muted d-block">
                  de {usuarios.length} usuarios
                </small>
              </div>
            </div>
          </div>

          {/* Botones de filtros rápidos */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button
              onClick={() => {
                setBusqueda("");
                setFiltroRol("todos");
                setFiltroEstado("todos");
                setFiltroRegion("todos");
                setPaginaActual(1);
              }}
              className="btn btn-sm btn-outline-secondary"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setFiltroEstado("activo")}
              className="btn btn-sm btn-outline-success"
            >
              Ver activos
            </button>
            <button
              onClick={() => setFiltroEstado("inactivo")}
              className="btn btn-sm btn-outline-danger"
            >
              Ver inactivos
            </button>
            <button
              onClick={() => setFiltroRegion("Metropolitana")}
              className="btn btn-sm btn-outline-info"
            >
              Región Metropolitana
            </button>
          </div>
        </div>
      </div>

      {/* Sección de tabla de usuarios */}
      <section className="usuarios-table-section">
        <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
          <table className="table table-bordered table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Apellidos</th>
                <th>RUT</th>
                <th>Email</th>
                <th>Fecha Nac.</th>
                <th>Región</th>
                <th>Comuna</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Carrito</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center text-muted py-4">
                    <div className="py-3">
                      <p className="mb-0 mt-2">No se encontraron usuarios</p>
                      <small>Intenta ajustar los filtros de búsqueda</small>
                    </div>
                  </td>
                </tr>
              ) : (
                usuariosPagina.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="badge bg-light text-dark">#{u.id}</span>
                    </td>
                    <td>
                      <div>
                        <strong>{u.username || "—"}</strong>
                      </div>
                    </td>
                    <td>{u.apellidos || "—"}</td>
                    <td>
                      <code>{u.rut || "—"}</code>
                    </td>
                    <td>
                      <a href={`mailto:${u.email}`} className="text-decoration-none">
                        {u.email}
                      </a>
                    </td>
                    <td>
                      {u.fechaNacimiento ? (
                        <div>
                          <span className="badge bg-light text-dark">
                            {formatearFechaNacimiento(u.fechaNacimiento)}
                          </span>
                          {(() => {
                            try {
                              const fechaNac = new Date(u.fechaNacimiento);
                              const hoy = new Date();
                              const edad = hoy.getFullYear() - fechaNac.getFullYear();
                              const mes = hoy.getMonth() - fechaNac.getMonth();
                              if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                                return edad - 1;
                              }
                              return edad;
                            } catch (e) {
                              return "?";
                            }
                          })() > 0 && (
                            <small className="d-block text-muted mt-1">
                              Edad: {(() => {
                                try {
                                  const fechaNac = new Date(u.fechaNacimiento);
                                  const hoy = new Date();
                                  const edad = hoy.getFullYear() - fechaNac.getFullYear();
                                  const mes = hoy.getMonth() - fechaNac.getMonth();
                                  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                                    return edad - 1;
                                  }
                                  return edad;
                                } catch (e) {
                                  return "?";
                                }
                              })()} años
                            </small>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {u.region ? (
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                          {u.region}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {u.comuna ? (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary">
                          {u.comuna}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span 
                        className={`badge ${
                          u.role === "super_admin" ? "bg-danger" :
                          u.role === "administrador" ? "bg-warning" :
                          u.role === "vendedor" ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.status === "activo" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <small>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("es-CL")
                          : "—"}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${u.itemsCarrito?.length > 0 ? 'bg-warning' : 'bg-light text-dark'}`}>
                        {u.itemsCarrito?.length || 0}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Link
                          to={`/admin/clientes/editar/${u.id}`}
                          className="btn btn-sm btn-outline-success"
                          title="Editar usuario"
                        >
                          Editar
                        </Link>
                        {esSuperAdmin ? (
                          <button
                            onClick={() =>
                              handleEliminar(u.id, u.username || u.email)
                            }
                            className="btn btn-sm btn-outline-danger"
                            disabled={eliminando === u.id}
                            title="Eliminar usuario"
                          >
                            {eliminando === u.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              "Eliminar"
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                            title="Sin permisos para eliminar"
                          >
                            No Permitido
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección de paginación */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <small className="text-muted">
            Mostrando {indiceInicio + 1}-
            {Math.min(indiceInicio + usuariosPorPagina, usuariosFiltrados.length)}{" "}
            de {usuariosFiltrados.length} usuarios
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual((p) => p - 1)}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  paginaActual === totalPaginas ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaActual((p) => p + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}