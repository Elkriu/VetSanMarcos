document.addEventListener('DOMContentLoaded', function() {
    const formAgenda = document.getElementById('form-agenda');
    const fechaInput = document.getElementById('fecha-cita');
    const horaSelect = document.getElementById('hora-cita');

    // Bloquear fechas pasadas usando la fecha actual del sistema
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
    }

    // Función para actualizar las horas disponibles según la fecha y la hora actual
    function actualizarHorasDisponibles() {
        const fechaSeleccionada = fechaInput.value;
        
        // Si no hay fecha seleccionada, limpiar y salir
        if (!fechaSeleccionada) {
            for (let option of horaSelect.options) {
                if (option.value === "") continue;
                option.disabled = false;
                option.text = `${option.value} (Disponible)`;
            }
            return;
        }

        const ahora = new Date();
        const hoyStr = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();
        const minActual = ahora.getMinutes();
        
        // Obtener citas ya guardadas en localStorage
        const citasGuardadas = JSON.parse(localStorage.getItem('citas_vet')) || [];
        
        // Filtrar qué horas ya están ocupadas para esta fecha
        const horasOcupadas = citasGuardadas
            .filter(c => c.fecha === fechaSeleccionada)
            .map(c => c.hora);

        // Recorrer las opciones del select y deshabilitar las pasadas u ocupadas
        for (let option of horaSelect.options) {
            if (option.value === "") continue;
            
            let deshabilitar = false;
            let textoExtra = "";

            // 1. Verificar si la hora ya pasó (solo aplica si la fecha elegida es HOY)
            if (fechaSeleccionada === hoyStr) {
                const [optHora, optMin] = option.value.split(':').map(Number);
                if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
                    deshabilitar = true;
                    textoExtra = " (Pasada)";
                }
            }

            // 2. Verificar si la hora ya está ocupada en localStorage
            if (horasOcupadas.includes(option.value)) {
                deshabilitar = true;
                textoExtra = " (Ocupada)";
            }

            if (deshabilitar) {
                option.disabled = true;
                option.text = `${option.value}${textoExtra}`;
            } else {
                option.disabled = false;
                option.text = `${option.value} (Disponible)`;
            }
        }
    }

    // Escuchar cuando cambien la fecha
    if (fechaInput) {
        fechaInput.addEventListener('change', actualizarHorasDisponibles);
    }

    // Manejar el envío del formulario de reserva
    if (formAgenda) {
        formAgenda.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const servicio = document.getElementById('servicio-cita').value;
            const fecha = fechaInput.value;
            const hora = horaSelect.value;

            const ahora = new Date();
            const hoyStr = ahora.toISOString().split('T')[0];
            const horaActual = ahora.getHours();
            const minActual = ahora.getMinutes();

            // Validación de seguridad extra
            if (fecha < hoyStr) {
                alert("No se pueden agendar citas en fechas pasadas.");
                return;
            }

            if (fecha === hoyStr && hora) {
                const [optHora, optMin] = hora.split(':'.map(Number));
                if (optHora < horaActual || (optHora === horaActual && optMin <= minActual)) {
                    alert("No puedes seleccionar un horario que ya pasó el día de hoy.");
                    return;
                }
            }

            if (servicio && fecha && hora) {
                // Guardar en localStorage
                const nuevaCita = { servicio, fecha, hora };
                let citasGuardadas = JSON.parse(localStorage.getItem('citas_vet')) || [];
                citasGuardadas.push(nuevaCita);
                localStorage.setItem('citas_vet', JSON.stringify(citasGuardadas));

                // Mostrar alerta de éxito
                const alerta = document.getElementById('alerta-exito');
                alerta.textContent = `¡Cita para "${servicio}" reservada con éxito el día ${fecha} a las ${hora}!`;
                alerta.classList.remove('d-none');

                actualizarHorasDisponibles();

                document.getElementById('servicio-cita').value = "";
                fechaInput.value = "";
                horaSelect.value = "";
            }
        });
    }
});