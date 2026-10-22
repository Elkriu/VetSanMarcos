import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import CardServicio from "../componentes/moleculas/CardServicio";

const servicios = [
    {
        id: 1,
        nombre: "Consulta General",
        categoria: "Medicina General",
        imagen: "/img/consulta.png",
        resumen: "Revisión completa de la salud y estado físico de tu mascota.",
        precio: "$20.000",
    },
    {
        id: 2,
        nombre: "Vacunación",
        categoria: "Prevención",
        imagen: "/img/vacunacion.webp",
        resumen: "Esquemas de vacunación completos para proteger a tu mascota.",
        precio: "$15.000",
    },
    {
        id: 3,
        nombre: "Cirugía Menor",
        categoria: "Pabellón",
        imagen: "/img/cirugia.png",
        resumen: "Procedimientos quirúrgicos de baja complejidad con alta seguridad.",
        precio: "Previa evaluación",
    },
    {
        id: 4,
        nombre: "Desparasitación",
        categoria: "Prevención",
        imagen: "/img/desparasitacion.png",
        resumen: "Manejo y control de parásitos internos y externos.",
        precio: "$10.000",
    },
    {
        id: 5,
        nombre: "Control de Peso",
        categoria: "Nutrición",
        imagen: "/img/control.avif",
        resumen: "Evaluación nutricional y seguimiento para un peso ideal.",
        precio: "Previa evaluación",
    },
];

function Servicios() {
    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Nuestras Prestaciones"
                titulo="Servicios y"
                destacado="Especialidades"
                descripcion="Conoce las prestaciones disponibles para el cuidado preventivo y clínico de tu mascota."
            />

            <div className="row g-4 justify-content-center">
                {servicios.map((s) => (
                    <div className="col-md-6 col-lg-3" key={s.id}>
                        <CardServicio {...s} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Servicios;