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