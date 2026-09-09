document.addEventListener('DOMContentLoaded', function() {
    const formAgenda = document.getElementById('form-agenda');
    const fechaInput = document.getElementById('fecha-cita');
    const horaSelect = document.getElementById('hora-cita');

    // 1. Validar sesión activa obligatoria para agendar
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));

    if (!sesionActiva) {
        if (formAgenda) {
            formAgenda.innerHTML = `
                <div class="alert alert-warning text-center p-4 border-0 shadow-sm rounded-4">
                    <h5 class="fw-bold mb-2 text-dark">🔒 Inicia sesión para agendar</h5>
                    <p class="small text-muted mb-3">Para solicitar una hora médica en línea en la Veterinaria San Marcos, debes estar registrado y con tu sesión activa.</p>
                    <a href="login.html" class="btn btn-primary btn-sm px-4 fw-semibold py-2">Ir a Iniciar Sesión</a>
                </div>
            `;
        }
        return;
    }

    // Bloquear fechas pasadas usando la fecha actual del sistema
    if (fechaInput) {
        fechaInput.min = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', actualizarHorasDisponibles);
    }

    // Función para actualizar y renderizar las horas disponibles sin errores visuales
    function actualizarHorasDisponibles() {
        const fechaSeleccionada = fechaInput.value;
        const ahora = new Date();
        const hoyStr = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();
        const minActual = ahora.getMinutes();
        
        const citasGuardadas = JSON.parse(localStorage.getItem('citas_vet')) || [];
        const horasOcupadas = citasGuardadas.filter(c => c.fecha === fechaSeleccionada).map(c => c.hora);

        // Limpiamos y recreamos las opciones limpiamente para evitar solapamientos
        horaSelect.innerHTML = '<option value="" selected disabled>-- Seleccione una hora --</option>';
        const horariosFijos = ["10:00", "11:30", "15:00", "17:15"];

        horariosFijos.forEach(h => {
            let deshabilitar = false;
            let textoExtra = " (Disponible)";

            if (fechaSeleccionada === hoyStr) {
                const [optHora, optMin] = h.split(':').map(Number);
                if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
                    deshabilitar = true;
                    textoExtra = " (Pasada)";
                }
            }

            if (horasOcupadas.includes(h)) {
                deshabilitar = true;
                textoExtra = " (Ocupada)";
            }

            const option = document.createElement('option');
            option.value = h;
            option.textContent = `${h} hrs.${textoExtra}`;
            option.disabled = deshabilitar;
            horaSelect.appendChild(option);
        });
    }

    // Manejar el envío del formulario de reserva
    if (formAgenda) {
        formAgenda.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const servicio = document.getElementById('servicio-cita').value;
            const tipoMascota = document.getElementById('tipo-mascota').value;
            const fecha = fechaInput.value;
            const hora = horaSelect.value;

            const ahora = new Date();
            const hoyStr = ahora.toISOString().split('T')[0];
            const horaActual = ahora.getHours();
            const minActual = ahora.getMinutes();

            if (fecha < hoyStr) {
                alert("No se pueden agendar citas en fechas pasadas.");
                return;
            }

            if (fecha === hoyStr && hora) {
                const [optHora, optMin] = hora.split(':').map(Number);
                if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
                    alert("No puedes seleccionar un horario que ya pasó el día de hoy.");
                    return;
                }
            }

            if (servicio && tipoMascota && fecha && hora) {
                const emailCliente = sesionActiva.email;
                const citas = JSON.parse(localStorage.getItem('citas_vet')) || [];

                // Validar que el horario no haya sido ocupado por otro usuario justo antes
                if (citas.some(c => c.fecha === fecha && c.hora === hora)) {
                    alert("⚠️ Error: Este horario ya ha sido ocupado. Por favor seleccione otro.");
                    return;
                }

                // Guardar en localStorage
                citas.push({ servicio, tipoMascota, fecha, hora, emailCliente });
                localStorage.setItem('citas_vet', JSON.stringify(citas));

                const alerta = document.getElementById('alerta-exito');
                if (alerta) {
                    alerta.textContent = `¡Cita para "${servicio}" (${tipoMascota}) reservada con éxito el día ${fecha} a las ${hora}!`;
                    alerta.classList.remove('d-none');
                }

                formAgenda.reset();
                horaSelect.innerHTML = '<option value="" selected disabled>-- Primero seleccione una fecha --</option>';
            }
        });
    }
});