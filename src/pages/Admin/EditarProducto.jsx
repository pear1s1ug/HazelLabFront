import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductos, getCategorias, actualizarProducto, subirImagen } from "../../services/api";
import "./VistaClienteYProducto.css";

export function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para manejar el producto, categorías y estados de carga
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  // Efecto para cargar los datos del producto y las categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar productos y categorías en paralelo
        const [productosRes, categoriasRes] = await Promise.all([
          getProductos(),
          getCategorias(),
        ]);

        // Buscar el producto específico por ID
        const productoEncontrado = productosRes.data.find((p) => p.id === parseInt(id));
        setProducto(productoEncontrado || {});
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        alert("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Función para subir imagen desde el input de archivo
  const handleSubirImagen = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    // Validaciones del archivo
    if (!archivo.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPEG, PNG, etc).');
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    try {
      setSubiendoImagen(true);
      
      console.log(`Subiendo imagen para producto ${id}...`);
      const imageUrl = await subirImagen(archivo);
      console.log(`Imagen subida: ${imageUrl}`);
      
      // Actualizar el estado del producto con la nueva URL
      setProducto(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      alert('¡Imagen subida correctamente! Se guardará cuando envíes el formulario.');
      
    } catch (error) {
      console.error('Error detallado:', error);
      
      // Mensajes de error específicos
      if (error.message.includes('Cloudinary no está configurado')) {
        alert('Cloudinary no está configurado. Revisa la configuración en api.js');
      } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
        alert('Error de conexión. Verifica tu internet.');
      } else {
        alert(`Error al subir la imagen: ${error.message}`);
      }
    } finally {
      setSubiendoImagen(false);
      // Limpiar el input file
      event.target.value = '';
    }
  };

  // Función para eliminar la imagen del producto
  const handleEliminarImagen = () => {
    if (!producto.image) return;
    
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar la imagen del producto?'
    );
    
    if (confirmar) {
      setProducto(prev => ({
        ...prev,
        image: ""
      }));
      alert('Imagen eliminada. Se guardará cuando envíes el formulario.');
    }
  };

  // Función para guardar los cambios del producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(id, producto);
      alert("Producto actualizado correctamente.");
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  // Estados de carga y error
  if (loading) return <p className="text-center mt-5">Cargando producto...</p>;
  if (!producto) return <p className="text-center mt-5">Producto no encontrado.</p>;

  return (
    <div className="editar-producto-container">
      <h2 className="fw-bold mb-4">Editar Producto</h2>

      <form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white">

        {/* Sección: ID del producto (solo lectura) */}
        <div className="mb-3">
          <label className="form-label fw-semibold">ID del Producto</label>
          <input
            type="text"
            name="id"
            className="form-control"
            value={producto.id || ""}
            readOnly
          />
        </div>

        {/* Sección: Nombre del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={producto.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sección: Gestión de imágenes */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Imagen del Producto</label>
          
          {/* Preview de la imagen actual */}
          <div className="image-section mb-3">
            {producto.image ? (
              <div className="image-preview-container position-relative">
                <img
                  src={producto.image}
                  alt="Preview del producto"
                  className="img-thumbnail"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = '/wooden.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={handleEliminarImagen}
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  title="Eliminar imagen"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <div className="text-center py-4 border rounded bg-light">
                <p className="text-muted mb-3">No hay imagen</p>
              </div>
            )}
          </div>

          {/* Botones de gestión de imágenes */}
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="file"
              id="subir-imagen"
              accept="image/*"
              onChange={handleSubirImagen}
              className="d-none"
            />
            <label
              htmlFor="subir-imagen"
              className={`btn ${producto.image ? 'btn-outline-primary' : 'btn-primary'}`}
              disabled={subiendoImagen}
            >
              {subiendoImagen ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Subiendo...
                </>
              ) : producto.image ? (
                "Cambiar Imagen"
              ) : (
                "Subir Imagen"
              )}
            </label>
            
            {producto.image && (
              <a 
                href={producto.image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-secondary"
              >
                Ver Imagen
              </a>
            )}
          </div>
          
          {/* Campo para URL de imagen (como respaldo) */}
          <div className="mt-3">
            <label className="form-label small text-muted">URL de la imagen (opcional)</label>
            <input
              type="text"
              name="image"
              className="form-control form-control-sm"
              value={producto.image || ""}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <div className="form-text">
              Puedes pegar una URL directa o usar el botón de arriba para subir una imagen.
            </div>
          </div>
        </div>

        {/* Sección: Código de lote */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Código de Lote</label>
          <input
            type="text"
            name="batchCode"
            className="form-control"
            value={producto.batchCode || ""}
            onChange={handleChange}
          />
        </div>

        {/* Sección: Descripción del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={producto.description || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Sección: Código químico */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Código Químico</label>
          <input
            type="text"
            name="chemCode"
            className="form-control"
            value={producto.chemCode || ""}
            onChange={handleChange}
          />
        </div>

        {/* Sección: Fechas de elaboración y vencimiento */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Fecha de Elaboración</label>
            <input
              type="date"
              name="elabDate"
              className="form-control"
              value={producto.elabDate ? producto.elabDate.substring(0, 10) : ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Fecha de Vencimiento</label>
            <input
              type="date"
              name="expDate"
              className="form-control"
              value={producto.expDate ? producto.expDate.substring(0, 10) : ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sección: Costos y gestión de stock */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Costo (CLP)</label>
            <input
              type="number"
              name="cost"
              className="form-control"
              value={producto.cost || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={producto.stock || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Stock Crítico</label>
            <input
              type="number"
              name="stockCritico"
              className="form-control"
              value={producto.stockCritico || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sección: Proveedor */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Proveedor</label>
          <input
            type="text"
            name="proveedor"
            className="form-control"
            value={producto.proveedor || ""}
            onChange={handleChange}
          />
        </div>

        {/* Sección: Selección de categoría */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Categoría</label>
          <select
            name="category"
            className="form-select"
            value={producto.category?.id || ""}
            onChange={(e) =>
              setProducto({
                ...producto,
                category: { id: e.target.value },
              })
            }
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Sección: Estados del producto (activo y destacado) */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="activeStatus"
            checked={producto.activeStatus || false}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Activo</label>
        </div>

        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            name="destacado"
            checked={producto.destacado || false}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Destacado</label>
        </div>

        {/* Sección: Fecha de creación (solo lectura) */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Fecha de Creación</label>
          <input
            type="text"
            className="form-control"
            value={
              producto.creationDate
                ? new Date(producto.creationDate).toLocaleString("es-CL")
                : "—"
            }
            readOnly
          />
        </div>

        {/* Sección: Botones de acción */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success px-4">
            Guardar Cambios
          </button>
          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/admin/productos")}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}