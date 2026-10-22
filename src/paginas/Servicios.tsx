import { useState } from "react";
import EncabezadoSeccion from "../componentes/moleculas/EncabezadoSeccion";
import CardServicio from "../componentes/moleculas/CardServicio";
import ListaInteres from "../componentes/organismos/ListaIntereses";
import { servicios } from "../datos/servicios";

interface ItemLista {
    id: number;
    nombre: string;
}

const CLAVE = "listaInteresVeterinaria";

function Servicios() {
    const [lista, setLista] = useState<ItemLista[]>(() =>
        JSON.parse(localStorage.getItem(CLAVE) ?? "[]")
    );

    const guardar = (nueva: ItemLista[]) => {
        setLista(nueva);
        localStorage.setItem(CLAVE, JSON.stringify(nueva));
    };

    const agregar = (id: number, nombre: string) => {
        if (lista.some((item) => item.id === id)) {
            alert("Este servicio ya está en tu lista.");
            return;
        }
        guardar([...lista, { id, nombre }]);
    };

    const eliminar = (id: number) => {
        guardar(lista.filter((item) => item.id !== id));
    };

    // Total estimado (misma lógica que actualizarPanelInteres)
    const seleccionados = lista
        .map((item) => servicios.find((s) => s.id === item.id))
        .filter((s) => s !== undefined);

    const total = seleccionados.reduce((suma, s) => suma + s.valorNumerico, 0);
    const incluyeEvaluacion = seleccionados.some((s) => s.valorNumerico === 0);

    let textoTotal = `$${total.toLocaleString("es-CL")}`;
    if (incluyeEvaluacion && total === 0) {
        textoTotal = "A evaluar en consulta";
    } else if (incluyeEvaluacion) {
        textoTotal += " (+ evaluaciones)";
    }

    return (
        <section className="container">
            <EncabezadoSeccion
                nivel="h1"
                insignia="Nuestras Prestaciones"
                titulo="Servicios y"
                destacado="Especialidades"
                descripcion="Conoce las prestaciones disponibles para el cuidado preventivo y clínico de tu mascota."
            />

            <ListaInteres items={lista} textoTotal={textoTotal} alEliminar={eliminar} />

            <div className="row g-4 justify-content-center">
                {servicios.map((s) => (
                    <div className="col-md-6 col-lg-3" key={s.id}>
                        <CardServicio {...s} alAnadir={() => agregar(s.id, s.nombre)} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Servicios;