import { test, expect } from "vitest";
import { validarPassword } from "../utils/validaciones";
import { PasswordInvalidaError } from "../utils/excepciones";

test("rechaza una contraseña débil", () => {
    expect(() => validarPassword("abc")).toThrow(PasswordInvalidaError);
});