export type Categoria = "Alimento" | "Juguetes" | "Higiene" | "Accesorios" | "Salud";
export type Mascota = "Perro" | "Gato" | "Ave" | "Conejo";

export interface Producto {
    id: number;
    nombre: string;
    categoria: Categoria;
    mascota: Mascota;
    precio: number;          
    emoji: string;
    imagen: string;
    descripcion: string;
}

export const categorias: Categoria[] = ["Alimento", "Juguetes", "Higiene", "Accesorios", "Salud"];
export const mascotas: Mascota[] = ["Perro", "Gato", "Ave", "Conejo"];

export const productos: Producto[] = [
    { id: 1, nombre: "Alimento Premium Perro Adulto 15 kg", categoria: "Alimento", mascota: "Perro", precio: 42990, emoji: "🍖", imagen: "/img/productos/alimento-perro.webp", descripcion: "Nutrición completa y balanceada para perros adultos." },
    { id: 2, nombre: "Alimento Gato Esterilizado 3 kg", categoria: "Alimento", mascota: "Gato", precio: 18990, emoji: "🐟", imagen: "/img/productos/alimento-gato.webp", descripcion: "Control de peso y cuidado urinario para gatos esterilizados." },
    { id: 3, nombre: "Snack Dental para Perros", categoria: "Alimento", mascota: "Perro", precio: 5990, emoji: "🦴", imagen: "/img/productos/snack-dental.jpg", descripcion: "Ayuda a reducir el sarro y refrescar el aliento." },
    { id: 4, nombre: "Mix de Semillas para Aves 1 kg", categoria: "Alimento", mascota: "Ave", precio: 4490, emoji: "🌾", imagen: "/img/productos/semillas-aves.jfif", descripcion: "Mezcla de semillas seleccionadas para aves de compañía." },
    { id: 5, nombre: "Heno Premium para Conejos 1 kg", categoria: "Alimento", mascota: "Conejo", precio: 5490, emoji: "🌿", imagen: "/img/productos/heno-conejos.webp", descripcion: "Heno fresco, base de la dieta y del desgaste dental." },
    { id: 6, nombre: "Pelota de Goma Resistente", categoria: "Juguetes", mascota: "Perro", precio: 3990, emoji: "🎾", imagen: "/img/productos/pelota.jpg", descripcion: "Ideal para juego y entrenamiento diario." },
    { id: 7, nombre: "Ratón de Peluche con Catnip", categoria: "Juguetes", mascota: "Gato", precio: 2990, emoji: "🐭", imagen: "/img/productos/raton-peluche.webp", descripcion: "Estimula el instinto de caza de tu gato." },
    { id: 8, nombre: "Shampoo Hipoalergénico 500 ml", categoria: "Higiene", mascota: "Perro", precio: 8990, emoji: "🧴", imagen: "/img/productos/shampoo.jfif", descripcion: "Fórmula suave para pieles sensibles." },
    { id: 9, nombre: "Arena Sanitaria Aglomerante 10 kg", categoria: "Higiene", mascota: "Gato", precio: 9990, emoji: "🪣", imagen: "/img/productos/arena-gatos.webp", descripcion: "Control de olores y fácil limpieza." },
    { id: 10, nombre: "Collar Antipulgas", categoria: "Salud", mascota: "Perro", precio: 11990, emoji: "🛡️", imagen: "/img/productos/collar-antipulgas.jfif", descripcion: "Protección contra pulgas y garrapatas por 8 meses." },
    { id: 11, nombre: "Pipeta Antiparasitaria Gato", categoria: "Salud", mascota: "Gato", precio: 9490, emoji: "💧", imagen: "/img/productos/pipeta-gato.jpg", descripcion: "Antiparasitario externo de aplicación mensual." },
    { id: 12, nombre: "Correa Retráctil 5 m", categoria: "Accesorios", mascota: "Perro", precio: 12990, emoji: "🦮", imagen: "/img/productos/correa.jfif", descripcion: "Correa con freno de seguridad y mango ergonómico." },
    { id: 13, nombre: "Rascador Torre 60 cm", categoria: "Accesorios", mascota: "Gato", precio: 24990, emoji: "🐈", imagen: "/img/productos/rascador.webp", descripcion: "Torre con base estable para afilar uñas y descansar." },
    { id: 14, nombre: "Columpio de Madera para Aves", categoria: "Accesorios", mascota: "Ave", precio: 4990, emoji: "🐦", imagen: "/img/productos/columpio-aves.webp", descripcion: "Entretención y ejercicio dentro de la jaula." },
];