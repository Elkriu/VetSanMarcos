// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ControlCantidad from "../componentes/moleculas/ControlCantidad";

test("con cantidad 1 el botón − está deshabilitado", () => {
    render(<ControlCantidad cantidad={1} maximo={5} alCambiar={() => {}} />);

    const menos = screen.getByText("−") as HTMLButtonElement;

    expect(menos.disabled).toBe(true);
});