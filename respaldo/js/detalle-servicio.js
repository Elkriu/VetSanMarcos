document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Arreglo actualizado con los servicios del formulario
    const arregloServicios = [
        {
            id: 1,
            nombre: "Consulta General",
            categoria: "Medicina General",
            imagen: "img/consulta.png", 
            resumen: "Revisión completa de la salud y estado físico de tu mascota.",
            precio: "$20.000",
            valorNumerico: 20000, 
            descripcionAmpliada: "Nuestra consulta general incluye un examen físico completo, revisión de signos vitales, pesaje, evaluación de la condición corporal y auscultación cardíaca/pulmonar."
        },
        {
            id: 2,
            nombre: "Vacunación",
            categoria: "Prevención",
            imagen: "img/vacunacion.webp", 
            resumen: "Esquemas de vacunación completos para proteger a tu mascota.",
            precio: "$15.000",
            valorNumerico: 15000,
            descripcionAmpliada: "Mantener el calendario de vacunación al día es vital para prevenir enfermedades mortales. Aplicamos vacunas de acuerdo a los protocolos vigentes de inmunización."
        },
        {
            id: 3,
            nombre: "Cirugía Menor",
            categoria: "Pabellón",
            imagen: "img/cirugia.png", 
            resumen: "Procedimientos quirúrgicos de baja complejidad con alta seguridad.",
            precio: "Previa evaluación",
            valorNumerico: 0,
            descripcionAmpliada: "Realizamos cirugías de tejidos blandos de menor complejidad, curaciones profundas y suturas, siempre priorizando el manejo del dolor y la pronta recuperación en nuestro pabellón equipado."
        },
        {
            id: 4,
            nombre: "Desparasitación",
            categoria: "Prevención",
            imagen: "img/desparasitacion.png", 
            resumen: "Manejo y control de parásitos internos y externos.",
            precio: "$10.000",
            valorNumerico: 10000,
            descripcionAmpliada: "Entregamos asesoría y administración de antiparasitarios internos y externos según el peso, especie y estilo de vida de tu mascota para mantenerla libre de pulgas, garrapatas y parásitos intestinales."
        },
        {
            id: 5,
            nombre: "Control de Peso",
            categoria: "Nutrición",
            imagen: "img/control.avif", 
            resumen: "Evaluación nutricional y seguimiento para un peso ideal.",
            precio: "Previa evaluación",
            valorNumerico: 0,
            descripcionAmpliada: "Evaluamos la condición corporal de tu mascota y diseñamos una pauta nutricional equilibrada adaptada a su edad, raza y nivel de actividad física para evitar la obesidad y problemas articulares."
        }
    ];

    // --- 1. LÓGICA DE LA LISTA DE INTERÉS (PANEL SUPERIOR) ---
    const contenedorLista = document.getElementById('resumen-seleccion');

    function actualizarPanelInteres() {
        if (!contenedorLista) return;
        
        let lista = JSON.parse(localStorage.getItem('listaInteresVeterinaria')) || [];
        
        if (lista.length === 0) {
            contenedorLista.innerHTML = '<span class="text-muted small fst-italic">Aún no has seleccionado servicios.</span>';
            return;
        }

        let htmlBadges = '';
        let totalEstimado = 0;
        let incluyeEvaluacion = false;

        lista.forEach(item => {
            const servicio = arregloServicios.find(s => s.id === item.id);
            if (servicio) {
                totalEstimado += servicio.valorNumerico;
                if (servicio.valorNumerico === 0) incluyeEvaluacion = true;
            }

            htmlBadges += `
                <span class="badge bg-primary text-white px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                    ${item.nombre}
                    <button type="button" class="btn-close btn-close-white" style="font-size: 0.5rem;" onclick="eliminarDeLista(${item.id})" aria-label="Eliminar"></button>
                </span>
            `;
        });

        let textoPrecio = `$${totalEstimado.toLocaleString('es-CL')}`;
        if (incluyeEvaluacion && totalEstimado === 0) {
            textoPrecio = "A evaluar en consulta";
        } else if (incluyeEvaluacion) {
            textoPrecio += " (+ evaluaciones)";
        }

        contenedorLista.innerHTML = `
            <div class="d-flex flex-column align-items-md-end gap-3 w-100">
                <div class="d-flex gap-2 flex-wrap justify-content-md-end">
                    ${htmlBadges}
                </div>
                <div class="d-flex align-items-center gap-3 bg-light px-3 py-2 rounded-3 border">
                    <span class="text-dark mb-0">Total estimado: <strong class="fs-5 text-primary">${textoPrecio}</strong></span>
                    <a href="agenda.html" class="btn btn-success fw-semibold shadow-sm">🗓️ Agendar</a>
                </div>
            </div>
        `;
    }

    window.agregarALista = function(id, nombre) {
        let lista = JSON.parse(localStorage.getItem('listaInteresVeterinaria')) || [];
        if (!lista.find(item => item.id === id)) {
            lista.push({ id: id, nombre: nombre });
            localStorage.setItem('listaInteresVeterinaria', JSON.stringify(lista));
            actualizarPanelInteres(); 
        } else {
            alert("Este servicio ya está en tu lista.");
        }
    };

    window.eliminarDeLista = function(id) {
        let lista = JSON.parse(localStorage.getItem('listaInteresVeterinaria')) || [];
        lista = lista.filter(item => item.id !== id);
        localStorage.setItem('listaInteresVeterinaria', JSON.stringify(lista));
        actualizarPanelInteres(); 
    };

    actualizarPanelInteres();


   // --- 2. LÓGICA DEL CATÁLOGO DE SERVICIOS ---
    const contenedorCatalogo = document.getElementById('catalogo-servicios');
    if (contenedorCatalogo) {
        let htmlCatalogo = '';
        arregloServicios.forEach(s => {
            htmlCatalogo += `
                <div class="col-md-6 col-lg-3 mb-4">
                    <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
                        
                        <!-- Clase w-100 y display: block obligan a la foto a estirarse de lado a lado -->
                        <img src="${s.imagen}" class="w-100" alt="${s.nombre}" style="height: 200px; object-fit: cover; object-position: center; display: block;">
                        
                        <div class="card-body p-4 d-flex flex-column align-items-center">
                            <span class="badge bg-primary text-white px-3 py-2 rounded-pill small mb-3">${s.categoria}</span>
                            <h3 class="fw-bold h6 text-dark">${s.nombre}</h3>
                            <p class="text-muted small my-2">${s.resumen}</p>
                            <p class="text-dark fw-semibold mb-3">${s.precio}</p>
                            
                            <div class="mt-auto pt-3 d-flex flex-column gap-2 w-100">
                                <button class="btn btn-outline-success btn-sm w-100 fw-semibold" onclick="agregarALista(${s.id}, '${s.nombre}')">
                                    + Añadir a mi lista
                                </button>
                                <a href="detalle-servicio.html?id=${s.id}" class="btn btn-outline-primary btn-sm w-100">Ver Detalles</a>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        });
        contenedorCatalogo.innerHTML = htmlCatalogo;
    }

    // --- 3. LÓGICA DE LA VISTA DE DETALLE ---
    const contenedorDetalle = document.getElementById('contenido-detalle-servicio');
    if (contenedorDetalle) {
        const params = new URLSearchParams(window.location.search);
        const idUrl = parseInt(params.get('id'));
        const servicioEncontrado = arregloServicios.find(s => s.id === idUrl);

        if (servicioEncontrado) {
            contenedorDetalle.innerHTML = `
                <span class="badge bg-primary bg-opacity-10 text-primary w-fit px-2 py-1 rounded small mb-2">${servicioEncontrado.categoria}</span>
                <h1 class="fw-bold text-dark mb-2">${servicioEncontrado.nombre}</h1>
                <h4 class="text-primary mb-4">${servicioEncontrado.precio}</h4>
                <div class="mb-4 text-center">
                    <img src="${servicioEncontrado.imagen}" alt="${servicioEncontrado.nombre}" class="img-fluid rounded-4 shadow-sm" style="max-height: 400px; width: 100%; object-fit: cover; background-color: #f8f9fa;">
                </div>
                <h5 class="fw-bold text-dark">Sobre este servicio:</h5>
                <p class="text-secondary lh-lg">${servicioEncontrado.descripcionAmpliada}</p>
                <div class="mt-4">
                    <a href="agenda.html" class="btn btn-primary">Agendar hora para este servicio</a>
                </div>
            `;
        }
    }
});