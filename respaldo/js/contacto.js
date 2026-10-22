document.addEventListener('DOMContentLoaded', function() {
    const formContacto = document.getElementById('form-contacto-simple');
    
    if (!formContacto) return;

    // Si hay un usuario con sesión activa, autocompletamos su correo y nombre
    const sesionActiva = JSON.parse(localStorage.getItem('sesion_activa'));
    if (sesionActiva) {
        const inputNombre = document.getElementById('contacto-nombre');
        const inputEmail = document.getElementById('contacto-email');
        if (inputNombre && !inputNombre.value) inputNombre.value = sesionActiva.nombre;
        if (inputEmail && !inputEmail.value) {
            inputEmail.value = sesionActiva.email;
            inputEmail.readOnly = true; // Opcional: bloqueamos para que no cambie su correo de cuenta
        }
    }

    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('contacto-nombre').value.trim();
        const email = document.getElementById('contacto-email').value.trim();
        const comentario = document.getElementById('contacto-comentario').value.trim();
        const fecha = new Date().toLocaleDateString('es-CL');

        if (nombre && email && comentario) {
            // Guardamos el mensaje para que llegue a la bandeja de la recepción
            const mensajes = JSON.parse(localStorage.getItem('mensajes_contacto')) || [];
            mensajes.push({ nombre, email, comentario, fecha });
            localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));

            const alerta = document.getElementById('alerta-contacto-exito');
            if (alerta) {
                alerta.classList.remove('d-none');
                this.reset();
                // Si estaba logueado, mantenemos su correo
                if (sesionActiva) {
                    document.getElementById('contacto-email').value = sesionActiva.email;
                    document.getElementById('contacto-nombre').value = sesionActiva.nombre;
                }
                setTimeout(() => alerta.classList.add('d-none'), 4000);
            }
        }
    });
});