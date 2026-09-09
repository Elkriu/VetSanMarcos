document.addEventListener('DOMContentLoaded', function() {
    // 1. Validar sesión activa de Administrador o Recepcionista
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    if (!sesionActiva) {
        alert("Acceso denegado. Debe iniciar sesión.");
        window.location.href = 'login.html';
        return;
    }

    const infoAdmin = document.getElementById('info-usuario-admin');
    if (infoAdmin) {
        infoAdmin.innerHTML = `👤 <b>${sesionActiva.nombre}</b> <span class="badge bg-warning text-dark">${sesionActiva.rol}</span>`;
    }

    document.getElementById('btn-cerrar-sesion')?.addEventListener('click', function() {
        localStorage.removeItem('sesion_activa');
        window.location.href = 'login.html';
    });

    cargarTablaUsuarios();
    cargarTablaCitas();

    // 2. Manejar el formulario del modal (Crear o Editar)
    const formMantenedor = document.getElementById('form-mantenedor-usuario');
    formMantenedor?.addEventListener('submit', function(e) {
        e.preventDefault();
        let index = document.getElementById('usuario-index').value;
        let nombre = document.getElementById('admin-nombre').value.trim();
        let email = document.getElementById('admin-email').value.trim().toLowerCase();
        let password = document.getElementById('admin-password').value;
        let rol = document.getElementById('admin-rol').value;

        let usuarios = obtenerUsuarios();

        // Protección extra: Evitar cambiar el rol del admin principal
        if (index !== "" && usuarios[index].email === 'admin@sanmarcos.cl' && rol !== 'Administrador') {
            alert('No se puede cambiar el rol del administrador principal.');
            return;
        }

        if (index === "") {
            if (usuarios.some(u => u.email.toLowerCase() === email)) {
                alert('Ya existe un usuario registrado con este correo.');
                return;
            }
            usuarios.push({ email, password, rol, nombre, suspendido: false });
        } else {
            usuarios[index] = { ...usuarios[index], nombre, email, password, rol };
        }

        guardarUsuarios(usuarios);
        
        // Cerrar modal y limpiar
        bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
        cargarTablaUsuarios();
        formMantenedor.reset();
    });
});

// Funciones auxiliares para el manejo de localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
}

// Renderizar listado de usuarios
function cargarTablaUsuarios() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    obtenerUsuarios().forEach((usr, index) => {
        let estadoBadge = usr.suspendido ? '<span class="badge bg-danger">Suspendido</span>' : '<span class="badge bg-success">Activo</span>';
        let textoSuspender = usr.suspendido ? 'Activar' : 'Suspender';
        let claseSuspender = usr.suspendido ? 'btn-outline-success' : 'btn-outline-warning';

        tbody.innerHTML += `<tr>
            <td class="fw-semibold">${usr.nombre || 'Sin nombre'}</td>
            <td>${usr.email}</td>
            <td><span class="badge bg-secondary">${usr.rol}</span></td>
            <td>${estadoBadge}</td>
            <td class="text-end">
                <button class="btn btn-outline-primary btn-sm me-1" onclick="prepararEdicion(${index})">Editar</button>
                <button class="btn ${claseSuspender} btn-sm me-1" onclick="cambiarEstadoUsuario(${index})">${textoSuspender}</button>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarUsuario(${index})">Eliminar</button>
            </td>
        </tr>`;
    });
}

// Cargar citas agendadas
function cargarTablaCitas() {
    const tbody = document.getElementById('tabla-citas-body');
    if (!tbody) return;

    const citas = JSON.parse(localStorage.getItem('citas_vet')) || [];
    
    tbody.innerHTML = citas.length === 0 
        ? `<tr><td colspan="3" class="text-center text-muted py-3">No hay citas agendadas actualmente.</td></tr>`
        : citas.map(c => `<tr><td><span class="fw-semibold text-primary">${c.servicio}</span></td><td>${c.fecha}</td><td>${c.hora}</td></tr>`).join('');
}

// Preparar modal para crear
function prepararCreacion() {
    document.getElementById('titulo-modal').textContent = 'Crear Nuevo Usuario';
    document.getElementById('usuario-index').value = '';
    document.getElementById('form-mantenedor-usuario').reset();
}

// Preparar modal para editar
function prepararEdicion(index) {
    let usr = obtenerUsuarios()[index];
    document.getElementById('titulo-modal').textContent = 'Editar Usuario';
    document.getElementById('usuario-index').value = index;
    document.getElementById('admin-nombre').value = usr.nombre || '';
    document.getElementById('admin-email').value = usr.email || '';
    document.getElementById('admin-password').value = usr.password || '';
    document.getElementById('admin-rol').value = usr.rol || 'Cliente';

    new bootstrap.Modal(document.getElementById('modalUsuario')).show();
}

// Suspender o Activar usuario
function cambiarEstadoUsuario(index) {
    let usuarios = obtenerUsuarios();
    if (usuarios[index].email === 'admin@sanmarcos.cl') {
        alert('No se puede suspender al administrador principal.');
        return;
    }
    usuarios[index].suspendido = !usuarios[index].suspendido;
    guardarUsuarios(usuarios);
    cargarTablaUsuarios();
}

// Eliminar usuario definitivamente
function eliminarUsuario(index) {
    let usuarios = obtenerUsuarios();
    if (usuarios[index].email === 'admin@sanmarcos.cl') {
        alert('No se puede eliminar al administrador principal.');
        return;
    }
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuarios[index].email}?`)) {
        usuarios.splice(index, 1);
        guardarUsuarios(usuarios);
        cargarTablaUsuarios();
    }
}