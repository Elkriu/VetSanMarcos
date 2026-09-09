document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    
    if (!sesionActiva || (sesionActiva.rol !== 'Recepcionista' && sesionActiva.rol !== 'Administrador')) {
        alert("Acceso denegado. Debe iniciar sesión con credenciales de recepción.");
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre y rol en el navbar de recepción
    const infoRecepcion = document.getElementById('info-usuario-recepcion');
    if (infoRecepcion) {
        infoRecepcion.innerHTML = `👤 <b>${sesionActiva.nombre}</b> <span class="badge bg-warning text-dark">${sesionActiva.rol}</span>`;
    }

    // Botón de cerrar sesión
    document.getElementById('btn-cerrar-sesion')?.addEventListener('click', () => {
        localStorage.removeItem('sesion_activa');
        window.location.href = 'login.html';
    });

    cargarTablaUsuariosLectura();
    cargarTablaCitas();
    configurarAgendamientoManual();
});

// Funciones auxiliares cortas para optimizar la lectura y escritura del localStorage
const obtenerDatos = (clave) => JSON.parse(localStorage.getItem(clave)) || [];
const guardarDatos = (clave, datos) => localStorage.setItem(clave, JSON.stringify(datos));

// Directorio de usuarios (Solo lectura de clientes, staff protegido)
function cargarTablaUsuariosLectura() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    obtenerDatos('usuarios_sistema').forEach(usr => {
        const esStaff = usr.rol === 'Administrador' || usr.rol === 'Recepcionista';
        const badgeRol = esStaff ? `<span class="badge bg-dark">${usr.rol} (Protegido)</span>` : `<span class="badge bg-secondary">${usr.rol}</span>`;
        const estadoBadge = usr.suspendido ? '<span class="badge bg-danger">Suspendido</span>' : '<span class="badge bg-success">Activo</span>';

        tbody.innerHTML += `
            <tr>
                <td class="fw-semibold">${usr.nombre || 'Sin nombre'}</td>
                <td>${usr.email}</td>
                <td>${badgeRol}</td>
                <td>${estadoBadge}</td>
            </tr>`;
    });
}

// Carga y listado de citas en tiempo real
function cargarTablaCitas() {
    const tbody = document.getElementById('tabla-citas-body');
    if (!tbody) return;

    const citas = obtenerDatos('citas_vet');
    tbody.innerHTML = '';

    if (citas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay citas agendadas actualmente.</td></tr>`;
        return;
    }

    citas.forEach((c, index) => {
        const clienteRef = c.nombreCliente || c.emailCliente || 'Cliente Web';
        tbody.innerHTML += `
            <tr>
                <td><span class="fw-semibold text-primary">${c.servicio}</span></td>
                <td><span class="badge bg-info text-dark">${c.tipoMascota || 'No especificada'}</span></td>
                <td>${c.fecha}</td>
                <td>${c.hora}</td>
                <td class="text-end">
                    <small class="text-muted d-block mb-1">Dueño: ${clienteRef}</small>
                    <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="eliminarCita(${index})">Cancelar</button>
                </td>
            </tr>`;
    });
}

// Eliminar/Cancelar cita desde el panel
window.eliminarCita = function(index) {
    if (confirm("¿Estás seguro de cancelar esta cita médica?")) {
        let citas = obtenerDatos('citas_vet');
        citas.splice(index, 1);
        guardarDatos('citas_vet', citas);
        cargarTablaCitas();
    }
};

// Configuración del agendamiento manual con validación de horarios y fechas
function configurarAgendamientoManual() {
    const formManual = document.getElementById('form-cita-manual');
    const fechaInput = document.getElementById('manual-fecha');
    const horaSelect = document.getElementById('manual-hora');

    if (!formManual || !fechaInput || !horaSelect) return;

    const hoyStr = new Date().toISOString().split('T')[0];
    fechaInput.min = hoyStr;
    fechaInput.addEventListener('change', actualizarHorasDisponibles);

    function actualizarHorasDisponibles() {
        const fechaSel = fechaInput.value;
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minActual = ahora.getMinutes();
        
        const horasOcupadas = obtenerDatos('citas_vet')
            .filter(c => c.fecha === fechaSel)
            .map(c => c.hora);

        // Construcción limpia y dinámica de las opciones del select de horas
        horaSelect.innerHTML = '<option value="" selected disabled>-- Seleccione una hora --</option>';
        const horariosFijos = ["10:00", "11:30", "15:00", "17:15"];

        horariosFijos.forEach(h => {
            let deshabilitar = false;
            let textoExtra = " (Disponible)";

            if (fechaSel === hoyStr) {
                const [optH, optM] = h.split(':').map(Number);
                if (optH < horaActual || (optH === horaActual && optM <= minActual)) {
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

    formManual.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombreCliente = document.getElementById('manual-nombre').value.trim();
        const servicio = document.getElementById('manual-servicio').value;
        const tipoMascota = document.getElementById('manual-mascota').value;
        const fecha = fechaInput.value;
        const hora = horaSelect.value;

        const citas = obtenerDatos('citas_vet');

        // Validar doble reserva en la misma fecha y hora exacta
        if (citas.some(c => c.fecha === fecha && c.hora === hora)) {
            alert("⚠️ Error: Ya existe una cita agendada en ese mismo día y horario.");
            return;
        }

        if (nombreCliente && servicio && tipoMascota && fecha && hora) {
            citas.push({ 
                nombreCliente, 
                servicio, 
                tipoMascota, 
                fecha, 
                hora, 
                emailCliente: 'Agendamiento Manual (Recepción)' 
            });
            guardarDatos('citas_vet', citas);

            alert(`¡Cita registrada con éxito para ${nombreCliente}!`);
            formManual.reset();
            fechaInput.min = new Date().toISOString().split('T')[0];
            horaSelect.innerHTML = '<option value="" selected disabled>-- Primero seleccione una fecha --</option>';
            cargarTablaCitas();
        }
    });
}