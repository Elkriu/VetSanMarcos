export interface TransaccionPago {
    id: number;
    fecha: string;
    clienteEmail: string;
    monto: number;
    tarjeta: string;
    estado: "APROBADO" | "RECHAZADO";
    motivo: string;
}

// Mantiene la pausa visual de 1,5 s mientras el backend procesa el cobro
export const simularPago = (_numeroTarjeta: string): Promise<void> =>
    new Promise((resolver) => {
        setTimeout(() => {
            resolver();
        }, 1500);
    });