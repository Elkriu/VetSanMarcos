import { test, expect } from "vitest";
import { validarTarjeta } from "../utils/validaciones";
import { TarjetaInvalidaError } from "../utils/excepciones";

test("acepta una tarjeta de 16 dígitos y rechaza una de 15", () => {
    expect(() => validarTarjeta("4111 1111 1111 1111")).not.toThrow();
    expect(() => validarTarjeta("411111111111111")).toThrow(TarjetaInvalidaError);
});