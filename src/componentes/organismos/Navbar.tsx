import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BotonEnlace from "../atomos/BotonEnlace";
import Boton from "../atomos/Boton";
import { useAuth } from "../../contexto/useAuth";

const enlaces = [
    { a: "/", texto: "Inicio" },
    { a: "/servicios", texto: "Servicios" },
    { a: "/tienda", texto: "Tienda" },
    { a: "/nosotros", texto: "Nosotros" },
    { a: "/novedades", texto: "Novedades" },
    { a: "/contacto", texto: "Contacto" },
    { a: "/agenda", texto: "Agenda" },
];

function Navbar() {
    const [abierto, setAbierto] = useState(false);
    const { sesion, cerrarSesion } = useAuth();
    const panel =
        sesion?.rol === "Administrador"
            ? { a: "/admin", texto: "Panel Admin" }
            : sesion?.rol === "Recepcionista"
            ? { a: "/recepcion", texto: "Panel Recepción" }
            : { a: "/mis-citas", texto: "Mis Citas" };

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
                                {sesion ? (
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <span className="small fw-semibold text-dark">
                                            👤 {sesion.nombre.split(" ")[0]}
                                        </span>
                                        <BotonEnlace
                                            texto={panel.texto}
                                            a={panel.a}
                                            variante="outline-primary"
                                            tamano="sm"
                                        />
                                        <Boton
                                            texto="Salir"
                                            variante="outline-danger"
                                            tamano="sm"
                                            alHacerClic={cerrarSesion}
                                        />
                                    </div>
                                ) : (
                                    <BotonEnlace texto="Iniciar Sesión" a="/login" tamano="sm" />
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;