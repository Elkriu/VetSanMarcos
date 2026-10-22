document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    
    if (!sesionActiva || (sesionActiva.rol !== 'Recepcionista' && sesionActiva.rol !== 'Administrador')) {
        alert("Acceso denegado. Debe iniciar sesión con credenciales de recepción.");
        window.location.href = 'login.html';
        return;
    }

    const infoRecepcion = document.getElementById('info-usuario-recepcion');
    if (infoRecepcion) {
        infoRecepcion.innerHTML = `👤 <b>${sesionActiva.nombre}</b> <span class="badge bg-warning text-dark">${sesionActiva.rol}</span>`;
    }

    document.getElementById('btn-cerrar-sesion')?.addEventListener('click', () => {
        localStorage.removeItem('sesion_activa');
        window.location.href = 'login.html';
    });

    cargarTablaUsuariosLectura();
    cargarTablaCitas();
    cargarTablaMensajes();
    configurarAgendamientoManual();
    configurarModalModificar();
});

const obtenerDatos = (clave) => JSON.parse(localStorage.getItem(clave)) || [];
const guardarDatos = (clave, datos) => localStorage.setItem(clave, JSON.stringify(datos));

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
                    <button class="btn btn-outline-warning btn-sm py-0 px-2 me-1" onclick="abrirModalModificar(${index})">Modificar</button>
                    <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="eliminarCita(${index})">Cancelar</button>
                </td>
            </tr>`;
    });
}

function cargarTablaMensajes() {
    const tbody = document.getElementById('tabla-mensajes-body');
    if (!tbody) return;

    const mensajes = obtenerDatos('mensajes_contacto');
    tbody.innerHTML = '';

    if (mensajes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay mensajes de contacto nuevos.</td></tr>`;
        return;
    }

    mensajes.forEach((m) => {
        tbody.innerHTML += `
            <tr>
                <td><small class="text-muted">${m.fecha}</small></td>
                <td class="fw-semibold">${m.nombre}</td>
                <td><a href="mailto:${m.email}" class="text-decoration-none">${m.email}</a></td>
                <td><span class="text-secondary">${m.comentario}</span></td>
            </tr>`;
    });
}

// Abrir modal de modificación en recepción
window.abrirModalModificar = function(index) {
    let citas = obtenerDatos('citas_vet');
    let cita = citas[index];

    document.getElementById('mod-index-cita').value = index;
    const fechaInput = document.getElementById('mod-fecha');
    
    const ahoraLocal = new Date();
    const anioL = ahoraLocal.getFullYear();
    const mesL = String(ahoraLocal.getMonth() + 1).padStart(2, '0');
    const diaL = String(ahoraLocal.getDate()).padStart(2, '0');
    fechaInput.min = `${anioL}-${mesL}-${diaL}`;
    
    fechaInput.value = cita.fecha;
    document.getElementById('mod-hora').value = cita.hora;

    let modalEl = document.getElementById('modalModificarCita');
    let modal = new bootstrap.Modal(modalEl);
    modal.show();
};

function configurarModalModificar() {
    const formModificar = document.getElementById('form-modificar-cita');
    if (!formModificar) return;

    formModificar.addEventListener('submit', function(e) {
        e.preventDefault();

        const index = document.getElementById('mod-index-cita').value;
        const nuevaFecha = document.getElementById('mod-fecha').value;
        const nuevaHora = document.getElementById('mod-hora').value;

        let citas = obtenerDatos('citas_vet');

        const ahoraLocal = new Date();
        const anioL = ahoraLocal.getFullYear();
        const mesL = String(ahoraLocal.getMonth() + 1).padStart(2, '0');
        const diaL = String(ahoraLocal.getDate()).padStart(2, '0');
        const hoyStr = `${anioL}-${mesL}-${diaL}`;

        if (nuevaFecha < hoyStr) {
            alert("⚠️ No puedes programar una cita en una fecha pasada.");
            return;
        }

        const horarioOcupado = citas.some((c, idx) => idx != index && c.fecha === nuevaFecha && c.hora === nuevaHora);
        if (horarioOcupado) {
            alert("⚠️ Error: Ya existe otra cita agendada en ese mismo día y horario.");
            return;
        }

        citas[index].fecha = nuevaFecha;
        citas[index].hora = nuevaHora;

        guardarDatos('citas_vet', citas);

        let modalEl = document.getElementById('modalModificarCita');
        let modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        alert("¡Cita modificada con éxito desde Recepción!");
        cargarTablaCitas();
    });
}

window.eliminarCita = function(index) {
    if (confirm("¿Estás seguro de cancelar esta cita médica?")) {
        let citas = obtenerDatos('citas_vet');
        citas.splice(index, 1);
        guardarDatos('citas_vet', citas);
        cargarTablaCitas();
    }
};

// Configuración de agendamiento manual en recepción con validación exacta de horas (Pasada, Ocupada, Disponible)
function configurarAgendamientoManual() {
    const formManual = document.getElementById('form-cita-manual');
    const fechaInput = document.getElementById('manual-fecha');
    const horaSelect = document.getElementById('manual-hora');

    if (!formManual || !fechaInput || !horaSelect) return;

    const ahoraLocal = new Date();
    const anioL = ahoraLocal.getFullYear();
    const mesL = String(ahoraLocal.getMonth() + 1).padStart(2, '0');
    const diaL = String(ahoraLocal.getDate()).padStart(2, '0');
    const hoyStr = `${anioL}-${mesL}-${diaL}`;

    fechaInput.min = hoyStr;
    fechaInput.addEventListener('change', actualizarHorasDisponibles);

    function actualizarHorasDisponibles() {
        const fechaSel = fechaInput.value;
        const ahora = new Date();
        
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const hoyActualStr = `${anio}-${mes}-${dia}`;

        const horaActual = ahora.getHours();
        const minActual = ahora.getMinutes();
        
        const horasOcupadas = obtenerDatos('citas_vet')
            .filter(c => c.fecha === fechaSel)
            .map(c => c.hora);

        horaSelect.innerHTML = '<option value="" selected disabled>-- Seleccione una hora --</option>';
        const horariosFijos = ["10:00", "11:30", "15:00", "17:15"];

        horariosFijos.forEach(h => {
            let deshabilitar = false;
            let textoExtra = " (Disponible)";

            if (fechaSel === hoyActualStr) {
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
            
            const ahoraN = new Date();
            const anioN = ahoraN.getFullYear();
            const mesN = String(ahoraN.getMonth() + 1).padStart(2, '0');
            const diaN = String(ahoraN.getDate()).padStart(2, '0');
            fechaInput.min = `${anioN}-${mesN}-${diaN}`;

            horaSelect.innerHTML = '<option value="" selected disabled>-- Primero seleccione una fecha --</option>';
            cargarTablaCitas();
        }
    });
}