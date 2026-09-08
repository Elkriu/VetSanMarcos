document.addEventListener('DOMContentLoaded', function() {
    // 1. Validar sesión activa exclusiva para Recepcionista (o Administrador)
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

    document.getElementById('btn-cerrar-sesion')?.addEventListener('click', function() {
        localStorage.removeItem('sesion_activa');
        window.location.href = 'login.html';
    });

    // Cargar datos en las tablas
    cargarTablaUsuariosLectura();
    cargarTablaCitas();
});

// Obtener datos del localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
}

// Cargar listado de usuarios en modo lectura (sin botones destructivos de edición o eliminación)
function cargarTablaUsuariosLectura() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    obtenerUsuarios().forEach((usr) => {
        let estadoBadge = usr.suspendido ? '<span class="badge bg-danger">Suspendido</span>' : '<span class="badge bg-success">Activo</span>';

        tbody.innerHTML += `<tr>
            <td class="fw-semibold">${usr.nombre || 'Sin nombre'}</td>
            <td>${usr.email}</td>
            <td><span class="badge bg-secondary">${usr.rol}</span></td>
            <td>${estadoBadge}</td>
        </tr>`;
    });
}

// Cargar citas agendadas para que la recepcionista las supervise
function cargarTablaCitas() {
    const tbody = document.getElementById('tabla-citas-body');
    if (!tbody) return;

    const citas = JSON.parse(localStorage.getItem('citas_vet')) || [];
    
    tbody.innerHTML = citas.length === 0 
        ? `<tr><td colspan="3" class="text-center text-muted py-3">No hay citas agendadas actualmente.</td></tr>`
        : citas.map(c => `<tr><td><span class="fw-semibold text-primary">${c.servicio}</span></td><td>${c.fecha}</td><td>${c.hora}</td></tr>`).join('');
}