document.addEventListener('DOMContentLoaded', function() {
    const formAgenda = document.getElementById('form-agenda');
    const fechaInput = document.getElementById('fecha-cita');
    const horaSelect = document.getElementById('hora-cita');

    // 1. Validar sesión activa obligatoria para agendar
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));

    if (!sesionActiva) {
        // Si no ha iniciado sesión, bloqueamos el formulario y mostramos un aviso directo
        if (formAgenda) {
            formAgenda.innerHTML = `
                <div class="alert alert-warning text-center p-4 border-0 shadow-sm rounded-4">
                    <h5 class="fw-bold mb-2 text-dark">🔒 Inicia sesión para agendar</h5>
                    <p class="small text-muted mb-3">Para solicitar una hora médica en línea en la Veterinaria San Marcos, debes estar registrado y con tu sesión activa.</p>
                    <a href="login.html" class="btn btn-primary btn-sm px-4 fw-semibold py-2">Ir a Iniciar Sesión</a>
                </div>
            `;
        }
        return; // Detenemos la ejecución del resto del script de fechas
    }

    // Bloquear fechas pasadas usando la fecha actual del sistema
    if (fechaInput) {
        fechaInput.min = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', actualizarHorasDisponibles);
    }

    // Función para actualizar las horas disponibles según la fecha y la hora actual
    function actualizarHorasDisponibles() {
        const fechaSeleccionada = fechaInput.value;
        const ahora = new Date();
        const hoyStr = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();
        const minActual = ahora.getMinutes();
        
        const citasGuardadas = JSON.parse(localStorage.getItem('citas_vet')) || [];
        const horasOcupadas = citasGuardadas.filter(c => c.fecha === fechaSeleccionada).map(c => c.hora);

        for (let option of horaSelect.options) {
            if (!option.value) continue;
            
            let deshabilitar = false;
            let textoExtra = "";

            if (fechaSeleccionada === hoyStr) {
                const [optHora, optMin] = option.value.split(':').map(Number);
                if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
                    deshabilitar = true;
                    textoExtra = " (Pasada)";
                }
            }

            if (horasOcupadas.includes(option.value)) {
                deshabilitar = true;
                textoExtra = " (Ocupada)";
            }

            option.disabled = deshabilitar;
            option.text = `${option.value} ${deshabilitar ? textoExtra : '(Disponible)'}`;
        }
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

                // Guardar en localStorage asociando la cita al correo del usuario activo
                const citas = JSON.parse(localStorage.getItem('citas_vet')) || [];
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