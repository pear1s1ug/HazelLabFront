// src/pages/Productos/productos.test.jsx
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Productos } from './Productos'
import { getProductos, getCategorias, agregarItemCarrito } from '../../services/api'

// Mock de la API
vi.mock('../../services/api', () => ({
  getProductos: vi.fn(),
  getCategorias: vi.fn(),
  agregarItemCarrito: vi.fn(),
  buscarProductosAvanzado: vi.fn(),
}))

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock de alert y window.dispatchEvent
global.alert = vi.fn()
global.window.dispatchEvent = vi.fn()

// Componente wrapper para Router
const RenderWithRouter = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

// Datos mock para pruebas
const mockProductos = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción del producto 1",
    cost: 10000,
    image: "imagen1.jpg",
    stock: 10,
    activeStatus: true,
    category: { id: 1, nombre: "Categoría 1" }
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción del producto 2",
    cost: 20000,
    image: "imagen2.jpg",
    stock: 5,
    activeStatus: true,
    category: { id: 2, nombre: "Categoría 2" }
  },
  {
    id: 3,
    name: "Otro Producto",
    description: "Otra descripción",
    cost: 15000,
    image: null,
    stock: 0,
    activeStatus: true,
    category: { id: 1, nombre: "Categoría 1" }
  },
  {
    id: 4,
    name: "Producto Inactivo",
    description: "Este producto está inactivo",
    cost: 5000,
    image: "imagen4.jpg",
    stock: 15,
    activeStatus: false,
    category: { id: 1, nombre: "Categoría 1" }
  }
]

const mockCategorias = [
  { id: 1, nombre: "Categoría 1" },
  { id: 2, nombre: "Categoría 2" }
]

const mockUsuarioLogueado = {
  id: 1,
  username: "testuser",
  email: "test@duoc.cl"
}

