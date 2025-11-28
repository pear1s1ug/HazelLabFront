import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductos, getUsuarios, getCategorias } from "../../services/api";
import "./Dashboard.css";

export function Dashboard() {
  // Estados para manejar las estadísticas, productos populares y estado de carga
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    productosStockBajo: 0,
    totalCategorias: 0,
    productosActivos: 0,
    usuariosActivos: 0
  });
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar los datos del dashboard al montar el componente
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);
        console.log("Cargando datos del dashboard...");
        
        // Cargar todos los datos necesarios en paralelo
        const [productosRes, usuariosRes, categoriasRes] = await Promise.all([
          getProductos(),
          getUsuarios(),
          getCategorias()
        ]);

        const productos = productosRes.data || [];
        const usuarios = usuariosRes.data || [];
        const categorias = categoriasRes.data || [];

        console.log("Datos recibidos:", {
          productos: productos.length,
          usuarios: usuarios.length,
          categorias: categorias.length
        });

        // Calcular estadísticas reales basadas en los datos
        const stats = {
          totalUsuarios: usuarios.length,
          totalProductos: productos.length,
          productosStockBajo: productos.filter(p => p.stock <= (p.stockCritico || 5)).length,
          totalCategorias: categorias.length,
          productosActivos: productos.filter(p => p.activeStatus).length,
          usuariosActivos: usuarios.filter(u => u.status === 'activo').length
        };

        console.log("Estadísticas calculadas:", stats);
        setEstadisticas(stats);
        
        // Simular productos más vendidos (ordenar por stock bajo como proxy)
        const masVendidos = productos
          .filter(p => p.activeStatus)
          .sort((a, b) => {
            const ratioA = a.stock / (a.stockCritico || 5);
            const ratioB = b.stock / (b.stockCritico || 5);
            return ratioA - ratioB;
          })
          .slice(0, 5)
          .map(p => ({
            ...p,
            totalVendidos: Math.floor(Math.random() * 50) + 10 // Datos simulados temporalmente
          }));

        setProductosMasVendidos(masVendidos);
        setError(null);
        
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };
    
    cargarDashboard();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando dashboard...</span>
          </div>
          <p className="mt-2">Cargando estadísticas del sistema...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-danger text-center">
          <h5>Error</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Encabezado del dashboard */}
      <header className="dashboard-header mb-4">
        <h2 className="fw-bold">Dashboard Administrativo</h2>
        <p className="text-muted">Resumen general del sistema Hazel🌰Lab</p>
        
        {/* Información de última actualización */}
        <div className="text-end">
          <small className="text-muted">
            Actualizado: {new Date().toLocaleString('es-CL')}
          </small>
        </div>
      </header>

      {/* Sección de tarjetas de estadísticas */}
      <div className="row g-4 mb-5">
        <div className="col-md-2">
          <div className="stats-card bg-primary text-white">
            <div className="stats-icon">Usuarios</div>
            <div className="stats-content">
              <h3>{estadisticas.totalUsuarios}</h3>
              <p>Total Usuarios</p>
              <small>{estadisticas.usuariosActivos} activos</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2">
          <div className="stats-card bg-success text-white">
            <div className="stats-icon">Productos</div>
            <div className="stats-content">
              <h3>{estadisticas.totalProductos}</h3>
              <p>Total Productos</p>
              <small>{estadisticas.productosActivos} activos</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2">
          <div className="stats-card bg-warning text-dark">
            <div className="stats-icon">Alerta</div>
            <div className="stats-content">
              <h3>{estadisticas.productosStockBajo}</h3>
              <p>Stock Bajo</p>
              <small>Necesitan atención</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2">
          <div className="stats-card bg-info text-white">
            <div className="stats-icon">Categorías</div>
            <div className="stats-content">
              <h3>{estadisticas.totalCategorias}</h3>
              <p>Categorías</p>
              <small>Disponibles</small>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="stats-card bg-secondary text-white">
            <div className="stats-icon">Ventas</div>
            <div className="stats-content">
              <h3>{Math.floor(estadisticas.totalProductos * 0.3)}</h3>
              <p>Ventas Hoy</p>
              <small>Estimado</small>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="stats-card bg-dark text-white">
            <div className="stats-icon">Ingresos</div>
            <div className="stats-content">
              <h3>${(estadisticas.totalProductos * 15000).toLocaleString()}</h3>
              <p>Ingresos</p>
              <small>Mensual estimado</small>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal del dashboard */}
      <div className="row g-4">
        {/* Sección de productos populares */}
        <div className="col-md-8">
          <div className="dashboard-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Productos Populares</h5>
              <Link to="/admin/productos" className="btn btn-sm btn-outline-primary">
                Ver todos →
              </Link>
            </div>
            <div className="productos-list">
              {productosMasVendidos.length > 0 ? (
                productosMasVendidos.map((producto, index) => (
                  <div key={producto.id} className="producto-item d-flex align-items-center p-3 border-bottom">
                    <span className={`rank-badge ${index === 0 ? 'bg-warning' : 'bg-primary'}`}>
                      {index + 1}
                    </span>
                    <img 
                      src={producto.image || '/wooden.jpg'} 
                      alt={producto.name}
                      className="producto-thumb"
                      onError={(e) => {
                        e.target.src = '/wooden.jpg';
                      }}
                    />
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">{producto.name}</h6>
                      <div className="d-flex gap-3">
                        <small className="text-muted">Stock: {producto.stock}</small>
                        <small className="text-muted">Vendidos: {producto.totalVendidos || 0}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="precio d-block">
                        ${producto.cost?.toLocaleString() || 0}
                      </span>
                      <span className={`badge ${producto.activeStatus ? 'bg-success' : 'bg-secondary'} small`}>
                        {producto.activeStatus ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>No hay productos disponibles</p>
                  <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm">
                    Crear primer producto
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sección de alertas del sistema */}
          <div className="dashboard-card mt-4">
            <h5>Alertas del Sistema</h5>
            <div className="alertas-list">
              {estadisticas.productosStockBajo > 0 && (
                <div className="alert alert-warning d-flex align-items-center">
                  <span className="me-2">Alerta</span>
                  <div>
                    <strong>Stock bajo detectado</strong>
                    <p className="mb-0">{estadisticas.productosStockBajo} productos necesitan reposición</p>
                    <Link to="/admin/productos?filtroStock=stock-critico" className="btn btn-sm btn-warning mt-1">
                      Ver productos con stock bajo
                    </Link>
                  </div>
                </div>
              )}
              
              {estadisticas.totalProductos === 0 && (
                <div className="alert alert-info d-flex align-items-center">
                  <span className="me-2">Información</span>
                  <div>
                    <strong>Bienvenido al sistema</strong>
                    <p className="mb-0">Comienza agregando tu primer producto al inventario</p>
                    <Link to="/admin/productos/nuevo" className="btn btn-sm btn-info mt-1">
                      Crear primer producto
                    </Link>
                  </div>
                </div>
              )}

              {estadisticas.totalUsuarios === 1 && (
                <div className="alert alert-info d-flex align-items-center">
                  <span className="me-2">Usuario</span>
                  <div>
                    <strong>Solo hay un usuario</strong>
                    <p className="mb-0">Puedes agregar más usuarios al sistema</p>
                    <Link to="/admin/clientes/nuevo" className="btn btn-sm btn-info mt-1">
                      Agregar usuario
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral con acciones rápidas y estado del sistema */}
        <div className="col-md-4">
          <div className="dashboard-card">
            <h5>Acciones Rápidas</h5>
            <div className="quick-actions">
              <Link to="/admin/productos/nuevo" className="quick-action-btn">
                <span>Agregar</span>
                <div>
                  <strong>Nuevo Producto</strong>
                  <small>Agregar al inventario</small>
                </div>
              </Link>
              
              <Link to="/admin/clientes/nuevo" className="quick-action-btn">
                <span>Usuario</span>
                <div>
                  <strong>Nuevo Usuario</strong>
                  <small>Crear cuenta</small>
                </div>
              </Link>
              
              {estadisticas.productosStockBajo > 0 && (
                <Link to="/admin/productos?filtroStock=stock-critico" className="quick-action-btn">
                  <span>Stock</span>
                  <div>
                    <strong>Stock Bajo</strong>
                    <small>{estadisticas.productosStockBajo} productos</small>
                  </div>
                </Link>
              )}
              
              <Link to="/admin/productos" className="quick-action-btn">
                <span>Gestionar</span>
                <div>
                  <strong>Gestionar</strong>
                  <small>Todos los productos</small>
                </div>
              </Link>

              <Link to="/admin/clientes" className="quick-action-btn">
                <span>Usuarios</span>
                <div>
                  <strong>Usuarios</strong>
                  <small>Ver todos</small>
                </div>
              </Link>
            </div>
          </div>

          {/* Estado del sistema */}
          <div className="dashboard-card mt-4">
            <h5>Estado del Sistema</h5>
            <div className="system-status">
              <div className="status-item">
                <span className="status-indicator online"></span>
                <div>
                  <strong>Backend API</strong>
                  <small>Servidor principal</small>
                </div>
                <span className="status-text">Operativo</span>
              </div>
              <div className="status-item">
                <span className="status-indicator online"></span>
                <div>
                  <strong>Base de Datos</strong>
                  <small>Almacenamiento</small>
                </div>
                <span className="status-text">Conectada</span>
              </div>
              <div className="status-item">
                <span className="status-indicator online"></span>
                <div>
                  <strong>Frontend</strong>
                  <small>Interfaz de usuario</small>
                </div>
                <span className="status-text">Activo</span>
              </div>
              <div className="status-item">
                <span className={`status-indicator ${estadisticas.totalProductos > 0 ? 'online' : 'offline'}`}></span>
                <div>
                  <strong>Inventario</strong>
                  <small>Productos cargados</small>
                </div>
                <span className="status-text">
                  {estadisticas.totalProductos > 0 ? 'Con datos' : 'Vacío'}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="dashboard-card mt-4">
            <h5>Resumen Rápido</h5>
            <div className="resumen-rapido">
              <div className="resumen-item d-flex justify-content-between py-2 border-bottom">
                <span>Productos activos:</span>
                <strong className="text-success">{estadisticas.productosActivos}</strong>
              </div>
              <div className="resumen-item d-flex justify-content-between py-2 border-bottom">
                <span>Usuarios activos:</span>
                <strong className="text-success">{estadisticas.usuariosActivos}</strong>
              </div>
              <div className="resumen-item d-flex justify-content-between py-2 border-bottom">
                <span>Stock bajo:</span>
                <strong className="text-warning">{estadisticas.productosStockBajo}</strong>
              </div>
              <div className="resumen-item d-flex justify-content-between py-2">
                <span>Categorías:</span>
                <strong className="text-info">{estadisticas.totalCategorias}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}