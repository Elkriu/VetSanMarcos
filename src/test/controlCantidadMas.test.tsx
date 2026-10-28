// @vitest-environment jsdom

import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ControlCantidad from "../componentes/moleculas/ControlCantidad";

test("al hacer clic en + avisa con la cantidad más uno", () => {
    const alCambiar = vi.fn();

    render(<ControlCantidad cantidad={2} maximo={5} alCambiar={alCambiar} />);
    fireEvent.click(screen.getByText("+"));

    expect(alCambiar).toHaveBeenCalledWith(3);
});