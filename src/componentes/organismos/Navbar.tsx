import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BotonEnlace from "../atomos/BotonEnlace";

const enlaces = [
    { a: "/", texto: "Inicio" },
    { a: "/servicios", texto: "Servicios" },
    { a: "/nosotros", texto: "Nosotros" },
    { a: "/novedades", texto: "Novedades" },
    { a: "/contacto", texto: "Contacto" },
    { a: "/agenda", texto: "Agenda" },
];

function Navbar() {
    const [abierto, setAbierto] = useState(false);

    return (
        <header>
            <nav className="navbar navbar-expand-lg sticky-top">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary" to="/">
                        🐾 Veterinaria San Marcos
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-label="Mostrar menú"
                        aria-expanded={abierto}
                        onClick={() => setAbierto(!abierto)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse justify-content-end${abierto ? " show" : ""}`}>
                        <ul className="navbar-nav align-items-lg-center gap-2">
                            {enlaces.map((enlace) => (
                                <li className="nav-item" key={enlace.a}>
                                    <NavLink
                                        to={enlace.a}
                                        end={enlace.a === "/"}
                                        className={({ isActive }) =>
                                            `nav-link${isActive ? " active fw-semibold" : ""}`
                                        }
                                        onClick={() => setAbierto(false)}
                                    >
                                        {enlace.texto}
                                    </NavLink>
                                </li>
                            ))}
                            <li className="nav-item ms-lg-2">
                                <BotonEnlace texto="Iniciar Sesión" a="/login" tamano="sm" />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;