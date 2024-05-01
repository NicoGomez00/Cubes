const express = require('express');
const session = require('express-session');
const { join } = require('path');
const { createServer } = require('node:http');
const bodyParser = require('body-parser');
const {  io} = require('./socket'); 

const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');
const obraRouter = require('./routes/obra.js');

const PORT = 3000;
const app = express();
const server = createServer(app)

//Ubicar ruta de lectura
app.set('views' , join(__dirname, 'views')) //Join concatena directorios que funcionan en cualquier SO
app.set('view engine' , 'ejs')

app.use(express.static(join(__dirname, 'public')))
app.use(express.static(join(__dirname, 'uploads')))
app.use(express.static(join(__dirname, 'p5')))

// Configuración
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware global de sesión.
app.use(session({
    resave: false, // No guarda el objeto en el almacén de sesiones si este no fue modificado durante el procesamiento de la petición.
    saveUninitialized: false, // No guardar sesiones no inicializadas (nuevas y no modificadas) en el almacén.
    secret: 'shhhh, very secret'  // Clave de cifrado para firmar el ID de la sesión.
}));

// Enrutadores
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use("/obra", obraRouter);

//Escucha de Socket.io
io.attach(server);

server.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})