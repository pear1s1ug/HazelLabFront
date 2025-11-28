// Registro.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Registro } from './Registro'; // Ajusta la ruta según tu estructura
import { crearUsuario, getRegiones, getComunasPorRegion } from '../../services/api';

// Mock de las dependencias
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  crearUsuario: jest.fn(),
  getRegiones: jest.fn(),
  getComunasPorRegion: jest.fn(),
}));

// Mock para CSS
jest.mock('../InicioSesion/Login-y-registro.css', () => ({}));

describe('Componente Registro', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Registro />
      </BrowserRouter>
    );
  };

  const fillForm = (overrides = {}) => {
    const defaultData = {
      run: '12.345.678-9',
      nombre: 'Juan',
      apellidos: 'Pérez González',
      correo: 'juan.perez@duoc.cl',
      fechaNacimiento: '1990-01-01',
      region: 'Metropolitana',
      comuna: 'Santiago',
      direccion: 'Calle Falsa 123',
      clave: 'password123',
      confirmarClave: 'password123',
    };

    const formData = { ...defaultData, ...overrides };

    // Campos básicos
    fireEvent.change(screen.getByLabelText(/run/i), { target: { value: formData.run } });
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: formData.nombre } });
    fireEvent.change(screen.getByLabelText(/apellidos/i), { target: { value: formData.apellidos } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: formData.correo } });
    
    if (formData.fechaNacimiento) {
      fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { 
        target: { value: formData.fechaNacimiento } 
      });
    }

    // Región y comuna
    if (formData.region) {
      fireEvent.change(screen.getByLabelText(/región/i), { 
        target: { value: formData.region } 
      });
    }

    if (formData.comuna) {
      fireEvent.change(screen.getByLabelText(/comuna/i), { 
        target: { value: formData.comuna } 
      });
    }

    fireEvent.change(screen.getByLabelText(/dirección/i), { 
      target: { value: formData.direccion } 
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { 
      target: { value: formData.clave } 
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { 
      target: { value: formData.confirmarClave } 
    });

    return formData;
  };

  describe('Renderizado inicial', () => {
    test('renderiza el formulario de registro correctamente', () => {
      renderComponent();

      expect(screen.getByText(/registro de usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/run/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/región/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/comuna/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    test('carga las regiones al inicializar el componente', async () => {
      const mockRegiones = ['Metropolitana', 'Valparaíso', 'Biobío'];
      getRegiones.mockResolvedValue({ data: mockRegiones });

      await act(async () => {
        renderComponent();
      });

      expect(getRegiones).toHaveBeenCalledTimes(1);
    });

    test('maneja errores al cargar regiones', async () => {
      getRegiones.mockRejectedValue(new Error('Error de red'));

      await act(async () => {
        renderComponent();
      });

      // El componente debería mostrar regiones por defecto incluso con error
      expect(screen.getByLabelText(/región/i)).toBeInTheDocument();
    });
  });

  describe('Validaciones de formulario', () => {
    test('valida RUN inválido', async () => {
      renderComponent();
      
      fillForm({ run: '123' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/run inválido/i)).toBeInTheDocument();
      });
    });

    test('valida correo electrónico inválido', async () => {
      renderComponent();
      
      fillForm({ correo: 'correo@invalido.com' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/correo inválido/i)).toBeInTheDocument();
      });
    });

    test('valida contraseña demasiado corta', async () => {
      renderComponent();
      
      fillForm({ clave: '123', confirmarClave: '123' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
      });
    });

    test('valida que las contraseñas coincidan', async () => {
      renderComponent();
      
      fillForm({ clave: 'password123', confirmarClave: 'differentpassword' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
      });
    });

    test('valida región requerida', async () => {
      renderComponent();
      
      fillForm({ region: '' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe seleccionar una región/i)).toBeInTheDocument();
      });
    });

    test('valida comuna requerida', async () => {
      renderComponent();
      
      // Simular que se seleccionó región pero no comuna
      getComunasPorRegion.mockResolvedValue({ data: ['Santiago', 'Providencia'] });
      
      fillForm({ comuna: '' });

      fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe seleccionar una comuna/i)).toBeInTheDocument();
      });
    });
  });

  describe('Formateo de RUN', () => {
    test('formatea RUN automáticamente', () => {
      renderComponent();

      const runInput = screen.getByLabelText(/run/i);
      
      fireEvent.change(runInput, { target: { value: '123456789' } });
      
      expect(runInput.value).toBe('12.345.678-9');
    });

    test('permite borrado en el campo RUN', () => {
      renderComponent();

      const runInput = screen.getByLabelText(/run/i);
      
      // Primero ingresar un valor
      fireEvent.change(runInput, { target: { value: '123456789' } });
      // Luego borrar
      fireEvent.change(runInput, { target: { value: '12.345.678' } });
      
      expect(runInput.value).toBe('12.345.678');
    });
  });

  describe('Carga de comunas', () => {
    test('carga comunas cuando se selecciona una región', async () => {
      const mockComunas = ['Santiago', 'Providencia', 'Las Condes'];
      getComunasPorRegion.mockResolvedValue({ data: mockComunas });

      renderComponent();

      const regionSelect = screen.getByLabelText(/región/i);
      
      await act(async () => {
        fireEvent.change(regionSelect, { target: { value: 'Metropolitana' } });
      });

      expect(getComunasPorRegion).toHaveBeenCalledWith('Metropolitana');
      
      await waitFor(() => {
        expect(screen.getByText(/cargando comunas/i)).toBeInTheDocument();
      });
    });

    test('maneja errores al cargar comunas', async () => {
      getComunasPorRegion.mockRejectedValue(new Error('Error de red'));

      renderComponent();

      const regionSelect = screen.getByLabelText(/región/i);
      
      await act(async () => {
        fireEvent.change(regionSelect, { target: { value: 'Metropolitana' } });
      });

      // El componente debería manejar el error sin romperse
      expect(screen.getByLabelText(/comuna/i)).toBeInTheDocument();
    });
  });

  describe('Envío del formulario', () => {
    test('envía el formulario correctamente con datos válidos', async () => {
      const mockResponse = { data: { id: 1, email: 'juan.perez@duoc.cl' } };
      crearUsuario.mockResolvedValue(mockResponse);
      getRegiones.mockResolvedValue({ data: ['Metropolitana'] });
      getComunasPorRegion.mockResolvedValue({ data: ['Santiago'] });

      renderComponent();

      const formData = fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
      });

      expect(crearUsuario).toHaveBeenCalledWith({
        rut: formData.run,
        username: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.correo.toLowerCase(),
        password: formData.clave,
        role: 'cliente',
        status: 'activo',
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    test('muestra error cuando el servidor rechaza el registro', async () => {
      const errorMessage = 'El email ya está registrado';
      crearUsuario.mockRejectedValue({
        response: { status: 400, data: errorMessage }
      });

      renderComponent();

      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    test('muestra error de conexión cuando falla la red', async () => {
      crearUsuario.mockRejectedValue({
        code: 'NETWORK_ERROR',
        message: 'Error de conexión'
      });

      renderComponent();

      fillForm();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
      });
    });

    test('deshabilita el botón durante el envío', async () => {
      let resolveCreateUser;
      const promise = new Promise(resolve => {
        resolveCreateUser = resolve;
      });
      crearUsuario.mockReturnValue(promise);

      renderComponent();

      fillForm();

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/creando cuenta/i);

      // Resolver la promesa
      await act(async () => {
        resolveCreateUser({ data: {} });
      });

      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/crear cuenta/i);
    });
  });

  describe('Navegación', () => {
    test('tiene enlaces de navegación correctos', () => {
      renderComponent();

      expect(screen.getByText(/volver al home/i)).toHaveAttribute('href', '/');
      expect(screen.getByText(/ir a iniciar sesión/i)).toHaveAttribute('href', '/login');
    });
  });

  describe('Campos opcionales', () => {
    test('permite enviar el formulario sin fecha de nacimiento', async () => {
      crearUsuario.mockResolvedValue({ data: { id: 1 } });
      getRegiones.mockResolvedValue({ data: ['Metropolitana'] });
      getComunasPorRegion.mockResolvedValue({ data: ['Santiago'] });

      renderComponent();

      fillForm({ fechaNacimiento: '' });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
      });

      expect(crearUsuario).toHaveBeenCalledWith(
        expect.objectContaining({
          fechaNacimiento: null
        })
      );
    });
  });
});