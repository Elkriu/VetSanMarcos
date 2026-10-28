import Insignia from "../componentes/atomos/Insignia";
import FormularioLogin from "../componentes/organismos/FormularioLogin";

function Login() {
    return (
        <div className="container">
            <section className="row justify-content-center">
                <article className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
                        <div className="text-center mb-4">
                            <Insignia texto="🔐 Bienvenido" />
                            <h2 className="fw-bold text-dark">Iniciar Sesión</h2>
                            <p className="text-muted small">Ingresa a tu cuenta para gestionar tus citas.</p>
                        </div>

                        <FormularioLogin />
                    </div>
                </article>
            </section>
        </div>
    );
}

export default Login;