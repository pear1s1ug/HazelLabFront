import { Outlet } from "react-router-dom";
import { Navbar } from "../componentes/Navbar/Navbar";
import { Footer } from "../componentes/Footer/Footer";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
