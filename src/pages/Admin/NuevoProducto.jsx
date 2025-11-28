import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearProducto, getCategorias } from "../../services/api";
import "./VistaClienteYProducto.css";

export function NuevoProducto() {
  const navigate = useNavigate();
  
  // Estado para almacenar la lista de categorías disponibles
  const [categorias, setCategorias] = useState([]);
  
  // Estado inicial para el nuevo producto con valores por defecto
  const [producto, setProducto] = useState({
    name: "",
    batchCode: "",
    description: "",
    chemCode: "",
    expDate: "",
    elabDate: "",
    cost: 0,
    stock: 0,
    stockCritico: 0,
    proveedor: "",
    category: { id: "" },
    image: "",
    activeStatus: true,
    destacado: false,
  });

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await getCategorias();
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto({
      ...producto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Manejar envío del formulario para crear nuevo producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearProducto(producto);
      alert("Producto creado correctamente.");
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al crear producto:", error);
      alert("No se pudo crear el producto.");
    }
  };

  return (
    <div className="nuevo-producto-container">
      <h2 className="fw-bold mb-4">Crear Nuevo Producto</h2>

      <form onSubmit={handleSubmit} className="shadow-sm p-4 rounded bg-white">
        
        {/* Campo: Nombre del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={producto.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sección: Códigos del producto */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Código de Lote</label>
            <input
              type="text"
              name="batchCode"
              className="form-control"
              value={producto.batchCode}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Código Químico</label>
            <input
              type="text"
              name="chemCode"
              className="form-control"
              value={producto.chemCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Campo: Descripción del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={producto.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Sección: Fechas importantes */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Fecha de Elaboración</label>
            <input
              type="date"
              name="elabDate"
              className="form-control"
              value={producto.elabDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Fecha de Vencimiento</label>
            <input
              type="date"
              name="expDate"
              className="form-control"
              value={producto.expDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sección: Información de costos y stock */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Costo (CLP)</label>
            <input
              type="number"
              name="cost"
              className="form-control"
              value={producto.cost}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              value={producto.stock}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Stock Crítico</label>
            <input
              type="number"
              name="stockCritico"
              className="form-control"
              value={producto.stockCritico}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Campo: Proveedor del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Proveedor</label>
          <input
            type="text"
            name="proveedor"
            className="form-control"
            value={producto.proveedor}
            onChange={handleChange}
          />
        </div>

        {/* Campo: Selección de categoría */}
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

        {/* Campo: URL de imagen del producto */}
        <div className="mb-3">
          <label className="form-label fw-semibold">URL Imagen</label>
          <input
            type="text"
            name="image"
            className="form-control"
            value={producto.image}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox: Estado activo/inactivo del producto */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="activeStatus"
            checked={producto.activeStatus}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Activo</label>
        </div>

        {/* Checkbox: Producto destacado */}
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            name="destacado"
            checked={producto.destacado}
            onChange={handleChange}
          />
          <label className="form-check-label fw-semibold">Destacado</label>
        </div>

        {/* Sección: Botones de acción */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success px-4">
            Crear Producto
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