describe('Productos Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    
    // Mocks por defecto
    getProductos.mockResolvedValue({ data: mockProductos })
    getCategorias.mockResolvedValue({ data: mockCategorias })
    agregarItemCarrito.mockResolvedValue({})
  })

  // Prueba 1: Renderizado inicial y carga de productos
  test('renders product list and loads products successfully', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    // Verificar que se muestra el título
    expect(screen.getByText('Productos')).toBeInTheDocument()

    // Verificar que se llamó a la API
    await waitFor(() => {
      expect(getProductos).toHaveBeenCalledTimes(1)
      expect(getCategorias).toHaveBeenCalledTimes(1)
    })

    // Verificar que los productos activos se muestran (excluye producto inactivo)
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
      expect(screen.getByText('Producto 2')).toBeInTheDocument()
      expect(screen.getByText('Otro Producto')).toBeInTheDocument()
      expect(screen.queryByText('Producto Inactivo')).not.toBeInTheDocument()
    })

    // Verificar precios formateados
    expect(screen.getByText('$10.000')).toBeInTheDocument()
    expect(screen.getByText('$20.000')).toBeInTheDocument()
    expect(screen.getByText('$15.000')).toBeInTheDocument()

    // Verificar que se muestra información de stock
    expect(screen.getByText('10 disponibles')).toBeInTheDocument()
    expect(screen.getByText('5 disponibles')).toBeInTheDocument()
  })

  // Prueba 2: Manejo de errores al cargar productos
  test('shows error message when products fail to load', async () => {
    getProductos.mockRejectedValueOnce(new Error('Error del servidor'))

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar los productos desde el servidor.')).toBeInTheDocument()
    })
  })

  // Prueba 3: Filtrado por categoría (filtro en frontend)
  test('filters products by category using frontend filter', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    // Esperar a que carguen los productos iniciales
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
      expect(screen.getByText('Producto 2')).toBeInTheDocument()
    })

    // Seleccionar categoría 1
    const select = screen.getByLabelText('Filtrar por categoría:')
    fireEvent.change(select, { target: { value: '1' } })

    // Verificar que solo se muestran productos de categoría 1
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
      expect(screen.getByText('Otro Producto')).toBeInTheDocument()
      expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
    })
  })

  // Prueba 4: Búsqueda de productos (filtro en frontend)
  test('filters products by search term using frontend filter', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    // Buscar "Producto 1"
    const searchInput = screen.getByPlaceholderText('Buscar producto...')
    fireEvent.change(searchInput, { target: { value: 'Producto 1' } })

    // Verificar que solo se muestra Producto 1
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
      expect(screen.queryByText('Producto 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Otro Producto')).not.toBeInTheDocument()
    })
  })

  // Prueba 5: Agregar producto al carrito exitosamente
  test('adds product to cart successfully', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsuarioLogueado))

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    // Encontrar y hacer click en el botón de agregar al carrito
    const addToCartButtons = screen.getAllByText('Agregar al carrito')
    fireEvent.click(addToCartButtons[0])

    // Verificar que se llamó a la API con los parámetros correctos
    await waitFor(() => {
      expect(agregarItemCarrito).toHaveBeenCalledWith(1, 1, 1)
    })

    // Verificar que se disparó el evento de actualización del carrito
    expect(global.window.dispatchEvent).toHaveBeenCalledWith(new Event('carritoActualizado'))

    // Verificar que se mostró el alert de éxito
    expect(global.alert).toHaveBeenCalledWith('"Producto 1" agregado al carrito')
  })

  // Prueba 6: Usuario no logueado intenta agregar al carrito
  test('shows alert when unauthenticated user tries to add to cart', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    const addToCartButtons = screen.getAllByText('Agregar al carrito')
    fireEvent.click(addToCartButtons[0])

    // Verificar que se mostró el alert de autenticación requerida
    expect(global.alert).toHaveBeenCalledWith('Debes iniciar sesión para agregar productos al carrito.')
    
    // Verificar que NO se llamó a la API
    expect(agregarItemCarrito).not.toHaveBeenCalled()
  })

  // Prueba 7: Estado de loading al agregar producto
  test('shows loading state when adding product to cart', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsuarioLogueado))
    
    // Mock que demora la respuesta
    let resolvePromise
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    agregarItemCarrito.mockImplementationOnce(() => promise)

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    const addToCartButtons = screen.getAllByText('Agregar al carrito')
    fireEvent.click(addToCartButtons[0])

    // Verificar que el botón muestra "Agregando..." y está deshabilitado
    await waitFor(() => {
      expect(addToCartButtons[0]).toHaveTextContent('Agregando...')
      expect(addToCartButtons[0]).toBeDisabled()
    })

    // Resolver la promesa
    resolvePromise({})
    
    // Verificar que el botón vuelve al estado normal
    await waitFor(() => {
      expect(addToCartButtons[0]).toHaveTextContent('Agregar al carrito')
      expect(addToCartButtons[0]).not.toBeDisabled()
    })
  })

  // Prueba 8: Mostrar placeholder cuando no hay imagen
  test('shows placeholder image when product has no image', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Otro Producto')).toBeInTheDocument()
    })

    // Buscar por el alt text correcto
    const images = screen.getAllByRole('img')
    const placeholderImage = images.find(img => 
      img.getAttribute('src')?.includes('wooden.jpg') && 
      img.getAttribute('alt') === 'Otro Producto'
    )
    expect(placeholderImage).toBeInTheDocument()
  })

  // Prueba 9: Manejo de error en carga de imagen
  test('handles image load error', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    // Buscar imágenes y simular error en una específica
    const images = screen.getAllByRole('img')
    const firstImage = images.find(img => img.getAttribute('src') === 'imagen1.jpg')
    
    // Verificar que inicialmente tiene la imagen normal
    expect(firstImage).toHaveAttribute('src', 'imagen1.jpg')
    
    // Simular error en carga de imagen
    if (firstImage) {
      fireEvent.error(firstImage)
    }

    // Verificar que después del error se recarga con placeholder
    await waitFor(() => {
      const updatedImages = screen.getAllByRole('img')
      const updatedImage = updatedImages.find(img => 
        img.getAttribute('src')?.includes('wooden.jpg') && 
        img.getAttribute('alt') === 'Producto 1'
      )
      expect(updatedImage).toBeInTheDocument()
    })
  })

  // Prueba 10: Mensaje cuando no hay productos que coincidan
  test('shows message when no products match filter', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    // Buscar término que no existe
    const searchInput = screen.getByPlaceholderText('Buscar producto...')
    fireEvent.change(searchInput, { target: { value: 'xxxxxxx' } })

    // Esperar a que se actualice el filtro
    await waitFor(() => {
      expect(screen.getByText('No hay productos que coincidan con tu búsqueda.')).toBeInTheDocument()
    })
  })

  // Prueba 11: Enlaces de detalle de producto
  test('has working product detail links', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    // Verificar que existen enlaces de detalle (solo para productos activos)
    const detalleLinks = screen.getAllByText('Ver detalle')
    expect(detalleLinks).toHaveLength(3) // Solo 3 productos activos

    // Verificar que los enlaces tienen la URL correcta
    expect(detalleLinks[0].closest('a')).toHaveAttribute('href', '/detalle-producto/1')
    expect(detalleLinks[1].closest('a')).toHaveAttribute('href', '/detalle-producto/2')
    expect(detalleLinks[2].closest('a')).toHaveAttribute('href', '/detalle-producto/3')
  })

  // Prueba 12: Formato de precios correcto
  test('formats prices correctly in CLP', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('$10.000')).toBeInTheDocument()
      expect(screen.getByText('$20.000')).toBeInTheDocument()
      expect(screen.getByText('$15.000')).toBeInTheDocument()
    })

    // Verificar que los precios tienen el formato chileno
    const precios = screen.getAllByText(/\$\d+\.\d+/)
    expect(precios.length).toBeGreaterThan(0)
  })

  // Prueba 13: Descripciones truncadas correctamente
  test('truncates long descriptions', async () => {
    const productoConDescripcionLarga = {
      id: 5,
      name: "Producto Largo",
      description: "Esta es una descripción muy larga que debería ser truncada porque excede los 120 caracteres establecidos en el componente para mostrarse correctamente en la tarjeta del producto",
      cost: 5000,
      image: "imagen5.jpg",
      stock: 10,
      activeStatus: true,
      category: { id: 1, nombre: "Categoría 1" }
    }

    getProductos.mockResolvedValueOnce({ data: [productoConDescripcionLarga] })

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/…$/)).toBeInTheDocument() // Verificar que termina con ellipsis
    })
  })

  // Prueba 14: Filtra productos inactivos
  test('filters out inactive products', async () => {
    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      // Verificar que los productos activos se muestran
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
      expect(screen.getByText('Producto 2')).toBeInTheDocument()
      expect(screen.getByText('Otro Producto')).toBeInTheDocument()
      
      // Verificar que el producto inactivo NO se muestra
      expect(screen.queryByText('Producto Inactivo')).not.toBeInTheDocument()
    })
  })

  // Prueba 15: Manejo de errores al agregar al carrito
  test('handles errors when adding to cart fails', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsuarioLogueado))
    agregarItemCarrito.mockRejectedValueOnce({
      response: { status: 401 }
    })

    render(
      <RenderWithRouter>
        <Productos />
      </RenderWithRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument()
    })

    const addToCartButtons = screen.getAllByText('Agregar al carrito')
    fireEvent.click(addToCartButtons[0])

    // Verificar que se mostró el error específico
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Sesión expirada. Por favor, inicia sesión nuevamente.')
    })
  })
})