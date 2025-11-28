import { useState, useEffect } from "react";
import { getCategorias, getRegiones } from "../../services/api";
import "./FiltrosAvanzados.css";

export function FiltrosAvanzados({ tipo, onFiltrosChange, initialFiltros = {} }) {
  // Estados para gestionar filtros, datos y visibilidad
  const [filtros, setFiltros] = useState(initialFiltros);
  const [categorias, setCategorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Efecto para cargar datos según el tipo de filtro (productos o usuarios)
  useEffect(() => {
    if (tipo === 'productos') {
      // Cargar categorías para filtros de productos
      getCategorias().then(res => setCategorias(res.data));
    } else if (tipo === 'usuarios') {
      // Cargar regiones para filtros de usuarios
      getRegiones().then(res => setRegiones(res.data));
    }
  }, [tipo]);

  // Manejar cambios en los filtros individuales
  const handleFiltroChange = (key, value) => {
    const nuevosFiltros = { ...filtros, [key]: value };
    setFiltros(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  // Limpiar todos los filtros aplicados
  const limpiarFiltros = () => {
    const filtrosLimpios = {};
    setFiltros(filtrosLimpios);
    onFiltrosChange(filtrosLimpios);
  };

  return (
    <div className="filtros-avanzados">
      {/* Encabezado con botones de control de filtros */}
      <div className="filtros-header">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros Avanzados'}
        </button>
        
        {/* Botón para limpiar filtros (solo visible cuando hay filtros activos) */}
        {Object.keys(filtros).length > 0 && (
          <button 
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Panel de filtros avanzados (se muestra/oculta dinámicamente) */}
      {mostrarFiltros && (
        <div className="filtros-body mt-3 p-3 border rounded bg-light">
          <div className="row g-3">
            
            {/* Filtros específicos para productos */}
            {tipo === 'productos' && (
              <>
                {/* Filtro por nombre del producto */}
                <div className="col-md-4">
                  <label className="form-label small">Nombre</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar por nombre..."
                    value={filtros.nombre || ''}
                    onChange={(e) => handleFiltroChange('nombre', e.target.value)}
                  />
                </div>
                
                {/* Filtro por categoría */}
                <div className="col-md-3">
                  <label className="form-label small">Categoría</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtros.categoriaId || ''}
                    onChange={(e) => handleFiltroChange('categoriaId', e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                
                {/* Filtro por estado activo/inactivo */}
                <div className="col-md-2">
                  <label className="form-label small">Estado</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtros.activo ?? ''}
                    onChange={(e) => handleFiltroChange('activo', e.target.value === '' ? undefined : e.target.value === 'true')}
                  >
                    <option value="">Todos</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                  </select>
                </div>
                
                {/* Filtro por rango de precios */}
                <div className="col-md-3">
                  <label className="form-label small">Precio</label>
                  <div className="row g-1">
                    <div className="col">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Mín"
                        value={filtros.precioMin || ''}
                        onChange={(e) => handleFiltroChange('precioMin', e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Máx"
                        value={filtros.precioMax || ''}
                        onChange={(e) => handleFiltroChange('precioMax', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Filtros por checkboxes (stock bajo y productos destacados) */}
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="stockBajo"
                      checked={filtros.stockBajo || false}
                      onChange={(e) => handleFiltroChange('stockBajo', e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="stockBajo">
                      Solo stock bajo
                    </label>
                  </div>
                  
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="destacado"
                      checked={filtros.destacado || false}
                      onChange={(e) => handleFiltroChange('destacado', e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="destacado">
                      Solo destacados
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Filtros específicos para usuarios */}
            {tipo === 'usuarios' && (
              <>
                {/* Filtro por nombre de usuario */}
                <div className="col-md-3">
                  <label className="form-label small">Usuario</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar usuario..."
                    value={filtros.username || ''}
                    onChange={(e) => handleFiltroChange('username', e.target.value)}
                  />
                </div>
                
                {/* Filtro por email */}
                <div className="col-md-3">
                  <label className="form-label small">Email</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar email..."
                    value={filtros.email || ''}
                    onChange={(e) => handleFiltroChange('email', e.target.value)}
                  />
                </div>
                
                {/* Filtro por rol del usuario */}
                <div className="col-md-2">
                  <label className="form-label small">Rol</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtros.rol || ''}
                    onChange={(e) => handleFiltroChange('rol', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                
                {/* Filtro por estado del usuario */}
                <div className="col-md-2">
                  <label className="form-label small">Estado</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtros.estado || ''}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                
                {/* Filtro por región geográfica */}
                <div className="col-md-2">
                  <label className="form-label small">Región</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtros.region || ''}
                    onChange={(e) => handleFiltroChange('region', e.target.value)}
                  >
                    <option value="">Todas</option>
                    {regiones.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}