import BotonEnlace from "../componentes/atomos/BotonEnlace";
import Insignia from "../componentes/atomos/Insignia";
import Estadistica from "../componentes/moleculas/Estadistica";
import ImagenConEtiqueta from "../componentes/moleculas/ImagenConEtiqueta";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import CardServicioDestacado from "../componentes/moleculas/CardServicioDestacado";

const destacados = [
    { emoji: "🩺", titulo: "Consulta General", descripcion: "Evaluación física integral, revisión de signos vitales y diagnóstico clínico profesional.", precio: "Desde $20.000" },
    { emoji: "💉", titulo: "Vacunación", descripcion: "Administración de vacunas al día para proteger perros, gatos, aves y conejos.", precio: "Desde $15.000" },
    { emoji: "🛡️", titulo: "Desparasitación", descripcion: "Control y aplicación de tratamientos antiparasitarios internos y externos.", precio: "Desde $10.000" },
];

function Inicio() {
    return (
        <>
            <section className="container mb-5">
                <article className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <Insignia texto="🐾 Clínica Veterinaria en Rancagua" />
                        <h1 className="display-4 fw-bold text-dark lh-sm mb-3">
                            Para los que entendemos que <span className="text-primary">son familia</span>.
                        </h1>
                        <p className="text-muted lead mb-4">
                            Veterinaria San Marcos: Cuidando de tus fieles compañeros con vocación y experiencia
                            desde 2009. Deja atrás las fichas de papel y agenda en línea de forma rápida y segura.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mb-5">
                            <BotonEnlace texto="Ver Servicios" a="/servicios" tamano="lg" />
                            <BotonEnlace texto="Agendar Cita" a="/agenda" variante="outline-secondary" tamano="lg" />
                        </div>

                        <div className="row text-start border-top pt-4">
                            <div className="col-4"><Estadistica valor="2009" etiqueta="Fundación" /></div>
                            <div className="col-4"><Estadistica valor="4.9 ⭐" etiqueta="Confianza" /></div>
                            <div className="col-4"><Estadistica valor="+25" etiqueta="Pacientes diarios" /></div>
                        </div>
                    </div>

                    <div className="col-lg-6 text-center">
                        <ImagenConEtiqueta
                            src="/img/perro-gato-vet.png"
                            alt="Veterinaria San Marcos"
                            etiqueta="Atendidos con amor y profesionalismo"
                        />
                    </div>
                </article>
            </section>

            <section className="container my-5 py-4 border-top">
                <EncabezadoSeccion
                    insignia="Nuestras Alternativas"
                    titulo="Servicios"
                    destacado="Destacados"
                    descripcion="Conoce algunas de las prestaciones más solicitadas por nuestros pacientes diarios."
                />
                <div className="row g-4">
                    {destacados.map((s) => (
                        <div className="col-md-4" key={s.titulo}>
                            <CardServicioDestacado {...s} />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Inicio;