import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import Insignia from "../componentes/atomos/Insignia";

function Nosotros() {
    return (
        <section className="container">
            {/* SECCIÓN HISTORIA */}
            <article className="row align-items-center g-5 mb-5">
                <div className="col-lg-6">
                    <img
                        src="/img/gato-vet.webp"
                        alt="Instalaciones Veterinaria San Marcos"
                        className="img-fluid rounded-4 shadow-lg w-100"
                        style={{ height: "380px", objectFit: "cover" }}
                    />
                </div>
                <div className="col-lg-6">
                    <Insignia texto="Nuestra Historia" />
                    <h1 className="display-5 fw-bold text-dark lh-sm mb-3">
                        Más de una década entregando <span className="text-primary">cuidado y bienestar</span>.
                    </h1>
                    <p className="text-muted mb-4">
                        Fundada en 2009, la <strong>Veterinaria San Marcos</strong> nació con la misión de
                        transformar la atención médica animal. Nos hemos consolidado como un centro clínico de
                        confianza, integrando tecnología de vanguardia, un equipo humano apasionado y un fuerte
                        compromiso con las familias y sus mascotas.
                    </p>
                    <p className="text-muted mb-0">
                        Creemos firmemente que cada mascota merece una atención digna, empática y de alta calidad
                        técnica, desde sus primeros meses de vida hasta su etapa dorada.
                    </p>
                </div>
            </article>

            {/* SECCIÓN PILARES */}
            <section className="text-center mb-5 pt-4">
                <EncabezadoSeccion
                    titulo="Lo que nos"
                    destacado="define"
                    descripcion="Pilares fundamentales en cada consulta y tratamiento"
                />

                <div className="row g-4 mt-2">
                    <div className="col-md-4">
                        <article className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white">
                            <div className="card-body">
                                <div className="fs-1 mb-3">🩺</div>
                                <h3 className="fw-bold h5 text-dark">Profesionalismo</h3>
                                <p className="text-muted small mb-0">
                                    Capacitación constante y protocolos médicos actualizados para garantizar
                                    diagnósticos certeros.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white">
                            <div className="card-body">
                                <div className="fs-1 mb-3">❤️</div>
                                <h3 className="fw-bold h5 text-dark">Empatía Animal</h3>
                                <p className="text-muted small mb-0">
                                    Tratamos a cada paciente con el respeto, amor y delicadeza que le darías en tu
                                    propio hogar.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-md-4">
                        <article className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white">
                            <div className="card-body">
                                <div className="fs-1 mb-3">⚡</div>
                                <h3 className="fw-bold h5 text-dark">Innovación</h3>
                                <p className="text-muted small mb-0">
                                    Modernizando los procesos mediante agendas digitales y expedientes clínicos
                                    accesibles.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* SECCIÓN EQUIPO MÉDICO */}
            <section className="text-center pt-3">
                <EncabezadoSeccion
                    titulo="Nuestro Equipo"
                    destacado="Médico"
                    descripcion="Especialistas dedicados al cuidado de tus compañeros"
                />

                <div className="row g-4 mt-2">
                    <div className="col-lg-4 col-md-6">
                        <article className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                            <div className="bg-light py-4">
                                <span className="display-4">👩‍⚕️</span>
                            </div>
                            <div className="card-body">
                                <h3 className="fw-bold text-dark h5 mb-1">Dra. Valentina San Martín</h3>
                                <p className="text-primary small fw-semibold mb-2">
                                    Directora Médica & Cirujana
                                </p>
                                <p className="text-muted small mb-0">
                                    Especialista en medicina de animales pequeños y cirugía general con 12 años
                                    de trayectoria.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <article className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                            <div className="bg-light py-4">
                                <span className="display-4">👨‍⚕️</span>
                            </div>
                            <div className="card-body">
                                <h3 className="fw-bold text-dark h5 mb-1">Dr. Carlos Mendoza</h3>
                                <p className="text-primary small fw-semibold mb-2">
                                    Médico Veterinario de Urgencias
                                </p>
                                <p className="text-muted small mb-0">
                                    Apasionado por la atención crítica, medicina interna y el bienestar felino.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <article className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                            <div className="bg-light py-4">
                                <span className="display-4">👩‍💻</span>
                            </div>
                            <div className="card-body">
                                <h3 className="fw-bold text-dark h5 mb-1">Camila Riquelme</h3>
                                <p className="text-primary small fw-semibold mb-2">
                                    Asistente y Recepción
                                </p>
                                <p className="text-muted small mb-0">
                                    Encargada de la atención al cliente, coordinación de agendas y bienestar en
                                    sala de espera.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Nosotros;