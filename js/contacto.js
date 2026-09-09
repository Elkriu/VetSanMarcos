document.addEventListener('DOMContentLoaded', function() {
    const formContacto = document.getElementById('form-contacto-simple');
    
    if (!formContacto) return;

    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('contacto-nombre').value.trim();
        const email = document.getElementById('contacto-email').value.trim();
        const comentario = document.getElementById('contacto-comentario').value.trim();
        const fecha = new Date().toLocaleDateString('es-CL');

        if (nombre && email && comentario) {
            // Guardar el mensaje en LocalStorage para que la recepción pueda verlo
            const mensajes = JSON.parse(localStorage.getItem('mensajes_contacto')) || [];
            mensajes.push({ nombre, email, comentario, fecha });
            localStorage.setItem('mensajes_contacto', JSON.stringify(mensajes));

            const alerta = document.getElementById('alerta-contacto-exito');
            if (alerta) {
                alerta.classList.remove('d-none');
                this.reset();
                setTimeout(() => alerta.classList.add('d-none'), 4000);
            }
        }
    });
});