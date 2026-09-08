document.addEventListener('DOMContentLoaded', function() {
    
    // USUARIOS PRECARGADOS CON LOCALSTORAGE
    if (!localStorage.getItem('usuarios_sistema')) {
        const usuariosIniciales = [
            { email: 'admin@sanmarcos.cl', password: 'Admin1!', rol: 'Administrador', nombre: 'Carlos Admin' },
            { email: 'recepcion@sanmarcos.cl', password: 'Recepc1!', rol: 'Recepcionista', nombre: 'Ana Recepción' },
            { email: 'cliente@gmail.com', password: 'Cliente1!', rol: 'Cliente', nombre: 'Juan Bravo' }
        ];
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosIniciales));
    }

    // INTERRUPTOR DE LOGIN <--> REGISTER
    const seccionLogin = document.getElementById('seccion-login');
    const seccionRegistro = document.getElementById('seccion-registro');
    const irARegistro = document.getElementById('ir-a-registro');
    const irALogin = document.getElementById('ir-a-login');

    if (irARegistro && irALogin) {
        irARegistro.addEventListener('click', function(e) {
            e.preventDefault();
            seccionLogin.style.display = 'none';
            seccionRegistro.style.display = 'block';
        });

        irALogin.addEventListener('click', function(e) {
            e.preventDefault();
            seccionRegistro.style.display = 'none';
            seccionLogin.style.display = 'block';
        });
    }

    const regexCorreo = /^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|duoc|support|sanmarcos)\.(com|cl|net|org)$/;
    const regexPasswordSegura = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;

    // VALIDACIONES Y VERIFICACION DE LOGIN
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            let email = document.getElementById('login-email').value.trim();
            let password = document.getElementById('login-password').value;
            let isValid = true;

            if (!email || !regexCorreo.test(email)) {
                document.getElementById('login-email').classList.add('is-invalid');
                document.getElementById('error-login-email').textContent = 'Ingrese un correo válido.';
                isValid = false;
            } else {
                document.getElementById('login-email').classList.remove('is-invalid');
                document.getElementById('login-email').classList.add('is-valid');
            }

            if (!password || password.length < 4 || password.length > 10) {
                document.getElementById('login-password').classList.add('is-invalid');
                document.getElementById('error-login-password').textContent = 'La contraseña debe tener entre 4 y 10 caracteres.';
                isValid = false;
            } else {
                document.getElementById('login-password').classList.remove('is-invalid');
                document.getElementById('login-password').classList.add('is-valid');
            }

            if (isValid) {
                let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
                let usuarioEncontrado = listaUsuarios.find(u => u.email === email && u.password === password);

                if (usuarioEncontrado) {
                    alert(`¡Bienvenido, ${usuarioEncontrado.nombre}! Rol detectado: ${usuarioEncontrado.rol}. Redirigiendo...`);
                    
                    // Guardar sesion actual activa
                    localStorage.setItem('sesion_activa', JSON.stringify(usuarioEncontrado));
                    
                    // Redirigir según el rol del usuario
                    if (usuarioEncontrado.rol === 'Administrador' || usuarioEncontrado.rol === 'Recepcionista') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'inicio.html';
                    }
                } else {
                    alert('Error: Correo o contraseña incorrectos, o el usuario no está registrado.');
                }
            }
        });
    }

    // REGISTRO Y GUARDADO EN LOCALSTORAGE
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            let run = document.getElementById('reg-run').value.trim();
            let nombre = document.getElementById('reg-nombre').value.trim();
            let apellido = document.getElementById('reg-apellido').value.trim();
            let email = document.getElementById('reg-email').value.trim();
            let password = document.getElementById('reg-password').value;
            let isValid = true;

            if (!run || run.length < 7 || run.includes('.') || run.includes('-')) {
                document.getElementById('reg-run').classList.add('is-invalid');
                document.getElementById('error-reg-run').textContent = 'El RUN debe ir sin puntos ni guion.';
                isValid = false;
            } else {
                document.getElementById('reg-run').classList.remove('is-invalid');
                document.getElementById('reg-run').classList.add('is-valid');
            }

            if (!nombre || nombre.length > 50) {
                document.getElementById('reg-nombre').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('reg-nombre').classList.remove('is-invalid');
                document.getElementById('reg-nombre').classList.add('is-valid');
            }

            if (!apellido || apellido.length > 100) {
                document.getElementById('reg-apellido').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('reg-apellido').classList.remove('is-invalid');
                document.getElementById('reg-apellido').classList.add('is-valid');
            }

            if (!email || !regexCorreo.test(email)) {
                document.getElementById('reg-email').classList.add('is-invalid');
                document.getElementById('error-reg-email').textContent = 'Ingrese un correo válido.';
                isValid = false;
            } else {
                document.getElementById('reg-email').classList.remove('is-invalid');
                document.getElementById('reg-email').classList.add('is-valid');
            }

            if (!password || !regexPasswordSegura.test(password)) {
                document.getElementById('reg-password').classList.add('is-invalid');
                document.getElementById('error-reg-password').textContent = 'Debe tener 4 a 10 caracteres, letras, números y un símbolo.';
                isValid = false;
            } else {
                document.getElementById('reg-password').classList.remove('is-invalid');
                document.getElementById('reg-password').classList.add('is-valid');
            }

            if (isValid) {
                let listaUsuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
                
                let existe = listaUsuarios.some(u => u.email === email);
                if (existe) {
                    alert('Este correo ya está registrado en el sistema.');
                    return;
                }

                let nuevoUsuario = {
                    email: email,
                    password: password,
                    rol: 'Cliente',
                    nombre: nombre + ' ' + apellido
                };

                listaUsuarios.push(nuevoUsuario);
                localStorage.setItem('usuarios_sistema', JSON.stringify(listaUsuarios));

                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                formRegistro.reset();
                document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
                
                seccionRegistro.style.display = 'none';
                seccionLogin.style.display = 'block';
            }
        });
    }
});