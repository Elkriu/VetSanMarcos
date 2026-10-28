import { test, expect } from "vitest";
import { validarCorreo } from "../utils/validaciones";
import { EmailInvalidoError } from "../utils/excepciones";

test("rechaza un correo con dominio no permitido", () => {
    expect(() => validarCorreo("juan@dominio.com")).toThrow(EmailInvalidoError);
});