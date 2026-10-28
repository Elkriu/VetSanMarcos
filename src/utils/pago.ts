import { PagoRechazadoError } from "./excepciones";

// Simula la respuesta del banco: demora 1,5 s y rechaza las tarjetas que terminan en 0000
export const simularPago = (numeroTarjeta: string): Promise<void> =>
    new Promise((resolver, rechazar) => {
        setTimeout(() => {
            if (numeroTarjeta.endsWith("0000")) {
                rechazar(new PagoRechazadoError());
            } else {
                resolver();
            }
        }, 1500);
    });