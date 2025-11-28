import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../componentes/AdminSidebar/AdminSidebar";
import "./AdminLayout.css";

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header mb-4">
          <h2 className="fw-bold">Panel de Administración</h2>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
