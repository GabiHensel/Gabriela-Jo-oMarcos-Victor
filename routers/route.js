const express = require('express');
const path = require('path');
const db = require('../config/db_sequelize.js');
const router = express.Router();
const controllerArtigo = require('../controllers/controllerArtigo.js');
const controllerUsuario = require('../controllers/controllerUsuario.js');
const controllerAvaliacao = require('../controllers/controllerAvaliacao.js');

module.exports = router;

router.get("/home", function(req, res) {
    res.render('home');
});

router.get("/",controllerUsuario.getLogin);
router.post("/login", controllerUsuario.postLogin); 
router.get("/login", controllerUsuario.getLogin); 
router.get("/logout", controllerUsuario.getLogout);

router.get("/usuarioCreate",controllerUsuario.getCreate);
router.post("/usuarioCreate",controllerUsuario.postCreate);
router.get("/usuarioList",controllerUsuario.getList);
router.get("/usuarioEdit/:id", controllerUsuario.getEdit); 
router.post("/usuarioEdit/:id", controllerUsuario.postEdit); 
router.delete("/usuarioDelete/:id", controllerUsuario.delete);

router.get("/artigoCreate", controllerArtigo.getCreate);
router.post("/artigoCreate", controllerArtigo.postCreate);
router.get("/artigoList", controllerArtigo.getList);
router.get("/artigoEdit/:id", controllerArtigo.getEdit);
router.post("/artigoEdit/:id", controllerArtigo.postEdit);
router.delete("/artigoDelete/:id", controllerArtigo.delete);

router.get("/atribuirAvaliador/:artigoId", controllerAvaliacao.getCreate);
router.post("/atribuirAvaliador/:artigoId", controllerAvaliacao.postCreate);
router.get('/editarAvaliacao/:id', controllerAvaliacao.getEdit);
router.post('/editarAvaliacao/:id', controllerAvaliacao.postEdit);
