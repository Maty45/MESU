-- tipo_operacion

INSERT INTO tipo_operacion (nombre_tipo_operacion)
SELECT 'VENTA'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_operacion
    WHERE nombre_tipo_operacion = 'VENTA'
);

INSERT INTO tipo_operacion (nombre_tipo_operacion)
SELECT 'ALQUILER'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_operacion
    WHERE nombre_tipo_operacion = 'ALQUILER'
);

INSERT INTO tipo_operacion (nombre_tipo_operacion)
SELECT 'DONACION'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_operacion
    WHERE nombre_tipo_operacion = 'DONACION'
);

-- tipo_interaccion

INSERT INTO tipo_interaccion (nombre_tipo_interaccion)
SELECT 'VENTA'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_interaccion
    WHERE nombre_tipo_interaccion = 'VENTA'
);

INSERT INTO tipo_interaccion (nombre_tipo_interaccion)
SELECT 'ALQUILER'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_interaccion
    WHERE nombre_tipo_interaccion = 'ALQUILER'
);

INSERT INTO tipo_interaccion (nombre_tipo_interaccion)
SELECT 'DEVOLUCION'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_interaccion
    WHERE nombre_tipo_interaccion = 'DEVOLUCION'
);

INSERT INTO tipo_interaccion (nombre_tipo_interaccion)
SELECT 'DONACION'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_interaccion
    WHERE nombre_tipo_interaccion = 'DONACION'
);

INSERT INTO tipo_interaccion (nombre_tipo_interaccion)
SELECT 'CONTACTO'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_interaccion
    WHERE nombre_tipo_interaccion = 'CONTACTO'
);

-- estado_publicacion_insumo

INSERT INTO estado_publicacion_insumo (nombre_estado_pi)
SELECT 'ACTIVA'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_publicacion_insumo
    WHERE nombre_estado_pi = 'ACTIVA'
);

INSERT INTO estado_publicacion_insumo (nombre_estado_pi)
SELECT 'ALQUILADA'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_publicacion_insumo
    WHERE nombre_estado_pi = 'ALQUILADA'
);

INSERT INTO estado_publicacion_insumo (nombre_estado_pi)
SELECT 'ELIMINADA'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_publicacion_insumo
    WHERE nombre_estado_pi = 'ELIMINADA'
);

INSERT INTO estado_publicacion_insumo (nombre_estado_pi)
SELECT 'FINALIZADA'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_publicacion_insumo
    WHERE nombre_estado_pi = 'FINALIZADA'
);

-- estado_insumo

INSERT INTO estado_insumo (nombre_estado_insumo)
SELECT 'NUEVO'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_insumo
    WHERE nombre_estado_insumo = 'NUEVO'
);

INSERT INTO estado_insumo (nombre_estado_insumo)
SELECT 'USADO - MUY BUEN ESTADO'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_insumo
    WHERE nombre_estado_insumo = 'USADO - MUY BUEN ESTADO'
);

INSERT INTO estado_insumo (nombre_estado_insumo)
SELECT 'USADO - BUEN ESTADO'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_insumo
    WHERE nombre_estado_insumo = 'USADO - BUEN ESTADO'
);

INSERT INTO estado_insumo (nombre_estado_insumo)
SELECT 'USADO - DETERIORADO'
WHERE NOT EXISTS (
    SELECT 1
    FROM estado_insumo
    WHERE nombre_estado_insumo = 'USADO - DETERIORADO'
);

-- tipo_insumo

INSERT INTO tipo_insumo (nombre_tipo_insumo)
SELECT 'SILLA DE RUEDAS'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_insumo
    WHERE nombre_tipo_insumo = 'SILLA DE RUEDAS'
);

INSERT INTO tipo_insumo (nombre_tipo_insumo)
SELECT 'BOTA'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_insumo
    WHERE nombre_tipo_insumo = 'BOTA'
);

INSERT INTO tipo_insumo (nombre_tipo_insumo)
SELECT 'BASTON'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_insumo
    WHERE nombre_tipo_insumo = 'BASTON'
);

INSERT INTO tipo_insumo (nombre_tipo_insumo)
SELECT 'BRAZO MECANICO'
WHERE NOT EXISTS (
    SELECT 1
    FROM tipo_insumo
    WHERE nombre_tipo_insumo = 'BRAZO MECANICO'
);