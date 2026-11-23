INSERT INTO usuario (nombre, email, password_hash, rol, suspendido, fecha_creacion) VALUES
('Admin',            'admin@sanmarcos.cl',      '$2a$10$yV8qOJy1kJ4y89qvzz8W7O7qL/NrQCzqjfdxiZW7EXI8yOfpM83P6', 'ADMINISTRADOR', FALSE, NOW(6)),
('Camila Riquelme',  'recepcion@sanmarcos.cl',  '$2a$10$J9BfUf9Ta5sHsa/phMcsleRcICkqG7sOj67uhg24Tg.TuX7T78Wb2', 'RECEPCIONISTA', FALSE, NOW(6)),
('Cristian Vega',    'cristianv@gmail.com',     '$2a$10$URvYHFx.idRbSU34O5Rh5e4FLQ9EhvSkqI5dgxtSKwrEWUit9GdMW', 'CLIENTE',        FALSE, NOW(6));