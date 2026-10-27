export interface Noticia {
    id: number;
    titulo: string;
    categoria: string;
    fecha: string;
    imagen: string;
    resumen: string;
    texto: string;
}

export const novedades: Noticia[] = [
    {
        id: 1,
        titulo: "Importancia de la Vacunación Anual en Perros y Gatos",
        categoria: "Prevención",
        fecha: "10 de Mayo, 2026",
        imagen: "/img/vacuna.jpg",
        resumen: "Protege a tu perro y gato frente a virus mortales con refuerzos al día.",
        texto: "La vacunación es el pilar fundamental de la medicina preventiva veterinaria. Aplicar los refuerzos anuales protege a tu mascota contra patógenos altamente contagiosos como el parvovirus, la rabia y el distemper en canes, o la leucemia felina en gatos. En la Veterinaria San Marcos contamos con registros digitales para avisarte oportunamente cuando a tu compañero le corresponda su próxima dosis.",
    },
    {
        id: 2,
        titulo: "Control de Peso: Evitando la Obesidad Felina y Canina",
        categoria: "Nutrición",
        fecha: "2 de Junio, 2026",
        imagen: "/img/nutricion.jpg",
        resumen: "Consejos de porciones y rutinas saludables para evitar problemas cardíacos.",
        texto: "El sobrepeso en mascotas reduce considerablemente su expectativa de vida y predispone a problemas articulares, diabetes y patologías cardíacas. Durante nuestras consultas de control de peso en la clínica, evaluamos la condición corporal de tu mascota y diseñamos una pauta nutricional equilibrada adaptada a su edad, raza y nivel de actividad física.",
    },
    {
        id: 3,
        titulo: "Cuidados Esenciales para Aves Domésticas y Exóticas",
        categoria: "Especialidades",
        fecha: "15 de Junio, 2026",
        imagen: "/img/aves.webp",
        resumen: "Aprende sobre su hábitat, plumaje y alimentación equilibrada en casa.",
        texto: "Las aves de compañía requieren un monitoreo constante de su plumaje, una dieta rica en semillas seleccionadas y pellet, además de revisiones periódicas del pico y las uñas. En nuestra clínica entregamos asesoría experta para asegurar un hábitat adecuado que prevenga el estrés y enfermedades respiratorias comunes.",
    },
    {
        id: 4,
        titulo: "Medicina Preventiva y Bienestar en Conejos",
        categoria: "Exóticos",
        fecha: "28 de Junio, 2026",
        imagen: "/img/conejos.jpg",
        resumen: "Claves sobre el uso de heno fresco, desgaste dental y salud digestiva.",
        texto: "Los conejos son animales muy sensibles que necesitan una alimentación basada principalmente en heno fresco y agua constante. Sus dientes crecen sin parar, por lo que el desgaste adecuado es vital. Realizamos controles médicos especializados para prevenir problemas digestivos y dentales en lagomorfos.",
    },
];