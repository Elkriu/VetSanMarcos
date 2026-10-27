import React, { useState } from "react";
import { Link } from "react-router-dom";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";

interface Cita {
  servicio: string;
  tipoMascota: string;
  fecha: string;
  hora: string;
  emailCliente: string;
}

const CLAVE_CITAS = "citas_vet";

function Agenda() {
  const [servicio, setServicio] = useState("");
  const [tipoMascota, setTipoMascota] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const sesionGuardada = localStorage.getItem("sesion_activa");
  const sesionActiva = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const obtenerHoyStr = () => {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  };

  const hoyStr = obtenerHoyStr();

  // Calcular la lista de opciones con estados (Disponible, Pasada, Ocupada)
  const obtenerOpcionesHoras = (fechaSel: string) => {
    if (!fechaSel) return [];

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minActual = ahora.getMinutes();

    const citasGuardadas: Cita[] = JSON.parse(
      localStorage.getItem(CLAVE_CITAS) || "[]"
    );
    const horasOcupadas = citasGuardadas
      .filter((c) => c.fecha === fechaSel)
      .map((c) => c.hora);

    const horariosFijos = ["10:00", "11:30", "15:00", "17:15"];

    return horariosFijos.map((h) => {
      let deshabilitar = false;
      let textoExtra = " (Disponible)";

      // Evaluar si la hora ya pasó en el día actual
      if (fechaSel === hoyStr) {
        const [optH, optM] = h.split(":").map(Number);
        if (optH < horaActual || (optH === horaActual && optM <= minActual)) {
          deshabilitar = true;
          textoExtra = " (Pasada)";
        }
      }

      // Evaluar si ya está reservada en localStorage
      if (horasOcupadas.includes(h)) {
        deshabilitar = true;
        textoExtra = " (Ocupada)";
      }

      return { hora: h, texto: `${h} hrs.${textoExtra}`, disabled: deshabilitar };
    });
  };

  const opcionesHorarios = obtenerOpcionesHoras(fecha);

  const handleAgendar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sesionActiva) return;

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minActual = ahora.getMinutes();

    if (fecha < hoyStr) {
      alert("No se pueden agendar citas en fechas pasadas.");
      return;
    }

    if (fecha === hoyStr && hora) {
      const [optHora, optMin] = hora.split(":").map(Number);
      if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
        alert("No puedes seleccionar un horario que ya pasó el día de hoy.");
        return;
      }
    }

    if (servicio && tipoMascota && fecha && hora) {
      const citas: Cita[] = JSON.parse(
        localStorage.getItem(CLAVE_CITAS) || "[]"
      );

      if (citas.some((c) => c.fecha === fecha && c.hora === hora)) {
        alert("⚠️ Error: Este horario ya ha sido ocupado. Por favor seleccione otro.");
        return;
      }

      const nuevaCita: Cita = {
        servicio,
        tipoMascota,
        fecha,
        hora,
        emailCliente: sesionActiva.email,
      };

      localStorage.setItem(CLAVE_CITAS, JSON.stringify([...citas, nuevaCita]));

      setMensajeExito(
        `¡Cita para "${servicio}" (${tipoMascota}) reservada con éxito el día ${fecha} a las ${hora}!`
      );

      // Reiniciar campos
      setServicio("");
      setTipoMascota("");
      setFecha("");
      setHora("");
    }
  };

  return (
    <section className="container">
      <EncabezadoSeccion
        nivel="h1"
        insignia="Atención en Línea"
        titulo="Agenda tu"
        destacado="Hora Médica"
        descripcion="Selecciona el servicio, el tipo de mascota y tu horario preferido en Rancagua."
      />

      <div className="row justify-content-center mt-4">
        <div className="col-lg-7">
          <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h2 className="fw-bold h4 text-dark mb-4">📅 Formulario de Reserva</h2>

            {!sesionActiva ? (
              <div className="alert alert-warning text-center p-4 border-0 shadow-sm rounded-4 mb-0">
                <h5 className="fw-bold mb-2 text-dark">🔒 Inicia sesión para agendar</h5>
                <p className="small text-muted mb-3">
                  Para solicitar una hora médica en línea en la Veterinaria San Marcos, debes estar registrado y con tu sesión activa.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm px-4 fw-semibold py-2">
                  Ir a Iniciar Sesión
                </Link>
              </div>
            ) : (
              <form id="form-agenda" onSubmit={handleAgendar}>
                <div className="mb-3">
                  <label htmlFor="servicio-cita" className="form-label fw-semibold small">
                    Seleccione el Servicio
                  </label>
                  <select
                    className="form-select"
                    id="servicio-cita"
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Elija una opción --</option>
                    <option value="Consulta General">Consulta General ($20.000)</option>
                    <option value="Vacunación">Vacunación ($15.000)</option>
                    <option value="Cirugía Menor">Cirugía Menor</option>
                    <option value="Desparasitación">Desparasitación ($10.000)</option>
                    <option value="Control de Peso">Control de Peso</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="tipo-mascota" className="form-label fw-semibold small">
                    Tipo de Mascota
                  </label>
                  <select
                    className="form-select"
                    id="tipo-mascota"
                    value={tipoMascota}
                    onChange={(e) => setTipoMascota(e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Seleccione el animal --</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Ave">Ave</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha-cita" className="form-label fw-semibold small">
                    Fecha de la Cita
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha-cita"
                    min={hoyStr}
                    value={fecha}
                    onChange={(e) => {
                      setFecha(e.target.value);
                      setHora(""); // reiniciar hora al cambiar fecha
                    }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="hora-cita" className="form-label fw-semibold small">
                    Horarios Disponibles
                  </label>
                  <select
                    className="form-select"
                    id="hora-cita"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={!fecha}
                    required
                  >
                    {!fecha ? (
                      <option value="" disabled>-- Primero seleccione una fecha --</option>
                    ) : (
                      <>
                        <option value="" disabled>-- Seleccione una hora --</option>
                        {opcionesHorarios.map((op) => (
                          <option key={op.hora} value={op.hora} disabled={op.disabled}>
                            {op.texto}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm">
                  Reservar Hora Ahora
                </button>
              </form>
            )}

            {mensajeExito && (
              <div className="alert alert-success mt-3 mb-0" role="alert">
                {mensajeExito}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

export default Agenda;