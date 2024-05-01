const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/db.js');
const router = express.Router();
const { setLogVariable } = require('../middleware');

/** Pagina Principal */
router.get('/', setLogVariable , (req, res, next) => {
    let usersArray = db.log();
    if(imgPath){
        imgPath = res.locals.imgPath.user_image
    }
    res.render('index', { 
        title: 'Página principal',
        log: res.locals.log,
        name: req.session.user,
        usersArray:usersArray,
        userImg : imgPath
    });

});

/** About */
router.get('/about' , setLogVariable , (req, res, next) => {
    if(imgPath){
        imgPath = res.locals.imgPath.user_image
    }
    res.render('about', { title: 'About' , log: res.locals.log , userImg : imgPath});
})


/** Sing Up */
router.get('/signup', setLogVariable, (req, res, next) => {
    // Enviar el formulario.
    let log = res.locals.log
    let alert = null;
    log ? res.redirect('/') : res.render('signup', { title: 'Sign Up' ,log: log , alert : alert});
});

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;
    let alert;

    if (db.userExists(username) || db.userEmailExists(email)) {
        alert = false;
    } else {
        const userImg = db.getUserImage(username);
        const hash = bcrypt.hashSync(password, 10);  // round = 2 ** 10;
        db.addUser(username, email, hash , userImg);
        return res.render('usuarioRegistrado', { title: 'SignUp' , log : res.locals.log});
    }
    res.render('signup', { title: 'Sign Up' ,log: res.locals.log , alert : alert});
});


/** Log In */
router.get('/login', setLogVariable, (req, res, next) => {
    //Redirije la pag en caso de que la session se encuentre abierta
    let log = res.locals.log
    let alert = null;
    log ? res.redirect('/') : res.render('login', { title: 'Login' , log:log , alert : alert});
});

router.post('/login', (req, res, next) => {
    // Recibir los datos del formulario.
    const { username, password } = req.body;
    let alert;

    function authenticate(username, password) {
        if (!db.userExists(username)) return false
        const hash = db.getHash(username);
        const ok = bcrypt.compareSync(password, hash);
        if (!ok) return false
        return true;
    }
    const ok = authenticate(username, password);
    if (ok) {
        req.session.regenerate(() => {
            req.session.user = username;
            req.session.success = `Authenticated as ${username}`;
            res.redirect('/user');
        });
    } else {
        alert = false;
        res.render('login' , {title: 'Login' ,log: res.locals.log ,  alert : alert});
    }
});

/** Log Out */
router.get('/logout', (req, res) => {
    // Destruye los datos de la sesión que se regeneran para la próxima petición.
    // El usuario queda deslogueado y se lo redirecciona a la página principal.
    req.session.destroy(() => {
        res.redirect('/');
    });
}); 

module.exports = router;