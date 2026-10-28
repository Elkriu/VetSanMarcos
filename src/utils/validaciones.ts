import {
    ValidacionError,
    RunInvalidoError,
    NombreInvalidoError,
    EmailInvalidoError,
    PasswordInvalidaError,
    TarjetaInvalidaError,
    VencimientoInvalidoError,
    TarjetaVencidaError,
    CvvInvalidoError,
    CantidadInvalidaError,
} from "./excepciones";
export const rxCorreo = /^[a-zA-Z0-9_.+-]+@(gmail|outlook|hotmail|yahoo|sanmarcos)\.(com|cl)$/;
export const rxPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,10}$/;
export const rxRun = /^[0-9]{7,8}[0-9kK]$/;
export const rxSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

export const validarRun = (run: string): void => {
    if (!rxRun.test(run.trim())) {
        throw new RunInvalidoError();
    }
};

export const validarSoloLetras = (texto: string, nombreCampo: string): void => {
    if (!rxSoloLetras.test(texto.trim())) {
        throw new NombreInvalidoError(nombreCampo);
    }
};

export const validarCorreo = (email: string): void => {
    if (!rxCorreo.test(email.trim())) {
        throw new EmailInvalidoError();
    }
};

export const validarPassword = (password: string): void => {
    if (!rxPass.test(password)) {
        throw new PasswordInvalidaError();
    }
};

export const obtenerError = (validar: () => void): string | undefined => {
    try {
        validar();
        return undefined;
    } catch (error) {
        if (error instanceof ValidacionError) return error.message;
        throw error;
    }
};

export const rxTarjeta = /^\d{16}$/;
export const rxVencimiento = /^(0[1-9]|1[0-2])\/(\d{2})$/;
export const rxCvv = /^\d{3}$/;

export const validarTarjeta = (numero: string): void => {
    if (!rxTarjeta.test(numero.replace(/\s/g, ""))) {
        throw new TarjetaInvalidaError();
    }
};

export const validarVencimiento = (vencimiento: string): void => {
    const partes = rxVencimiento.exec(vencimiento.trim());
    if (!partes) {
        throw new VencimientoInvalidoError();
    }

    const mes = Number(partes[1]);
    const anio = 2000 + Number(partes[2]);
    const hoy = new Date();

    // La tarjeta sirve hasta el último día del mes indicado
    if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
        throw new TarjetaVencidaError();
    }
};

export const validarCvv = (cvv: string): void => {
    if (!rxCvv.test(cvv.trim())) {
        throw new CvvInvalidoError();
    }
};

export const rxCantidad = /^[1-9]\d{0,2}$/;   // de 1 a 999

export const validarCantidadStock = (cantidad: string): void => {
    if (!rxCantidad.test(cantidad.trim())) {
        throw new CantidadInvalidaError();
    }
};