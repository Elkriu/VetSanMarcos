document.addEventListener('DOMContentLoaded', function() {
    // 1. Validar que haya una sesión activa de cliente
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    
    if (!sesionActiva) {
        alert("Acceso denegado. Debes iniciar sesión para ver tus citas.");
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del usuario en el navbar
    const infoCliente = document.getElementById('info-usuario-cliente');
    if (infoCliente) {
        infoCliente.innerHTML = `👤 <b>${sesionActiva.nombre}</b>`;
    }

    cargarMisCitas(sesionActiva.email);
});

function cargarMisCitas(emailUsuario) {
    const tbody = document.getElementById('tabla-mis-citas-body');
    if (!tbody) return;

    // Obtenemos todas las citas guardadas
    const todasLasCitas = JSON.parse(localStorage.getItem('citas_vet')) || [];
    
    // FILTRAR ESTRICTAMENTE por el correo del usuario activo (comparando en minúsculas)
    const misCitas = todasLasCitas.filter(c => {
        // Verificamos tanto 'emailCliente' como cualquier otra propiedad de correo por seguridad
        const correoCita = c.emailCliente || c.email || '';
        if (!correoCita) return false;
        return correoCita.toLowerCase() === emailUsuario.toLowerCase();
    });
    
    tbody.innerHTML = '';
    if (misCitas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No tienes citas médicas agendadas en este momento.</td></tr>`;
        return;
    }

    misCitas.forEach(cita => {
        let mascotaTexto = cita.tipoMascota ? cita.tipoMascota : 'No especificada';
        
        tbody.innerHTML += `
            <tr>
                <td><span class="fw-semibold text-primary">${cita.servicio}</span></td>
                <td><span class="badge bg-info text-dark">${mascotaTexto}</span></td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td class="text-end"><span class="badge bg-success">Confirmada</span></td>
            </tr>
        `;
    });
}