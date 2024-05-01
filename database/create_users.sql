-- Crear la tabla para usuario si no existe en la base de datos.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users
(
    username varchar(255) PRIMARY KEY,
    email varchar(255) NOT NULL,
    hash varchar(255) NOT NULL,
    user_image varchar(255)
);

