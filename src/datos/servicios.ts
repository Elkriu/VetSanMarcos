export interface Servicio {
    id: number;
    nombre: string;
    categoria: string;
    imagen: string;
    resumen: string;
    precio: string;
    valorNumerico: number;
    descripcionAmpliada: string;
}

export const servicios: Servicio[] = [
    {
        id: 1,
        nombre: "Consulta General",
        categoria: "Medicina General",
        imagen: "/img/consulta.png",
        resumen: "Revisión completa de la salud y estado físico de tu mascota.",
        precio: "$20.000",
        valorNumerico: 20000,
        descripcionAmpliada: "Nuestra consulta general incluye un examen físico completo, revisión de signos vitales, pesaje, evaluación de la condición corporal y auscultación cardíaca/pulmonar.",
    },
    {
        id: 2,
        nombre: "Vacunación",
        categoria: "Prevención",
        imagen: "/img/vacunacion.webp",
        resumen: "Esquemas de vacunación completos para proteger a tu mascota.",
        precio: "$15.000",
        valorNumerico: 15000,
        descripcionAmpliada: "Mantener el calendario de vacunación al día es vital para prevenir enfermedades mortales. Aplicamos vacunas de acuerdo a los protocolos vigentes de inmunización.",
    },
    {
        id: 3,
        nombre: "Cirugía Menor",
        categoria: "Pabellón",
        imagen: "/img/cirugia.png",
        resumen: "Procedimientos quirúrgicos de baja complejidad con alta seguridad.",
        precio: "Previa evaluación",
        valorNumerico: 0,
        descripcionAmpliada: "Realizamos cirugías de tejidos blandos de menor complejidad, curaciones profundas y suturas, siempre priorizando el manejo del dolor y la pronta recuperación en nuestro pabellón equipado.",
    },
    {
        id: 4,
        nombre: "Desparasitación",
        categoria: "Prevención",
        imagen: "/img/desparasitacion.png",
        resumen: "Manejo y control de parásitos internos y externos.",
        precio: "$10.000",
        valorNumerico: 10000,
        descripcionAmpliada: "Entregamos asesoría y administración de antiparasitarios internos y externos según el peso, especie y estilo de vida de tu mascota para mantenerla libre de pulgas, garrapatas y parásitos intestinales.",
    },
    {
        id: 5,
        nombre: "Control de Peso",
        categoria: "Nutrición",
        imagen: "/img/control.avif",
        resumen: "Evaluación nutricional y seguimiento para un peso ideal.",
        precio: "Previa evaluación",
        valorNumerico: 0,
        descripcionAmpliada: "Evaluamos la condición corporal de tu mascota y diseñamos una pauta nutricional equilibrada adaptada a su edad, raza y nivel de actividad física para evitar la obesidad y problemas articulares.",
    },
];