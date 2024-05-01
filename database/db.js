const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('user.db', { verbose: console.log });
const filename = path.join(__dirname, 'create_users.sql');
const file = fs.readFileSync(filename, 'utf-8');
db.exec(file);

//Retorna un array con el username y el email de todos los usuarios
exports.log = () => {
    const stmt = db.prepare('SELECT rowid, * FROM users');
    const ret = stmt.all();

    let usersArray = [];
    for (let i = 0; i < ret.length; i++) {
        let user = {
            name: ret[i].username,
            email: ret[i].email
        };
        usersArray.push(user);
    }
    return usersArray;
};

//Retorna un array con los datos de un usuario
exports.userData = (username) =>{
    const stmt = db.prepare('SELECT * FROM users WHERE username=?');
    const ret = stmt.all(username);
    return ret;
};

// devolver true/false según exista el nombre de usuario en la base de datos.
exports.userExists = (username) => {
    const stmt = db.prepare('SELECT username FROM users WHERE username=?');
    const ret = stmt.get(username);
    if(!ret) return false;
    return true;
};
    
// devolver true/false según exista el email del usuario en la base de datos.
exports.userEmailExists = (username) => {
    const stmt = db.prepare('SELECT email FROM users WHERE email=?');
    const ret = stmt.get(username);
    if(!ret) return false;
    return true;
};

//añadir usuario a la base de datos
exports.addUser = (username, email, hash , userImg) => {
    // Agregar la entrada para el nuevo usuario.
    const stmt = db.prepare('INSERT INTO users (username , email , hash , user_image) VALUES (?, ?, ? , ?)');
    stmt.run(username, email, hash , userImg);
};

//Obtener el hash
exports.getHash = (username) => {
    let stmt = db.prepare('SELECT hash FROM users WHERE username=?');
    return stmt.get(username).hash;
}

//Añadir imagen al usuario
exports.addUserImage = (username, path) => {
    let stmt = db.prepare('UPDATE users SET user_image = ? WHERE username = ?');
    stmt.run(path , username);
}

//Obtener el nombre en hash de la imagen
exports.getUserImage = (username) => {
    let stmt = db.prepare('SELECT user_image FROM users WHERE username = ?');
    return stmt.get(username);
};

//Actualizar nombre de usuario
exports.updateUserName = (username , userId) => {
    let stmt = db.prepare('UPDATE users SET username = ? WHERE username = ?')
    stmt.run(username , userId);
}

//Actualizar email de usuario
exports.updateUserEmail = (email , userId) => {
    let stmt = db.prepare('UPDATE users SET email = ? WHERE username = ?')
    stmt.run(email , userId);
}

exports.deleteAll = () => {
    let stmt = db.prepare('DELETE * FROM users')
    stmt.run();
} 

// Siempre cerrar la conexión, apagar, al terminar, este código sirve luego para el servidor express.
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
