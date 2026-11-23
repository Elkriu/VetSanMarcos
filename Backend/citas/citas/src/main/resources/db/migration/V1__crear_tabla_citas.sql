CREATE TABLE cita_medica (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    email_cliente VARCHAR(120) NOT NULL,
    servicio VARCHAR(80) NOT NULL,
    tipo_mascota VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10) NOT NULL,
    creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_cita_fecha_hora UNIQUE (fecha, hora)
);