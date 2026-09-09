document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    const authContainer = document.getElementById('nav-auth-container');

    if (authContainer && sesionActiva) {
        let destinoPanel = 'misCitas.html';
        let textoBotonPanel = 'Mis Citas';

        if (sesionActiva.rol === 'Administrador') {
            destinoPanel = 'admin.html';
            textoBotonPanel = 'Panel Admin';
        } else if (sesionActiva.rol === 'Recepcionista') {
            destinoPanel = 'recepcion.html';
            textoBotonPanel = 'Panel Recepción';
        } else if (sesionActiva.rol === 'Cliente') {
            destinoPanel = 'misCitas.html';
            textoBotonPanel = 'Mis Citas';
        }

        authContainer.innerHTML = `
            <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="small fw-semibold text-dark">👤 ${sesionActiva.nombre.split(' ')[0]}</span>
                <a href="${destinoPanel}" class="btn btn-outline-primary btn-sm">${textoBotonPanel}</a>
                <button id="btn-logout-publico" class="btn btn-outline-danger btn-sm">Salir</button>
            </div>
        `;

        document.getElementById('btn-logout-publico').addEventListener('click', function() {
            localStorage.removeItem('sesion_activa');
            window.location.reload();
        });
    }
});