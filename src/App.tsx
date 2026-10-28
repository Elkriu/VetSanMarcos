import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";
import RutaProtegida from "./componentes/organismos/RutaProtegida";
import Inicio from "./paginas/Inicio";
import Servicios from "./paginas/Servicios";
import DetalleServicio from "./paginas/DetalleServicio";
import Nosotros from "./paginas/Nosotros";
import Novedades from "./paginas/Novedades";
import DetalleNoticia from "./paginas/DetalleNoticia";
import Contacto from "./paginas/Contacto";
import Agenda from "./paginas/Agenda";
import Login from "./paginas/Login";
import Tienda from "./paginas/Tienda";
import MisCitas from "./paginas/MisCitas";
import Admin from "./paginas/Admin";
import Recepcion from "./paginas/Recepcion";
import Carrito from "./paginas/Carrito";


const RUTAS_PANEL = ["/admin", "/recepcion", "/mis-citas"];

function App() {
    const { pathname } = useLocation();
    const esPanel = RUTAS_PANEL.includes(pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            {!esPanel && <Navbar />}

            <main className={esPanel ? "flex-grow-1" : "flex-grow-1 py-5"}>
                <Routes>
                    <Route path="/" element={<Inicio />} />

                    {<Route path="/servicios" element={<Servicios />} />}
                    {<Route path="/servicios/:id" element={<DetalleServicio />} />}
                    {<Route path="/nosotros" element={<Nosotros />} />}
                    { <Route path="/novedades" element={<Novedades />} />}
                    {<Route path="/novedades/:id" element={<DetalleNoticia />} /> }
                    {<Route path="/contacto" element={<Contacto />} />}
                    {<Route path="/carrito" element={<Carrito />} />}
                    {<Route path="/agenda" element={<Agenda />} />}
                    {<Route path="/login" element={<Login />} />}
                    {<Route path="/tienda" element={<Tienda />} />}
                    {<Route path="/mis-citas" element={<RutaProtegida><MisCitas /></RutaProtegida>} />}
                    {<Route path="/admin" element={<RutaProtegida roles={["Administrador"]}><Admin /></RutaProtegida>} />}
                    {<Route path="/recepcion" element={<RutaProtegida roles={["Recepcionista", "Administrador"]}><Recepcion /></RutaProtegida>} />}
                </Routes>
            </main>

            {!esPanel && <Footer />}
        </div>
    );
}

export default App;