import { test, expect } from "vitest";
import { desglosarIva } from "../utils/formato";

test("[FALLA A PROPÓSITO] desglosa el IVA: espera neto 11000", () => {
    const { neto, iva } = desglosarIva(11900);

    expect(neto).toBe(11000); // lo correcto sería 10000
    expect(iva).toBe(1900);
});