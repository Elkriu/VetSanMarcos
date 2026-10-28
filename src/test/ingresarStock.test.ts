// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { obtenerStock, ingresarStock } from "../datos/stock";

beforeEach(() => localStorage.clear());

test("ingresarStock suma unidades al stock actual", () => {
    const nuevo = ingresarStock(1, 5);   

    expect(nuevo[1]).toBe(13);
    expect(obtenerStock()[1]).toBe(13);
});