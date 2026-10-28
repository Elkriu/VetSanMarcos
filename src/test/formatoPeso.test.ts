import { test, expect } from "vitest";
import { formatoPeso } from "../utils/formato";

test("da formato de pesos chilenos", () => {
    expect(formatoPeso(42990)).toBe("$42.990");
});