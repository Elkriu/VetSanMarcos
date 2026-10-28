// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { obtenerStock, descontarStock } from "../datos/stock";

beforeEach(() => localStorage.clear());

test("descontarStock resta unidades y nunca baja de 0", () => {
    descontarStock([{ id: 13, cantidad: 2 }]);   
    expect(obtenerStock()[13]).toBe(1);

    descontarStock([{ id: 13, cantidad: 10 }]);
    expect(obtenerStock()[13]).toBe(0);
});