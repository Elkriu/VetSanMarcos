import { useState } from "react";
import Insignia from "../componentes/atomos/Insignia";
import FormularioLogin from "../componentes/organismos/FormularioLogin";
import FormularioRegistro from "../componentes/organismos/FormularioRegistro";

function Login() {
    const [modo, setModo] = useState<"login" | "registro">("login");
    const esLogin = modo === "login";

    return (
       
        <div className="d-flex align-items-center" style={{ minHeight: "calc(100vh - 14rem)" }}>
            <div className="container">
                <section className="row justify-content-center">
                    <article className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
                            <div className="text-center mb-4">
                                <Insignia texto={esLogin ? "🔐 Bienvenido" : "🐾 Únete a nosotros"} />
                                <h2 className="fw-bold text-dark">{esLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
                                <p className="text-muted small">
                                    {esLogin
                                        ? "Ingresa a tu cuenta para gestionar tus citas."
                                        : "Regístrate para agilizar la atención de tus mascotas."}
                                </p>
                            </div>

                            {esLogin ? (
                                <FormularioLogin />
                            ) : (
                                <FormularioRegistro alTerminar={() => setModo("login")} />
                            )}

                            <div className="text-center mt-4">
                                <p className="text-muted small mb-0">
                                    {esLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 align-baseline text-primary fw-semibold text-decoration-none"
                                        onClick={() => setModo(esLogin ? "registro" : "login")}
                                    >
                                        {esLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
}

export default Login;