module.exports = {
    logRegister(req, res, next){
        console.log(req.url + req.method + new Date());
        next();
    },
    sessionControl(req, res, next){
        if(req.session.login != undefined){
            res.locals.login = req.session.login;
            if(req.session.tipoUsuario == 'administrador'){
                res.locals.administrador = true;

                console.log("acessou o middleware")
            }
            else if(req.session.tipoUsuario == 'autor'){
                res.locals.autor = true;
            }
            else if(req.session.tipoUsuario == 'avaliador'){
                res.locals.avaliador = true;
            }
            next();
        } else if (req.url === '/' && req.method === 'GET'){
            next();
        }else if (req.url === '/login' && req.method === 'POST'){
            next();
        } else {
            res.redirect('/');
        }
    }
}