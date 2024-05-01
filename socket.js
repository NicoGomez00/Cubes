const { Server } = require("socket.io");
const express = require('express');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app)
const io = new Server(server)
const usuariosActivos = new Map();

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    // Recopilar datos del usuario
    const usuario = {
        id: socket.id,
        username: 'UsuarioNuevo' // Puedes personalizar esto según tu lógica de autenticación
    };
    // Agregar usuario a la lista de usuarios activos
    usuariosActivos.set(socket.id, usuario);
    // Emitir lista de usuarios activos a todos los clientes
    io.emit('usuariosActivos', Array.from(usuariosActivos.values()));
    // Manejar desconexión de usuarios
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
        // Eliminar usuario de la lista de usuarios activos
        usuariosActivos.delete(socket.id);
        // Emitir lista actualizada de usuarios activos a todos los clientes
        io.emit('usuariosActivos', Array.from(usuariosActivos.values()));
    });
  console.log(usuariosActivos.size)
});
module.exports = { io, usuariosActivos }