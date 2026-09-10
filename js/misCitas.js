document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    
    if (!sesionActiva) {
        alert("Acceso denegado. Debes iniciar sesión para ver tus citas.");
        window.location.href = 'login.html';
        return;
    }

    const infoCliente = document.getElementById('info-usuario-cliente');
    if (infoCliente) {
        infoCliente.innerHTML = `👤 <b>${sesionActiva.nombre}</b>`;
    }

    cargarMisCitas(sesionActiva.email);
});

function cargarMisCitas(emailUsuario) {
    const tbody = document.getElementById('tabla-mis-citas-body');
    if (!tbody) return;

    const todasLasCitas = JSON.parse(localStorage.getItem('citas_vet')) || [];
    
    const misCitas = todasLasCitas.filter(c => {
        const correoCita = c.emailCliente || c.email || '';
        if (!correoCita) return false;
        return correoCita.toLowerCase() === emailUsuario.toLowerCase();
    });
    
    tbody.innerHTML = '';
    if (misCitas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No tienes citas médicas agendadas en este momento.</td></tr>`;
        return;
    }

    todasLasCitas.forEach((cita, indexGlobal) => {
        const correoCita = cita.emailCliente || cita.email || '';
        if (correoCita.toLowerCase() !== emailUsuario.toLowerCase()) return;

        let mascotaTexto = cita.tipoMascota || 'No especificada';
        
        tbody.innerHTML += `
            <tr>
                <td><span class="fw-semibold text-primary">${cita.servicio}</span></td>
                <td><span class="badge bg-info text-dark">${mascotaTexto}</span></td>
                <td>${cita.fecha}</td>
                <td>${cita.hora}</td>
                <td class="text-end">
                    <button class="btn btn-outline-danger btn-sm py-0 px-2" onclick="cancelarMiCita(${indexGlobal})">Cancelar</button>
                </td>
            </tr>
        `;
    });
}

window.cancelarMiCita = function(indexGlobal) {
    if (confirm("¿Estás seguro de cancelar esta cita médica?")) {
        let todasLasCitas = JSON.parse(localStorage.getItem('citas_vet')) || [];
        todasLasCitas.splice(indexGlobal, 1);
        localStorage.setItem('citas_vet', JSON.stringify(todasLasCitas));
        location.reload();
    }
};