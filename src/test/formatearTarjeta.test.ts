import { test, expect } from "vitest";
import { formatearTarjeta } from "../utils/formato";

test("[FALLA A PROPÓSITO] formatea la tarjeta: espera sin espacios", () => {
    expect(formatearTarjeta("4111111111111111")).toBe("4111111111111111");
});