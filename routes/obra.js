const express = require('express');
const db = require('../database/db.js');
const { setLogVariable } = require('../middleware');
const router = express.Router();

router.get('/', setLogVariable  , (req, res, next) => {
    let log = req.session.user;
    if(imgPath){
        imgPath = res.locals.imgPath.user_image
    }
    cantUsuarios = db.log().length
    let data = {cantUsuarios : cantUsuarios};
    
    res.render('obra', { data: JSON.stringify(data) , log : log , userImg : imgPath});
});

module.exports = router;