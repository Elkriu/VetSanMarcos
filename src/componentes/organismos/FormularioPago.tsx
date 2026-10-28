import { useState, type SubmitEvent } from "react";
import CampoFormulario from "../moleculas/CampoFormulario";
import Boton from "../atomos/Boton";
import {
    validarSoloLetras,
    validarTarjeta,
    validarVencimiento,
    validarCvv,
    obtenerError,
} from "../../utils/validaciones";
import { simularPago } from "../../utils/pago";
import { PagoRechazadoError } from "../../utils/excepciones";
import { formatoPeso, formatearTarjeta, formatearVencimiento, soloDigitos } from "../../utils/formato";

type Campo = "titular" | "numero" | "vencimiento" | "cvv";
type Errores = Partial<Record<Campo, string>>;

interface FormularioPagoProps {
    total: number;
    alExito: (ultimosDigitos: string) => void;
}

function FormularioPago({ total, alExito }: FormularioPagoProps) {
    const [titular, setTitular] = useState("");
    const [numero, setNumero] = useState("");
    const [vencimiento, setVencimiento] = useState("");
    const [cvv, setCvv] = useState("");

    const [errores, setErrores] = useState<Errores>({});
    const [validado, setValidado] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [errorPago, setErrorPago] = useState("");

    const estado = (campo: Campo): "valido" | "invalido" | undefined => {
        if (!validado) return undefined;
        return errores[campo] ? "invalido" : "valido";
    };

    const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (procesando) return;

        const nuevos: Errores = {
            titular: obtenerError(() => validarSoloLetras(titular, "nombre del titular")),
            numero: obtenerError(() => validarTarjeta(numero)),
            vencimiento: obtenerError(() => validarVencimiento(vencimiento)),
            cvv: obtenerError(() => validarCvv(cvv)),
        };

        setErrores(nuevos);
        setValidado(true);
        setErrorPago("");

        if (Object.values(nuevos).some(Boolean)) return;

        const digitos = soloDigitos(numero);

        setProcesando(true);
        try {
            await simularPago(digitos);
            alExito(digitos.slice(-4));
        } catch (error) {
            if (error instanceof PagoRechazadoError) {
                setErrorPago(error.message);
            } else {
                throw error;
            }
        } finally {
            setProcesando(false);
        }
    };

    return (
        <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h2 className="fw-bold h4 text-dark mb-4">💳 Datos de pago</h2>

            <form onSubmit={manejarEnvio} noValidate>
                <CampoFormulario
                    etiqueta="Nombre del titular"
                    id="pago-titular"
                    valor={titular}
                    alCambiar={setTitular}
                    placeholder="Como aparece en la tarjeta"
                    estado={estado("titular")}
                    error={errores.titular}
                />
                <CampoFormulario
                    etiqueta="Número de tarjeta"
                    id="pago-numero"
                    valor={numero}
                    alCambiar={(valor) => setNumero(formatearTarjeta(valor))}
                    placeholder="4111 1111 1111 1111"
                    ayuda="Simulación: las tarjetas que terminan en 0000 son rechazadas."
                    estado={estado("numero")}
                    error={errores.numero}
                />

                <div className="row">
                    <div className="col-6">
                        <CampoFormulario
                            etiqueta="Vencimiento (MM/AA)"
                            id="pago-vencimiento"
                            valor={vencimiento}
                            alCambiar={(valor) => setVencimiento(formatearVencimiento(valor))}
                            placeholder="12/30"
                            estado={estado("vencimiento")}
                            error={errores.vencimiento}
                            espacio={4}
                        />
                    </div>
                    <div className="col-6">
                        <CampoFormulario
                            etiqueta="CVV"
                            id="pago-cvv"
                            tipo="password"
                            valor={cvv}
                            alCambiar={(valor) => setCvv(soloDigitos(valor).slice(0, 3))}
                            placeholder="123"
                            estado={estado("cvv")}
                            error={errores.cvv}
                            espacio={4}
                        />
                    </div>
                </div>

                <Boton
                    texto={procesando ? "Procesando pago..." : `Pagar ${formatoPeso(total)}`}
                    tipo="submit"
                    bloque
                />
            </form>

            {errorPago && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {errorPago}
                </div>
            )}
        </article>
    );
}

export default FormularioPago;