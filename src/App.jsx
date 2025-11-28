import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

/* ===== Layouts ===== */
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";

/* ===== Páginas públicas ===== */
import { Home } from "./pages/Home/Home";
import { Nosotros } from "./pages/Nosotros/Nosotros";
import { Blogs } from "./pages/Blogs/Blogs";
import { Blog1 } from "./pages/Blogs/Blog1";
import { Blog2 } from "./pages/Blogs/Blog2";
import { Contacto } from "./pages/Contacto/Contacto";
import { Productos } from "./pages/Productos/Productos";
import { DetalleProducto } from "./pages/Productos/DetalleProducto";
import { Login } from "./pages/InicioSesion/Login";
import { Registro } from "./pages/Registro/Registro";
import { Carrito } from "./pages/Carrito/Carrito";
import Checkout from "./pages/Carrito/checkout"; 
import ConfirmacionBoleta from "./pages/Carrito/ConfirmacionBoleta";
import PerfilUsuario from "./pages/PerfilUsuario/PerfilUsuario";

/* ===== Páginas del panel admin ===== */
import { Dashboard } from "./pages/Admin/Dashboard";
import { MenuAdmin } from "./pages/Admin/MenuAdmin";
import { VistaClientes } from "./pages/Admin/VistaClientes";
import { VistaProductos } from "./pages/Admin/VistaProductos";
import { EditarUsuario } from "./pages/Admin/EditarUsuario";
import { EditarProducto } from "./pages/Admin/EditarProducto";
import { NuevoUsuario } from "./pages/Admin/NuevoUsuario";
import { NuevoProducto } from "./pages/Admin/NuevoProducto";
import VentasAdmin from "./pages/Admin/VentasAdmin";
import DetalleVentaAdmin from "./pages/Admin/DetalleVentaAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== LAYOUT PRINCIPAL ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/1" element={<Blog1 />} />
          <Route path="/blogs/2" element={<Blog2 />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/detalle-producto/:id" element={<DetalleProducto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/confirmacion-boleta" element={<ConfirmacionBoleta />} />
          <Route path="/mi-perfil" element={<PerfilUsuario />} />
        </Route>

        {/* ===== LAYOUT ADMIN ===== */}
        <Route element={<AdminLayout />}>
          {/* --- Dashboard principal --- */}
          <Route path="/admin" element={<Dashboard />} />

          {/* --- Página principal del admin (legacy) --- */}
          <Route path="/admin/menu" element={<MenuAdmin />} />

          {/* --- Usuarios --- */}
          <Route path="/admin/clientes" element={<VistaClientes />} />
          <Route path="/admin/clientes/nuevo" element={<NuevoUsuario />} />
          <Route path="/admin/clientes/editar/:id" element={<EditarUsuario />} />

          {/* --- Productos --- */}
          <Route path="/admin/productos" element={<VistaProductos />} />
          <Route path="/admin/productos/nuevo" element={<NuevoProducto />} />
          <Route path="/admin/productos/editar/:id" element={<EditarProducto />} />

          {/* --- HISTORIAL DE VENTAS (BOLETAS) --- */}
          <Route path="/admin/ventas" element={<VentasAdmin />} />
          <Route path="/admin/ventas/:numeroBoleta" element={<DetalleVentaAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;