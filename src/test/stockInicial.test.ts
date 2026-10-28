// @vitest-environment jsdom

import { test, expect, vi } from "vitest";
import { obtenerStock } from "../datos/stock";

test("parte del stock inicial si no hay datos guardados", () => {

    const lectura = vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    expect(obtenerStock()[1]).toBe(8);

    lectura.mockRestore();
});