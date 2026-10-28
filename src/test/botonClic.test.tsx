// @vitest-environment jsdom

import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Boton from "../componentes/atomos/Boton";

test("el botón llama a alHacerClic al hacer clic", () => {
    const alHacerClic = vi.fn();

    render(<Boton texto="Guardar" alHacerClic={alHacerClic} />);
    fireEvent.click(screen.getByText("Guardar"));

    expect(alHacerClic).toHaveBeenCalledTimes(1);
});