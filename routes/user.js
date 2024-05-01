const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const { formidable } = require('formidable');
const { setLogVariable , restricted } = require('../middleware');
const fs = require('fs');


router.get('/', restricted, setLogVariable ,(req, res, next) => {
    const username = req.session.user
    const userdata = db.userData(username)
    const imgPath = db.getUserImage(username);
    let alert = null;
    res.locals.imgPath = imgPath;

    res.render('user', { title: 'User' ,
    name: userdata[0].username ,
    email: userdata[0].email ,
    userImg : imgPath.user_image ,
    alert : alert });
});

router.post('/',  restricted, setLogVariable , (req , res , next) => {

    const form = formidable({
        uploadDir : 'uploads',
        filter: ({ mimetype }) => {
            const supportedTypes = new Set(['image/jpeg', 'image/png']);
            return mimetype && supportedTypes.has(mimetype);
        }
    });

    form.parse(req, (err, fields, files) => {
        if(err) {
            next(err);
            return
        }

        //Valores dentro del formulario a cambiar en la base de datos
        const username = fields.username;
        const email = fields.email;
        let alert;

        //Comprueba que los valores a cambiar sean diferentes y no existan en el registro
        const userexist = db.userExists(username)

        if(!userexist && username != req.session.user){
            //Funcion que actualiza los datos dentro de la base de datos
            db.updateUserName(username , req.session.user)
            //Actualizacion del username de la sesion
            req.session.user = username;
            alert = true;
        } else if(req.session.user == username){
            alert = null
        } else if(userexist && username != req.session.user){
            alert = false;
        }

        const userEmail = db.userData(req.session.user)[0].email
        const emailExist = db.userEmailExists(email)
        console.log(emailExist)
        if(!emailExist){
            if(userEmail != email){
                db.updateUserEmail(email , req.session.user)
                alert = true
            } else if(userEmail == email){
                alert = null
            }
        } else if(emailExist && userEmail != email ) {
            alert = false;
        }

        //Añade una nueva imagen de usuario
        let imgPath;
        let newImg = files.userFiles;

        if(newImg){
            newImg = files.userFiles[Object.keys(files.userFiles)[0]]
            imgPath = newImg.newFilename
            db.addUserImage(username , imgPath);
            alert = true
        }else{
            let img =  db.getUserImage(req.session.user);
            imgPath = img.user_image
        }

        //Actualizacion de los datos para mandar a la redireccion de la pagina
        const updatedUserdata = db.userData(username);     

        res.render('user', {
            title: 'User',
            name: updatedUserdata[0].username,
            email: updatedUserdata[0].email,
            userImg: imgPath,
            alert: alert
        });
    });
});    

module.exports = router;
