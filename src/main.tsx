import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos.css";
import App from "./App.tsx";
import AuthProvider from "./contexto/AuthProvider.tsx";
import CarritoProvider from "./contexto/CarritoProvider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CarritoProvider>
                    <App />
                </CarritoProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);