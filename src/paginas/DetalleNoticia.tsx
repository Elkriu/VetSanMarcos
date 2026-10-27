import { useParams } from "react-router-dom";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import Insignia from "../componentes/atomos/Insignia";
import { novedades } from "../datos/novedades";

function DetalleNoticia() {
    const { id } = useParams();
    const noticia = novedades.find((n) => n.id === Number(id));

    return (
        <div className="container">
            <section className="row justify-content-center">
                <article className="col-lg-8">
                    <div className="mb-4">
                        <BotonEnlace
                            texto="← Volver a Novedades"
                            a="/novedades"
                            variante="outline-secondary"
                            tamano="sm"
                        />
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        {noticia ? (
                            <>
                                <div>
                                    <Insignia texto={noticia.categoria} />
                                </div>
                                <h1 className="fw-bold text-dark mb-2">{noticia.titulo}</h1>
                                <p className="text-muted small mb-4">Publicado el {noticia.fecha}</p>

                                <div className="mb-4 text-center">
                                    <img
                                        src={noticia.imagen}
                                        alt={noticia.titulo}
                                        className="img-fluid rounded-4 shadow-sm"
                                        style={{
                                            maxHeight: "350px",
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>

                                <p className="text-secondary lh-lg">{noticia.texto}</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-danger">Artículo no encontrado.</h3>
                                <div className="mt-3">
                                    <BotonEnlace texto="Volver a Novedades" a="/novedades" />
                                </div>
                            </>
                        )}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default DetalleNoticia;