// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Boton from "../componentes/atomos/Boton";

test("[FALLA A PROPÓSITO] el botón tiene la clase btn-primary: espera btn-danger", () => {
    render(<Boton texto="Guardar" />);

    const boton = screen.getByText("Guardar");

    expect(boton.className).toContain("btn-danger"); 
});