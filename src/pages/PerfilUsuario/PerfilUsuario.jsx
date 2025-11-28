import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBoletasPorUsuario } from "../../services/api";
import "./PerfilUsuario.css";

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const fmt = new Intl.NumberFormat("es-CL", { 
    style: "currency", 
    currency: "CLP" 
  });

  useEffect(() => {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioLogueado || !token) {
      navigate("/login");
      return;
    }
    
    setUsuario(usuarioLogueado);
    cargarHistorial(usuarioLogueado.id);
  }, [navigate, token]);

  const cargarHistorial = async (usuarioId) => {
    try {
      const response = await getBoletasPorUsuario(usuarioId);
      setBoletas(response.data || []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      PAGADA: "bg-success",
      PENDIENTE: "bg-warning", 
      ANULADA: "bg-danger"
    };
    return <span className={`badge ${estados[estado] || "bg-secondary"}`}>{estado}</span>;
  };

  if (loading) {
    return (
      <main className="container my-5">
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tu perfil...</p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning text-center">
          <p>Debes iniciar sesión para ver tu perfil</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container my-5">
      {/* Header del Perfil */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4">
              <div className="avatar-placeholder mb-3">
                {usuario.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="mb-1">{usuario.username}</h3>
              <p className="text-muted mb-2">{usuario.email}</p>
              <span className={`badge ${
                usuario.role === 'super_admin' ? 'bg-danger' :
                usuario.role === 'administrador' ? 'bg-warning' :
                usuario.role === 'vendedor' ? 'bg-primary' : 'bg-secondary'
              }`}>
                {usuario.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Información del Usuario */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">👤 Información Personal</h5>
            </div>
            <div className="card-body">
              <div className="user-info">
                <p><strong>Nombre:</strong> {usuario.username}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>RUT:</strong> {usuario.rut}</p>
                {usuario.apellidos && <p><strong>Apellidos:</strong> {usuario.apellidos}</p>}
                
                {usuario.region && (
                  <>
                    <hr />
                    <h6 className="text-muted">📍 Dirección</h6>
                    <p><strong>Región:</strong> {usuario.region}</p>
                    <p><strong>Comuna:</strong> {usuario.comuna}</p>
                    <p><strong>Dirección:</strong> {usuario.direccion}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Compras */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Historial de Compras</h5>
              <span className="badge bg-primary">{boletas.length} compras</span>
            </div>
            <div className="card-body">
              {boletas.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-state">
                    <div className="empty-icon mb-3">🛒</div>
                    <h5 className="text-muted">Aún no tienes compras</h5>
                    <p className="text-muted mb-3">Realiza tu primera compra para ver tu historial aquí</p>
                    <Link to="/productos" className="btn btn-primary">
                      Comprar Productos
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>N° Boleta</th>
                        <th>Fecha</th>
                        <th>Método Pago</th>
                        <th>Envío</th>
                        <th>Estado</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boletas.map((boleta) => (
                        <tr key={boleta.id} className="align-middle">
                          <td>
                            <strong>{boleta.numeroBoleta}</strong>
                          </td>
                          <td>
                            <small>{formatearFecha(boleta.fechaEmision)}</small>
                          </td>
                          <td>{boleta.metodoPago}</td>
                          <td>{boleta.metodoEnvio}</td>
                          <td>{getEstadoBadge(boleta.estado)}</td>
                          <td>
                            <strong style={{ color: "#587042" }}>
                              {fmt.format(boleta.total)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}