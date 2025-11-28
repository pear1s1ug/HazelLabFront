// components/PruebaCloudinary.jsx
import { useState } from "react";
import { probarConexionCloudinary, subirImagen } from "../services/api";

export function PruebaCloudinary() {
  // Estados para manejar el resultado de las pruebas y el estado de carga
  const [resultado, setResultado] = useState(null);
  const [probando, setProbando] = useState(false);

  // Función para probar la conexión con Cloudinary
  const probarConexion = async () => {
    setProbando(true);
    setResultado(null);
    
    try {
      const resultado = await probarConexionCloudinary();
      setResultado(resultado);
    } catch (error) {
      setResultado({ success: false, error: error.message });
    } finally {
      setProbando(false);
    }
  };

  // Función para subir una imagen de prueba a Cloudinary
  const handleSubirImagenPrueba = async (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    setProbando(true);
    try {
      const url = await subirImagen(archivo);
      setResultado({ 
        success: true, 
        url,
        message: 'Imagen subida exitosamente!' 
      });
    } catch (error) {
      setResultado({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setProbando(false);
    }
  };

  // Función para mostrar la configuración actual de Cloudinary en consola (debug)
  const probarConfiguracion = () => {
    console.log('Configuración Cloudinary:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
    });
  };

  return (
    <div className="card p-4">
      <h4>Prueba de Cloudinary</h4>
      
      {/* Botones de acción para probar Cloudinary */}
      <div className="mb-3">
        <button 
          onClick={probarConexion}
          disabled={probando}
          className="btn btn-primary me-2"
        >
          {probando ? 'Probando...' : 'Probar Conexión'}
        </button>
        
        {/* Input oculto para seleccionar archivo de imagen */}
        <input
          type="file"
          accept="image/*"
          onChange={handleSubirImagenPrueba}
          className="d-none"
          id="prueba-imagen"
        />
        <label 
          htmlFor="prueba-imagen" 
          className="btn btn-success"
        >
          Subir Imagen de Prueba
        </label>

        {/* Botón para ver configuración (debug) */}
        <button onClick={probarConfiguracion} className="btn btn-info ms-2">
          Ver Configuración
        </button>
      </div>

      {/* Mostrar resultados de las pruebas */}
      {resultado && (
        <div className={`alert ${resultado.success ? 'alert-success' : 'alert-danger'}`}>
          <strong>
            {resultado.success ? 'Éxito' : 'Error'}
          </strong>
          <br />
          {resultado.message || resultado.error}
          {resultado.url && (
            <>
              <br />
              <strong>URL:</strong> 
              <a href={resultado.url} target="_blank" rel="noopener noreferrer">
                {resultado.url}
              </a>
              <br />
              <img 
                src={resultado.url} 
                alt="Preview" 
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            </>
          )}
        </div>
      )}

      {/* Sección de información y ayuda para configuración */}
      <div className="mt-3 p-3 bg-light rounded">
        <h6>Para configurar Cloudinary:</h6>
        <ol className="small">
          <li>Ve a tu Dashboard de Cloudinary</li>
          <li>Copia tu <strong>Cloud Name</strong></li>
          <li>Ve a Settings → Upload</li>
          <li>Crea un <strong>Upload Preset</strong> unsigned</li>
          <li>Actualiza las variables en <code>api.js</code></li>
        </ol>
      </div>
    </div>
  );
}