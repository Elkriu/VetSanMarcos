// @vitest-environment jsdom

import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Boton from "../componentes/atomos/Boton";

test("un botón deshabilitado no dispara el clic", () => {
    const alHacerClic = vi.fn();

    render(<Boton texto="Guardar" deshabilitado alHacerClic={alHacerClic} />);
    fireEvent.click(screen.getByText("Guardar"));

    expect(alHacerClic).not.toHaveBeenCalled();
});