CREATE TABLE usuario (
    id             BIGINT       NOT NULL AUTO_INCREMENT,   
    run            VARCHAR(9)   NULL,                     
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL,
    password_hash  VARCHAR(100) NOT NULL,                 
    rol            VARCHAR(20)  NOT NULL,                  
    suspendido     BOOLEAN      NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuario_email (email),
    UNIQUE KEY uk_usuario_run (run)                       
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;