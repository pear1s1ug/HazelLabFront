import { useState } from "react";
import { Navbar } from "../../componentes/Navbar/Navbar";
import "./Contacto.css";

export function Contacto() {
  // Estado para manejar los datos del formulario de contacto
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    comentario: "",
  });

  // Estado para mostrar mensaje de éxito después del envío
  const [mensajeExito, setMensajeExito] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario de contacto
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simular envío exitoso del formulario
    setMensajeExito(true);
    
    // Restablecer el formulario a valores vacíos
    setFormData({ nombre: "", correo: "", comentario: "" });
    
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setMensajeExito(false);
    }, 5000);
  };

  return (
    <>
      <div className="container">
        <Navbar />
      </div>

      <main className="container my-5">
        {/* Título principal de la página de contacto */}
        <h1 className="text-center mb-4">Contacto</h1>

        {/* Formulario de contacto */}
        <form
          onSubmit={handleSubmit}
          id="form-contacto"
          className="mx-auto contacto-form"
        >
          {/* Campo para el nombre del usuario */}
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            maxLength="100"
            value={formData.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu nombre completo"
          />

          {/* Campo para el correo electrónico */}
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            id="correo"
            name="correo"
            type="email"
            maxLength="100"
            value={formData.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingresa tu correo electrónico"
          />

          {/* Campo para el mensaje o comentario */}
          <label htmlFor="comentario">Mensaje</label>
          <textarea
            id="comentario"
            name="comentario"
            required
            maxLength="500"
            value={formData.comentario}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Escribe tu mensaje o consulta aquí..."
          ></textarea>

          {/* Botón de envío del formulario */}
          <button type="submit" className="btn contacto-btn mt-3">
            Enviar Mensaje
          </button>
        </form>

        {/* Mensaje de confirmación después del envío exitoso */}
        {mensajeExito && (
          <div id="mensaje-exito" className="text-center mt-4 contacto-exito">
            ¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente.
          </div>
        )}
      </main>
    </>
  );
}