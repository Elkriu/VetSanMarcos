document.addEventListener('DOMContentLoaded', function() {
    
    if (!localStorage.getItem('usuarios_sistema')) {
        localStorage.setItem('usuarios_sistema', JSON.stringify([
            { email: 'admin@sanmarcos.cl', password: 'Admin1!', rol: 'Administrador', nombre: 'Carlos Admin', suspendido: false },
            { email: 'recepcion@sanmarcos.cl', password: 'Recepc1!', rol: 'Recepcionista', nombre: 'Camila Riquelme', suspendido: false },
            { email: 'cliente@gmail.com', password: 'Cliente1!', rol: 'Cliente', nombre: 'Juan Bravo', suspendido: false }
        ]));
    }

    const sLogin = document.getElementById('seccion-login');
    const sReg = document.getElementById('seccion-registro');
    
    document.getElementById('ir-a-registro')?.addEventListener('click', (e) => { e.preventDefault(); sLogin.style.display = 'none'; sReg.style.display = 'block'; });
    document.getElementById('ir-a-login')?.addEventListener('click', (e) => { e.preventDefault(); sReg.style.display = 'none'; sLogin.style.display = 'block'; });

    const rxCorreo = /^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|duoc|support|sanmarcos)\.(com|cl|net|org)$/;
    const rxPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;
    
    // Expresión regular para el RUN: 7 a 8 dígitos seguidos de un dígito verificador (0-9 o K/k), sin puntos ni guion (Total: 8 a 9 caracteres)
    const rxRun = /^[0-9]{7,8}[0-9kK]$/;

    function marcarCampo(input, esValido, mensajeError = '') {
        input.classList.remove('is-valid', 'is-invalid');
        input.classList.add(esValido ? 'is-valid' : 'is-invalid');
        let errorSpan = document.getElementById(`error-${input.id}`);
        if (errorSpan) errorSpan.textContent = mensajeError;
    }

    document.getElementById('form-login')?.addEventListener('submit', function(e) {
        e.preventDefault();
        let emailInput = document.getElementById('login-email');
        let passInput = document.getElementById('login-password');
        let email = emailInput.value.trim().toLowerCase();
        let pass = passInput.value;

        let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
        let user = usuarios.find(u => u.email.toLowerCase() === email && u.password === pass);

        if (user) {
            if (user.suspendido) {
                alert('Acceso denegado: Su cuenta se encuentra suspendida.');
                return;
            }
            alert(`¡Bienvenido, ${user.nombre}! Redirigiendo...`);
            localStorage.setItem('sesion_activa', JSON.stringify(user));
            
            if (user.rol === 'Administrador') {
                window.location.href = 'admin.html';
            } else if (user.rol === 'Recepcionista') {
                window.location.href = 'recepcion.html';
            } else {
                window.location.href = 'inicio.html';
            }
        } else {
            emailInput.classList.add('is-invalid');
            passInput.classList.add('is-invalid');
            document.getElementById('error-login-email').textContent = 'Correo o contraseña incorrectos.';
        }
    });

    document.getElementById('form-registro')?.addEventListener('submit', function(e) {
        e.preventDefault();
        let run = document.getElementById('reg-run');
        let nombre = document.getElementById('reg-nombre');
        let apellido = document.getElementById('reg-apellido');
        let email = document.getElementById('reg-email');
        let pass = document.getElementById('reg-password');

        let ok = true;

        // Validación estricta del RUN: 8 a 9 caracteres, sin puntos ni guion, terminando en número o K
        let runVal = run.value.trim();
        if (!rxRun.test(runVal)) {
            marcarCampo(run, false, 'El RUN debe tener entre 8 y 9 caracteres en total, sin puntos ni guion (ej: 123456789 o 12345678K).'); 
            ok = false; 
        } else { 
            marcarCampo(run, true); 
        }

        if (!nombre.value.trim() || nombre.value.length > 50) { marcarCampo(nombre, false); ok = false; } else { marcarCampo(nombre, true); }
        if (!apellido.value.trim() || apellido.length > 100) { marcarCampo(apellido, false); ok = false; } else { marcarCampo(apellido, true); }

        if (!rxCorreo.test(email.value.trim())) {
            marcarCampo(email, false, 'Ingrese un correo válido.'); ok = false;
        } else { marcarCampo(email, true); }

        if (!rxPass.test(pass.value)) {
            marcarCampo(pass, false, 'Debe tener 4-10 caracteres, letras, números y un símbolo.'); ok = false;
        } else { marcarCampo(pass, true); }

        if (ok) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
            let mailUser = email.value.trim().toLowerCase();

            if (usuarios.some(u => u.email.toLowerCase() === mailUser)) {
                alert('Este correo ya está registrado.');
                return;
            }

            usuarios.push({
                run: runVal,
                email: mailUser,
                password: pass.value,
                rol: 'Cliente',
                nombre: `${nombre.value.trim()} ${apellido.value.trim()}`,
                suspendido: false
            });

            localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            this.reset();
            document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
            sReg.style.display = 'none';
            sLogin.style.display = 'block';
        }
    });
});