import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

// Mock de react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock de la API
vi.mock("../../services/api", () => ({
  getItemsCarritoPorUsuario: vi.fn(() => Promise.resolve({ data: [] })),
}));

// Importar useNavigate después del mock
import { useNavigate } from "react-router-dom";
import { getItemsCarritoPorUsuario } from "../../services/api";

describe("Navbar", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Configurar mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    
    // Limpiar localStorage
    localStorage.clear();
    vi.clearAllMocks();
    
    // Mock de alert
    window.alert = vi.fn();
    
    // Mock de console.error para evitar ruido en los tests
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza sin usuario", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Hazel🌰Lab")).toBeInTheDocument();
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
  });

  it("renderiza con usuario cliente", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("👤 testuser")).toBeInTheDocument();
    expect(screen.getByText("🛒 Carrito")).toBeInTheDocument();
  });

  it("muestra Dashboard Admin para administradores", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "admin", 
      role: "administrador"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Dashboard Admin")).toBeInTheDocument();
  });

  it("cierra sesión correctamente", async () => {
    // Configurar localStorage con usuario
    const usuario = {
      id: 1,
      username: "testuser",
      role: "cliente"
    };
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    let navbarComponent;
    
    await act(async () => {
      const { container } = render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      navbarComponent = container;
    });

    // Esperar a que el componente se renderice con el usuario
    await waitFor(() => {
      expect(screen.getByText("👤 testuser")).toBeInTheDocument();
    });

    // Encontrar y hacer clic en el botón de cerrar sesión directamente
    // Primero necesitamos simular que el dropdown está abierto
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.style.display = 'block';
    }

    const logoutButton = screen.getByText("🚪 Cerrar Sesión");
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    // Verificar que se limpió el localStorage
    expect(localStorage.getItem("usuarioLogueado")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(window.alert).toHaveBeenCalledWith("Sesión cerrada correctamente.");
  });

  it("carga el carrito cuando hay usuario", async () => {
    const mockCartItems = [
      { id: 1, quantity: 2, producto: { name: "Producto 1" } },
      { id: 2, quantity: 1, producto: { name: "Producto 2" } }
    ];

    vi.mocked(getItemsCarritoPorUsuario).mockResolvedValueOnce({
      data: mockCartItems
    });

    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(getItemsCarritoPorUsuario).toHaveBeenCalledWith(1);
    });

    // Verificar que el badge del carrito muestra la cantidad correcta
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("maneja errores al cargar el carrito", async () => {
    vi.mocked(getItemsCarritoPorUsuario).mockRejectedValueOnce(
      new Error("Error de red")
    );

    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(getItemsCarritoPorUsuario).toHaveBeenCalledWith(1);
    });

    // El carrito debería estar vacío debido al error
    const carritoButton = screen.getByText("🛒 Carrito");
    
    await act(async () => {
      fireEvent.click(carritoButton);
    });

    await waitFor(() => {
      expect(screen.getByText("El carrito está vacío.")).toBeInTheDocument();
    });
  });

  it("muestra mini carrito al hacer clic", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    const carritoButton = screen.getByText("🛒 Carrito");
    
    await act(async () => {
      fireEvent.click(carritoButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Tu carrito")).toBeInTheDocument();
    });
  });

  it("cierra mini carrito al hacer clic en ver carrito completo", async () => {
    const mockCartItems = [
      { id: 1, quantity: 1, producto: { name: "Producto Test" } }
    ];

    vi.mocked(getItemsCarritoPorUsuario).mockResolvedValueOnce({
      data: mockCartItems
    });

    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    // Abrir mini carrito
    const carritoButton = screen.getByText("🛒 Carrito");
    
    await act(async () => {
      fireEvent.click(carritoButton);
    });

    // Hacer clic en "Ver carrito completo"
    const verCarritoButton = await screen.findByText("Ver carrito completo →");
    
    await act(async () => {
      fireEvent.click(verCarritoButton);
    });

    // El mini carrito debería cerrarse
    expect(screen.queryByText("Ver carrito completo →")).not.toBeInTheDocument();
  });

  it("navega a perfil desde dropdown", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    // Verificar que el enlace de perfil existe con el href correcto
    const perfilLink = document.querySelector('a[href="/mi-perfil"]');
    expect(perfilLink).toBeInTheDocument();
    expect(perfilLink).toHaveTextContent("👤 Mi Perfil");
  });

  it("maneja usuario sin ID correctamente", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    // No debería intentar cargar el carrito sin ID
    expect(getItemsCarritoPorUsuario).not.toHaveBeenCalled();
  });

  it("responde a eventos personalizados de actualización", async () => {
    const mockCartItems = [
      { id: 1, quantity: 1, producto: { name: "Producto Actualizado" } }
    ];

    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    // Simular evento de carrito actualizado
    vi.mocked(getItemsCarritoPorUsuario).mockResolvedValueOnce({
      data: mockCartItems
    });

    await act(async () => {
      window.dispatchEvent(new Event('carritoActualizado'));
    });

    await waitFor(() => {
      expect(getItemsCarritoPorUsuario).toHaveBeenCalledWith(1);
    });
  });


  it("botón de carrito deshabilitado durante carga", async () => {
    // Mock que demora la respuesta
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    vi.mocked(getItemsCarritoPorUsuario).mockImplementation(() => promise);

    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "testuser",
      role: "cliente"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    // El botón debería estar deshabilitado durante la carga inicial
    const carritoButton = screen.getByText("🛒 Carrito");
    expect(carritoButton).toBeDisabled();

    // Resolver la promesa
    await act(async () => {
      resolvePromise({ data: [] });
    });
    
    await waitFor(() => {
      expect(carritoButton).not.toBeDisabled();
    });
  });

  it("muestra todos los enlaces de navegación", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Blogs")).toBeInTheDocument();
    expect(screen.getByText("Nosotros")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("aplica estilo especial a botón de admin", async () => {
    localStorage.setItem("usuarioLogueado", JSON.stringify({
      id: 1,
      username: "admin",
      role: "administrador"
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    });

    const adminButton = screen.getByText("👤 admin");
    expect(adminButton).toHaveClass("btn-warning");
    expect(adminButton).toHaveClass("text-dark");
    expect(adminButton).toHaveClass("fw-semibold");
  });
});