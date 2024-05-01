const db = require('./database/db.js');

//Verifica que el usuario este logeado para poder acceder
exports.restricted = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

//Declara datos para usarse en diferentes paginas
exports.setLogVariable = (req, res, next) => {
    imgPath = '';
    if (req.session.user) {
        res.locals.log = req.session.user;
        imgPath = db.getUserImage(req.session.user);
        res.locals.imgPath = imgPath;
    } else {
        res.locals.log = req.session.user;
    }
    next();
};