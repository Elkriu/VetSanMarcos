import BotonEnlace from "../atomos/BotonEnlace";
import ChipServicio from "../moleculas/ChipServicio";

interface ItemLista {
    id: number;
    nombre: string;
}

interface ListaInteresProps {
    items: ItemLista[];
    textoTotal: string;
    alEliminar: (id: number) => void;
}

function ListaInteres({ items, textoTotal, alEliminar }: ListaInteresProps) {
    return (
        <div className="row mb-5">
            <div className="col-12">
                <article className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-primary border-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h3 className="h5 fw-bold text-dark mb-1">📋 Tu Lista de Interés</h3>
                            <p className="text-muted small mb-0">
                                Servicios seleccionados para tu próxima atención clínica.
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {items.length === 0 ? (
                                <span className="text-muted small fst-italic">Aún no has seleccionado servicios.</span>
                            ) : (
                                <div className="d-flex flex-column align-items-md-end gap-3 w-100">
                                    <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                                        {items.map((item) => (
                                            <ChipServicio
                                                key={item.id}
                                                texto={item.nombre}
                                                alCerrar={() => alEliminar(item.id)}
                                            />
                                        ))}
                                    </div>
                                    <div className="d-flex align-items-center gap-3 bg-light px-3 py-2 rounded-3 border">
                                        <span className="text-dark mb-0">
                                            Total estimado: <strong className="fs-5 text-primary">{textoTotal}</strong>
                                        </span>
                                        <BotonEnlace texto="🗓️ Agendar" a="/agenda" variante="success" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default ListaInteres;