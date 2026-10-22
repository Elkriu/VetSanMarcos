import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/organismos/Navbar";
import Footer from "./componentes/organismos/Footer";
import Inicio from "./paginas/Inicio";
import Servicios from "./paginas/Servicios";
// import DetalleServicio from "./paginas/DetalleServicio";
// import Nosotros from "./paginas/Nosotros";
// import Novedades from "./paginas/Novedades";
// import DetalleNoticia from "./paginas/DetalleNoticia";
// import Contacto from "./paginas/Contacto";
// import Agenda from "./paginas/Agenda";
// import Login from "./paginas/Login";
// import MisCitas from "./paginas/MisCitas";
// import Admin from "./paginas/Admin";
// import Recepcion from "./paginas/Recepcion";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1 py-5">
                <Routes>
                    <Route path="/" element={<Inicio />} />

                    {<Route path="/servicios" element={<Servicios />} />}
                    {/* <Route path="/servicios/:id" element={<DetalleServicio />} /> */}
                    {/* <Route path="/nosotros" element={<Nosotros />} /> */}
                    {/* <Route path="/novedades" element={<Novedades />} /> */}
                    {/* <Route path="/novedades/:id" element={<DetalleNoticia />} /> */}
                    {/* <Route path="/contacto" element={<Contacto />} /> */}
                    {/* <Route path="/agenda" element={<Agenda />} /> */}
                    {/* <Route path="/login" element={<Login />} /> */}
                    {/* <Route path="/mis-citas" element={<MisCitas />} /> */}
                    {/* <Route path="/admin" element={<Admin />} /> */}
                    {/* <Route path="/recepcion" element={<Recepcion />} /> */}
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;