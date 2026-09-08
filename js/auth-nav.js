document.addEventListener('DOMContentLoaded', function() {
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    const authContainer = document.getElementById('nav-auth-container');

    if (authContainer && sesionActiva) {
        let destinoPanel = 'inicio.html';
        let textoBotonPanel = 'Mis Citas';

        // Validar el destino exacto según el rol del usuario activo
        if (sesionActiva.rol === 'Administrador') {
            destinoPanel = 'admin.html';
            textoBotonPanel = 'Panel Admin';
        } else if (sesionActiva.rol === 'Recepcionista') {
            destinoPanel = 'recepcion.html'; 
            textoBotonPanel = 'Panel Recepción';
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