import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { VistaClientes } from './VistaClientes'

// Mock de la API
vi.mock('../../services/api', () => ({
  getUsuarios: vi.fn(),
  eliminarUsuario: vi.fn()
}))

const { getUsuarios, eliminarUsuario } = await import('../../services/api')

describe('VistaClientes', () => {
  let originalConfirm
  let originalAlert

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    originalConfirm = window.confirm
    originalAlert = window.alert

    window.confirm = vi.fn()
    window.alert = vi.fn()
  })

  afterEach(() => {
    window.confirm = originalConfirm
    window.alert = originalAlert
  })

  const renderVista = () =>
    render(
      <MemoryRouter>
        <VistaClientes />
      </MemoryRouter>
    )

  it('muestra encabezado, botón "Nuevo Usuario" y mensaje de permisos para super admin', async () => {
    const usuarioLogueado = { id: 1, username: 'super', role: 'super_admin' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({ data: [] })

    renderVista()

    await waitFor(() => {
      expect(getUsuarios).toHaveBeenCalled()
    })

    expect(
      screen.getByRole('heading', { name: /Listado de Usuarios/i })
    ).toBeInTheDocument()

    const nuevoBtn = screen.getByRole('link', { name: 'Nuevo Usuario' })
    expect(nuevoBtn).toBeInTheDocument()
    expect(nuevoBtn).toHaveAttribute('href', '/admin/clientes/nuevo')

    // Mensaje de permisos de super admin
    expect(
      screen.getByText(/Permisos de Super Admin: Acceso completo/i)
    ).toBeInTheDocument()

    // No debe aparecer mensaje de vendedor
    expect(
      screen.queryByText(/Permisos de Vendedor: Solo edición/i)
    ).not.toBeInTheDocument()
  })

  it('carga y muestra usuarios en la tabla', async () => {
    const usuarioLogueado = { id: 2, username: 'admin', role: 'administrador' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          username: 'cliente1',
          apellidos: 'González',
          rut: '11.111.111-1',
          email: 'cliente1@test.com',
          fechaNacimiento: '1990-01-01',
          region: 'Metropolitana',
          comuna: 'Santiago',
          role: 'cliente',
          status: 'activo',
          createdAt: '2024-01-01',
          itemsCarrito: [{ id: 1 }]
        },
        {
          id: 2,
          username: 'cliente2',
          apellidos: 'Pérez',
          rut: '22.222.222-2',
          email: 'cliente2@test.com',
          fechaNacimiento: null,
          region: 'Valparaíso',
          comuna: 'Viña del Mar',
          role: 'vendedor',
          status: 'inactivo',
          createdAt: null,
          itemsCarrito: []
        }
      ]
    })

    renderVista()

    await waitFor(() => {
      expect(getUsuarios).toHaveBeenCalled()
    })

    // Se muestran los dos usuarios
    expect(screen.getByText('cliente1')).toBeInTheDocument()
    expect(screen.getByText('cliente2')).toBeInTheDocument()

    // Algunos datos clave
    expect(screen.getByText('González')).toBeInTheDocument()
    expect(screen.getByText('Pérez')).toBeInTheDocument()
    expect(screen.getByText('11.111.111-1')).toBeInTheDocument()
    expect(screen.getByText('22.222.222-2')).toBeInTheDocument()

    // Carritos: 1 y 0
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('aplica filtros de búsqueda y estado correctamente', async () => {
    const usuarioLogueado = { id: 3, username: 'admin', role: 'administrador' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          username: 'activoUser',
          apellidos: 'Activo',
          rut: '11.111.111-1',
          email: 'activo@test.com',
          fechaNacimiento: null,
          region: 'Metropolitana',
          comuna: 'Santiago',
          role: 'cliente',
          status: 'activo',
          createdAt: null,
          itemsCarrito: []
        },
        {
          id: 2,
          username: 'inactivoUser',
          apellidos: 'Inactivo',
          rut: '22.222.222-2',
          email: 'inactivo@test.com',
          fechaNacimiento: null,
          region: 'Valparaíso',
          comuna: 'Viña del Mar',
          role: 'cliente',
          status: 'inactivo',
          createdAt: null,
          itemsCarrito: []
        }
      ]
    })

    renderVista()

    await waitFor(() => {
      expect(getUsuarios).toHaveBeenCalled()
    })

    // Los dos usuarios visibles inicialmente
    expect(screen.getByText('activoUser')).toBeInTheDocument()
    expect(screen.getByText('inactivoUser')).toBeInTheDocument()

    // 🔎 Filtro de búsqueda por RUT (único)
    const inputBusqueda = screen.getByPlaceholderText(
      /Nombre, email, RUT, región/i
    )
    fireEvent.change(inputBusqueda, { target: { value: '11.111.111-1' } })

    // Solo queda el usuario cuyo RUT coincide
    await waitFor(() => {
      expect(screen.getByText('activoUser')).toBeInTheDocument()
      expect(
        screen.queryByText('inactivoUser')
      ).not.toBeInTheDocument()
    })

    // Limpiar búsqueda
    fireEvent.change(inputBusqueda, { target: { value: '' } })

    await waitFor(() => {
      expect(screen.getByText('activoUser')).toBeInTheDocument()
      expect(screen.getByText('inactivoUser')).toBeInTheDocument()
    })

    // Botón rápido "Ver inactivos"
    const verInactivosBtn = screen.getByRole('button', {
      name: /Ver inactivos/i
    })
    fireEvent.click(verInactivosBtn)

    await waitFor(() => {
      expect(screen.getByText('inactivoUser')).toBeInTheDocument()
      expect(
        screen.queryByText('activoUser')
      ).not.toBeInTheDocument()
    })

    // Botón "Limpiar filtros"
    const limpiarFiltrosBtn = screen.getByRole('button', {
      name: /Limpiar filtros/i
    })
    fireEvent.click(limpiarFiltrosBtn)

    await waitFor(() => {
      expect(screen.getByText('activoUser')).toBeInTheDocument()
      expect(screen.getByText('inactivoUser')).toBeInTheDocument()
    })
  })

  it('permite eliminar usuario cuando el logueado es super_admin', async () => {
    const usuarioLogueado = { id: 4, username: 'super', role: 'super_admin' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({
      data: [
        {
          id: 10,
          username: 'borrarUser',
          apellidos: 'Eliminar',
          rut: '33.333.333-3',
          email: 'borrar@test.com',
          fechaNacimiento: null,
          region: 'Metropolitana',
          comuna: 'Santiago',
          role: 'cliente',
          status: 'activo',
          createdAt: null,
          itemsCarrito: []
        }
      ]
    })

    eliminarUsuario.mockResolvedValueOnce({})

    window.confirm.mockReturnValue(true)

    renderVista()

    const userCell = await screen.findByText('borrarUser')
    expect(userCell).toBeInTheDocument()

    const botonEliminar = screen.getByRole('button', { name: /eliminar/i })
    fireEvent.click(botonEliminar)

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Eliminar al usuario "borrarUser"?'
    )

    await waitFor(() => {
      expect(eliminarUsuario).toHaveBeenCalledWith(10)
    })

    await waitFor(() => {
      expect(
        screen.queryByText('borrarUser')
      ).not.toBeInTheDocument()
    })

    expect(window.alert).toHaveBeenCalledWith(
      'Usuario eliminado correctamente.'
    )
  })

  it('muestra botón bloqueado para eliminar cuando el logueado es vendedor', async () => {
    const usuarioLogueado = { id: 5, username: 'vend', role: 'vendedor' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({
      data: [
        {
          id: 20,
          username: 'clienteVendedor',
          apellidos: 'Test',
          rut: '44.444.444-4',
          email: 'clientevendedor@test.com',
          fechaNacimiento: null,
          region: 'Metropolitana',
          comuna: 'Santiago',
          role: 'cliente',
          status: 'activo',
          createdAt: null,
          itemsCarrito: []
        }
      ]
    })

    renderVista()

    const userCell = await screen.findByText('clienteVendedor')
    expect(userCell).toBeInTheDocument()

    // Botón "No Permitido" deshabilitado
    const botonSinPermiso = screen.getByRole('button', { name: 'No Permitido' })
    expect(botonSinPermiso).toBeDisabled()

    // Aunque intentemos click, no debe llamar a eliminarUsuario
    fireEvent.click(botonSinPermiso)
    expect(eliminarUsuario).not.toHaveBeenCalled()
  })

  it('muestra mensaje cuando no hay usuarios (lista vacía)', async () => {
    const usuarioLogueado = { id: 6, username: 'admin', role: 'administrador' }
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado))

    getUsuarios.mockResolvedValueOnce({ data: [] })

    renderVista()

    await waitFor(() => {
      expect(getUsuarios).toHaveBeenCalled()
    })

    expect(
      screen.getByText(/No se encontraron usuarios/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Intenta ajustar los filtros de búsqueda/i)
    ).toBeInTheDocument()
  })
})