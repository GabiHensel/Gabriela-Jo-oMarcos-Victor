const db = require('../config/db_sequelize.js');

module.exports = {
    async getCreate(req, res) {
        try {
            const avaliadores = await db.Usuario.findAll({ where: { tipoUsuario: 'avaliador' } });
            res.render('avaliacao/atribuirAvaliador', { 
                avaliadores: avaliadores.map(avaliador => avaliador.toJSON()), 
                artigoId: req.params.artigoId 
            });            
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },

    async postCreate(req, res) {
        try {
            let avaliadores = req.body.avaliadorId;
            const artigoId = req.params.artigoId;
    
            if (!Array.isArray(avaliadores)) {
                avaliadores = [avaliadores];
            }
    
            const avaliacoes = await db.Avaliacao.findAll({ where: { artigoId: artigoId } });

            if (avaliacoes.length >= 3) {
                res.status(400).send('Um artigo pode ter no máximo 3 avaliações');
                return;
            }
    
            for (let i = 0; i < avaliadores.length; i++) {
                await db.Avaliacao.create({ artigoId, usuarioId: avaliadores[i], nota1: 0, nota2: 0, notaFinal: 0 });
            }
            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },    
    async getList(req, res) {
        try {
            const avaliacoes = await db.Avaliacao.findAll();
            res.render('avaliacao/avaliacaoList', { avaliacoes: avaliacoes.map(avaliacao => avaliacao.toJSON()) });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },  
    async getEdit(req, res) {
        try {
            const artigo = await db.Artigo.findByPk(req.params.id); 
            if (artigo) {
                const avaliacao = await db.Avaliacao.findOne({ where: { artigoId: artigo.id } });
                if (avaliacao) {
                    if (req.session.usuarioId === avaliacao.usuarioId) {
                        res.render('avaliacao/editarAvaliacao', { avaliacao: avaliacao.toJSON() });
                    } else {
                        res.status(403).send('Você não tem permissão para editar esta avaliação');
                    }
                } else {
                    res.status(404).send('Avaliação não encontrada para este artigo');
                }
            } else {
                res.status(404).send('Artigo não encontrado');
            }
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    },            

    async postEdit(req, res) {
        try {
            console.log(req.body);
            const { nota1, nota2 } = req.body;
            const notaFinal = nota1 * nota2;
            
            await db.Avaliacao.update({
                nota1,
                nota2,
                notaFinal
            }, {
                where: {
                    id: req.params.id
                }
            });
    
            const avaliacao = await db.Avaliacao.findByPk(req.params.id);
            console.log(avaliacao);
            const artigo = await db.Artigo.findByPk(avaliacao.artigoId);

            const avaliacoes = await db.Avaliacao.findAll({ where: { artigoId: artigo.id } });

            const todasNotasMaioresQue25 = avaliacoes.every(avaliacao => avaliacao.notaFinal > 25);
    
            const status = todasNotasMaioresQue25 ? 'aprovado' : 'rejeitado';
    
            await artigo.update({status});
            await artigo.reload();
    
            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro interno no servidor');
        }
    }    
};
