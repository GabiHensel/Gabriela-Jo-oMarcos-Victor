const db = require('../config/db_sequelize.js');

module.exports = {
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'noMenu.handlebars' });
    },

    async getLogout(req, res) {
        req.session.destroy();
        res.redirect('/');
    },

    async postLogin(req, res) {
        var user = {
            login: req.body.login
        }
        console.log("chegou no controller")
        db.Usuario.findAll({ where: { login: req.body.login, senha: req.body.senha } }
        ).then(usuarios => {
    
            if (usuarios.length > 0) {
                req.session.login = req.body.login;
                res.locals.login = req.body.login;
    
                // Salve o id do usuário na sessão
                req.session.usuarioId = usuarios[0].dataValues.id;
    
                if (usuarios[0].dataValues.tipoUsuario == 'administrador') {
                    req.session.tipoUsuario  = usuarios[0].dataValues.tipoUsuario ;
                    res.locals.administrador = true;
                }
    
                else if(usuarios[0].dataValues.tipoUsuario == 'autor'){
                    req.session.tipoUsuario  = usuarios[0].dataValues.tipoUsuario ;
                    res.locals.autor = true;
                }
    
                else if(usuarios[0].dataValues.tipoUsuario  == 'avaliador'){
                    req.session.tipoUsuario  = usuarios[0].dataValues.tipoUsuario ;
                    res.locals.avaliador = true;
                }
    
                res.render('home');
            } else
                res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
    },    

    async getCreate(req, res) {
        res.render('usuario/usuarioCreate');
    },

    async postCreate(req, res) {
        try {
            await db.Usuario.create({
                nome: req.body.nome,
                login: req.body.login,
                senha: req.body.senha,
                tipoUsuario: req.body.tipoUsuario
            });
            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    async getList(req, res) {
        try {
            const usuarios = await db.Usuario.findAll();
            res.render('usuario/usuarioList', { usuarios: usuarios.map(user => user.toJSON()) });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },

    async getEdit(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (usuario) {
                res.render('usuario/usuarioEdit', { usuario: usuario.toJSON() });
            } else {
                res.status(404).send('Usuário não encontrado');
            }
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },

    async postEdit(req, res) {
        try {
            await db.Usuario.update({
                nome: req.body.nome,
                login: req.body.login,
                senha: req.body.senha,
                tipoUsuario: req.body.tipoUsuario
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.redirect('/usuarioList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },
    async delete(req, res) {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            await usuario.destroy();
            res.json({ message: 'Usuário deletado com sucesso' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    },  
    async getCreate(req, res) {
        const administrador = req.session.user && req.session.user.tipoUsuario === "administrador";
        
        res.render('usuario/usuarioCreate', { administrador });
    }
};
