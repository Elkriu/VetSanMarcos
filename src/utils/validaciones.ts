import {
    RunInvalidoError,
    NombreInvalidoError,
    EmailInvalidoError,
    PasswordInvalidaError
} from "./excepciones";

// RegEx exactos extraídos de tu validaciones.js
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