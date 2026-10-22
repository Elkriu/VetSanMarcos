import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import ItemContacto from "../componentes/moleculas/ItemContacto";
import FormularioContacto from "../componentes/organismos/FormularioContacto";

const URL_MAPA =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.3582451259926!2d-70.74313!3d-34.17012!2m3!1f0!2f0!3f0!3m2!1f1024!2f768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDEwJzEyLjQiUyA3MMKwNDQnMzUuMyJX!5e0!3m2!1ses!2scl!4v1650000000000!5m2!1ses!2scl";

function Contacto() {
    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Comunícate"
                titulo="Canales de"
                destacado="Contacto"
                descripcion="Estamos aquí para resolver tus dudas y atender a tus mascotas en Rancagua."
            />

            <div className="row g-5 justify-content-center align-items-start">
                <div className="col-lg-6">
                    <article className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h2 className="fw-bold h4 text-dark mb-4">Información y Ubicación</h2>

                        <ItemContacto emoji="📍" titulo="Dirección">
                            Av. Libertador Bernardo O'Higgins #450, Rancagua
                        </ItemContacto>
                        <ItemContacto emoji="📞" titulo="Teléfono / WhatsApp">
                            +56 9 1234 5678
                        </ItemContacto>
                        <ItemContacto emoji="⏰" titulo="Horarios">
                            Lun - Vie: 09:00 - 19:00 hrs.<br />Sáb: 10:00 - 14:00 hrs.
                        </ItemContacto>

                        <div className="rounded-3 overflow-hidden shadow-sm mt-auto" style={{ height: "200px" }}>
                            <iframe
                                src={URL_MAPA}
                                title="Ubicación de Veterinaria San Marcos"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </article>
                </div>

                <div className="col-lg-6">
                    <FormularioContacto />
                </div>
            </div>
        </section>
    );
}

export default Contacto;