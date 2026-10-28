// Excepción base
export class ValidacionError extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "ValidacionError";
    }
}

export class RunInvalidoError extends ValidacionError {
    constructor() {
        super("El RUN debe tener entre 8 y 9 caracteres en total, sin puntos ni guion (ej: 123456789 o 12345678K).");
        this.name = "RunInvalidoError";
    }
}

export class NombreInvalidoError extends ValidacionError {
    constructor(campo: string) {
        super(`El ${campo} solo debe contener letras.`);
        this.name = "NombreInvalidoError";
    }
}

export class EmailInvalidoError extends ValidacionError {
    constructor() {
        super("Ingrese un correo válido con dominio permitido (@gmail, @outlook, @hotmail, @yahoo, @sanmarcos).");
        this.name = "EmailInvalidoError";
    }
}

export class PasswordInvalidaError extends ValidacionError {
    constructor() {
        super("La contraseña debe tener de 4 a 10 caracteres, e incluir letras, números y al menos un símbolo (@$!%*?&).");
        this.name = "PasswordInvalidaError";
    }
}

export class TarjetaInvalidaError extends ValidacionError {
    constructor() {
        super("El número de tarjeta debe tener 16 dígitos.");
        this.name = "TarjetaInvalidaError";
    }
}

export class VencimientoInvalidoError extends ValidacionError {
    constructor() {
        super("Ingrese el vencimiento en formato MM/AA (ej: 08/28).");
        this.name = "VencimientoInvalidoError";
    }
}

export class TarjetaVencidaError extends ValidacionError {
    constructor() {
        super("La tarjeta se encuentra vencida.");
        this.name = "TarjetaVencidaError";
    }
}

export class CvvInvalidoError extends ValidacionError {
    constructor() {
        super("El CVV debe tener 3 dígitos.");
        this.name = "CvvInvalidoError";
    }
}

// No es un error de validación del formulario: lo "responde el banco"
export class PagoRechazadoError extends Error {
    constructor() {
        super("Pago rechazado por el banco emisor. Intenta con otra tarjeta.");
        this.name = "PagoRechazadoError";
    }
}