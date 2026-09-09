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

    document.getElementById('btn-cerrar-sesion')?.addEventListener('click', function() {
        localStorage.removeItem('sesion_activa');
        window.location.href = 'login.html';
    });

    cargarTablaUsuariosLectura();
    cargarTablaCitas();
});

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
}

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

function cargarTablaCitas() {
    const tbody = document.getElementById('tabla-citas-body');
    if (!tbody) return;

    const citas = JSON.parse(localStorage.getItem('citas_vet')) || [];
    
    tbody.innerHTML = '';
    if (citas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay citas agendadas actualmente.</td></tr>`;
        return;
    }

    citas.forEach(c => {
        // Si hay citas viejas guardadas sin tipoMascota, evitamos que falle mostrando un texto por defecto
        let mascotaTexto = c.tipoMascota ? c.tipoMascota : 'No especificada';

        tbody.innerHTML += `
            <tr>
                <td><span class="fw-semibold text-primary">${c.servicio}</span></td>
                <td><span class="badge bg-info text-dark">${mascotaTexto}</span></td>
                <td>${c.fecha}</td>
                <td>${c.hora}</td>
            </tr>
        `;
    });
}