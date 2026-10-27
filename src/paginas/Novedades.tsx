import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import BotonEnlace from "../componentes/atomos/BotonEnlace";
import Insignia from "../componentes/atomos/Insignia";
import { novedades } from "../datos/novedades";

function Novedades() {
    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Blog y Consejos"
                titulo="Novedades y"
                destacado="Actualidad Veterinaria"
                descripcion="Consejos de nuestros especialistas para el cuidado óptimo de perros, gatos, aves y conejos."
            />

            <div className="row g-4 justify-content-center mt-2">
                {novedades.map((item) => (
                    <div className="col-md-6 col-lg-3" key={item.id}>
                        <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                            <img
                                src={item.imagen}
                                className="card-img-top"
                                alt={item.titulo}
                                style={{ height: "180px", objectFit: "cover" }}
                            />
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="mb-2">
                                    <Insignia texto={item.categoria} />
                                </div>
                                <h3 className="fw-bold h6 text-dark">{item.titulo}</h3>
                                <p className="text-muted small my-2">{item.resumen}</p>
                                <div className="mt-auto pt-3">
                                    <BotonEnlace
                                        texto="Leer más"
                                        a={`/novedades/${item.id}`}
                                        variante="outline-primary"
                                        tamano="sm"
                                    />
                                </div>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Novedades;