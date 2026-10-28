import { test, expect } from "vitest";
import { validarCorreo } from "../utils/validaciones";

test("acepta un correo válido", () => {
    expect(() => validarCorreo("cliente@gmail.com")).not.toThrow();
});