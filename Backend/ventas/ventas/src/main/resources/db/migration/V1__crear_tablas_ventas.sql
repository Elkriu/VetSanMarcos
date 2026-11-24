CREATE TABLE boleta (
    numero BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(120) NOT NULL,
    neto INT NOT NULL,
    iva INT NOT NULL,
    total INT NOT NULL,
    tarjeta VARCHAR(10) NOT NULL
) AUTO_INCREMENT = 1000;

CREATE TABLE linea_boleta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    boleta_numero BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    precio INT NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT fk_linea_boleta FOREIGN KEY (boleta_numero) REFERENCES boleta(numero) ON DELETE CASCADE
);