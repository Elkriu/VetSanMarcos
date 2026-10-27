import React, { useState, useEffect } from "react";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";

interface MensajeContacto {
  nombre: string;
  email: string;
  comentario: string;
  fecha: string;
}

const CLAVE_MENSAJES = "mensajes_contacto";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [esReadonlyEmail, setEsReadonlyEmail] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem("sesion_activa");
    if (sesionGuardada) {
      const user = JSON.parse(sesionGuardada);
      if (user.nombre) setNombre(user.nombre);
      if (user.email) {
        setEmail(user.email);
        setEsReadonlyEmail(true);
      }
    }
  }, []);

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !comentario.trim()) return;

    const msgsLocal: MensajeContacto[] = JSON.parse(
      localStorage.getItem(CLAVE_MENSAJES) || "[]"
    );

    const nuevoMensaje: MensajeContacto = {
      nombre: nombre.trim(),
      email: email.trim(),
      comentario: comentario.trim(),
      fecha: new Date().toLocaleDateString("es-CL"),
    };

    localStorage.setItem(CLAVE_MENSAJES, JSON.stringify([...msgsLocal, nuevoMensaje]));

    
    setComentario("");
    setMostrarAlerta(true);

    setTimeout(() => {
      setMostrarAlerta(false);
    }, 4000);
  };

  return (
    <section className="container">
      <EncabezadoSeccion
        nivel="h1"
        insignia="Comunícate"
        titulo="Canales de"
        destacado="Contacto"
        descripcion="Estamos aquí para resolver tus dudas y atender a tus mascotas en Rancagua."
      />

      <div className="row g-5 justify-content-center align-items-start mt-2">
        
        <div className="col-lg-6">
          <article className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h2 className="fw-bold h4 text-dark mb-4">Información y Ubicación</h2>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="fs-4">📍</div>
              <div>
                <h3 className="fw-bold h6 mb-1">Dirección</h3>
                <p className="text-muted small mb-0">Av. Libertador Bernardo O'Higgins #450, Rancagua</p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="fs-4">📞</div>
              <div>
                <h3 className="fw-bold h6 mb-1">Teléfono / WhatsApp</h3>
                <p className="text-muted small mb-0">+56 9 1234 5678</p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="fs-4">⏰</div>
              <div>
                <h3 className="fw-bold h6 mb-1">Horarios</h3>
                <p className="text-muted small mb-0">
                  Lun - Vie: 09:00 - 19:00 hrs.<br />
                  Sáb: 10:00 - 14:00 hrs.
                </p>
              </div>
            </div>

            <div className="rounded-3 overflow-hidden shadow-sm mt-auto" style={{ height: "200px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.3582451259926!2d-70.74313!3d-34.17012!2m3!1f0!2f0!3f0!3m2!1f1024!2f768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDEwJzEyLjQiUyA3MMKwNDQnMzUuMyJX!5e0!3m2!1ses!2scl!4v1650000000000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Mapa Ubicación"
              ></iframe>
            </div>
          </article>
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div className="col-lg-6">
          <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
            <h2 className="fw-bold h4 text-dark mb-4">✉️ Envíanos un Mensaje</h2>
            
            <form onSubmit={handleEnviar}>
              <div className="mb-3">
                <label htmlFor="contacto-nombre" className="form-label small fw-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contacto-nombre"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contacto-email" className="form-label small fw-semibold">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="contacto-email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  readOnly={esReadonlyEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="form-text small text-muted">
                  Tu mensaje será recibido por la central de recepción.
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="contacto-comentario" className="form-label small fw-semibold">
                  Comentario o mensaje
                </label>
                <textarea
                  className="form-control"
                  id="contacto-comentario"
                  rows={4}
                  placeholder="Escribe tu consulta aquí..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm">
                Enviar Mensaje
              </button>
            </form>

            {mostrarAlerta && (
              <div className="alert alert-success mt-3 mb-0" role="alert">
                ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

export default Contacto;