import { useParams } from "react-router-dom";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import Insignia from "../componentes/atomos/Insignia";
import { servicios } from "../datos/servicios";

function DetalleServicio() {
    const { id } = useParams();
    const servicio = servicios.find((s) => s.id === Number(id));

    return (
        <div className="container">
            <section className="row justify-content-center">
                <article className="col-lg-8">
                    <div className="mb-4">
                        <BotonEnlace texto="← Volver a Servicios" a="/servicios" variante="outline-secondary" tamano="sm" />
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        {servicio ? (
                            <>
                                <div>
                                    <Insignia texto={servicio.categoria} />
                                </div>
                                <h1 className="fw-bold text-dark mb-2">{servicio.nombre}</h1>
                                <h4 className="text-primary mb-4">{servicio.precio}</h4>

                                <div className="mb-4 text-center">
                                    <img
                                        src={servicio.imagen}
                                        alt={servicio.nombre}
                                        className="img-fluid rounded-4 shadow-sm"
                                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover", backgroundColor: "#f8f9fa" }}
                                    />
                                </div>

                                <h5 className="fw-bold text-dark">Sobre este servicio:</h5>
                                <p className="text-secondary lh-lg">{servicio.descripcionAmpliada}</p>

                                <div className="mt-4">
                                    <BotonEnlace texto="Agendar hora para este servicio" a="/agenda" />
                                </div>
                            </>
                        ) : (
                            <h3 className="text-danger">Servicio no encontrado.</h3>
                        )}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default DetalleServicio;