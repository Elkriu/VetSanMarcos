document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const contenedor = document.getElementById('contenido-detalle');
    if (!contenedor) return;

    const noticias = {
        "1": {
            titulo: "Importancia de la Vacunación Anual en Perros y Gatos",
            categoria: "Prevención",
            fecha: "10 de Mayo, 2026",
            imagen: "img/vacuna.jpg", 
            texto: "La vacunación es el pilar fundamental de la medicina preventiva veterinaria. Aplicar los refuerzos anuales protege a tu mascota contra patógenos altamente contagiosos como el parvovirus, la rabia y el distemper en canes, o la leucemia felina en gatos. En la Veterinaria San Marcos contamos con registros digitales para avisarte oportunamente cuando a tu compañero le corresponda su próxima dosis."
        },
        "2": {
            titulo: "Control de Peso: Evitando la Obesidad Felina y Canina",
            categoria: "Nutrición",
            fecha: "2 de Junio, 2026",
            imagen: "img/nutricion.jpg", 
            texto: "El sobrepeso en mascotas reduce considerablemente su expectativa de vida y predispone a problemas articulares, diabetes y patologías cardíacas. Durante nuestras consultas de control de peso en la clínica, evaluamos la condición corporal de tu mascota y diseñamos una pauta nutricional equilibrada adaptada a su edad, raza y nivel de actividad física."
        },
        "3": {
            titulo: "Cuidados Esenciales para Aves Domésticas y Exóticas",
            categoria: "Especialidades",
            fecha: "15 de Junio, 2026",
            imagen: "img/aves.webp", 
            texto: "Las aves de compañía requieren un monitoreo constante de su plumaje, una dieta rica en semillas seleccionadas y pellet, además de revisiones periódicas del pico y las uñas. En nuestra clínica entregamos asesoría experta para asegurar un hábitat adecuado que prevenga el estrés y enfermedades respiratorias comunes."
        },
        "4": {
            titulo: "Medicina Preventiva y Bienestar en Conejos",
            categoria: "Exóticos",
            fecha: "28 de Junio, 2026",
            imagen: "img/conejos.jpg", 
            texto: "Los conejos son animales muy sensibles que necesitan una alimentación basada principalmente en heno fresco y agua constante. Sus dientes crecen sin parar, por lo que el desgaste adecuado es vital. Realizamos controles médicos especializados para prevenir problemas digestivos y dentales en lagomorfos."
        }
    };

    if (noticias[id]) {
        let n = noticias[id];
        contenedor.innerHTML = `
            <span class="badge bg-primary bg-opacity-10 text-White w-fit px-2 py-1 rounded small mb-2">${n.categoria}</span>
            <h1 class="fw-bold text-dark mb-2">${n.titulo}</h1>
            <p class="text-muted small mb-4">Publicado el ${n.fecha}</p>
            <div class="mb-4 text-center">
                <img src="${n.imagen}" alt="${n.titulo}" class="img-fluid rounded-4 shadow-sm" style="max-height: 350px; width: 100%; object-fit: cover;">
            </div>
            <p class="text-secondary lh-lg">${n.texto}</p>
        `;
    } else {
        contenedor.innerHTML = `<h3 class="text-danger">Artículo no encontrado.</h3><a href="novedades.html" class="btn btn-primary mt-3">Volver</a>`;
    }
});