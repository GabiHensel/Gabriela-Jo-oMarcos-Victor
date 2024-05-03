const db = require('../config/db_sequelize.js');
const path = require('path');
const artigo = require('../models/artigo.js');

module.exports = {
  async getCreate(req, res) {
    try {
      const usuarios = await db.Usuario.findAll({
        where: {
          tipoUsuario: 'autor'
        }
      });
      const plainUsuarios = usuarios.map(user => user.get({ plain: true }));
      res.render('artigo/artigoCreate', { usuarios: plainUsuarios });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  async postCreate(req, res) {
    try {
        const { titulo, resumo, linkPDF, autores } = req.body;
        const autoresArray = Array.isArray(autores) ? autores : [autores];

        if (autoresArray.length < 1 || autoresArray.length > 5) {
            return res.status(400).send('Por favor, selecione entre 1 e 5 autores.');
        }

        const novoArtigo = await db.Artigo.create({ titulo, resumo, linkPDF });
        const autorArtigos = autoresArray.map(id => ({ artigoId: novoArtigo.id, usuarioId: id }));
        await db.AutorArtigo.bulkCreate(autorArtigos);
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro interno no servidor');
    }
}, 

async getList(req, res) {
  try {
    const artigos = await db.Artigo.findAll({
      include: [
        {
          model: db.Usuario,
          as: 'usuarios', 
          through: { attributes: [] }
        },
        {
          model: db.Avaliacao,
          as: 'avaliacaos',
          attributes: ['notaFinal'] 
        }
      ]
    });
    res.render('artigo/artigoList', { artigos: artigos });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
},

  async getEdit(req, res) {
    try {
        const artigo = await db.Artigo.findByPk(req.params.id, {
            include: [
                {
                    model: db.Usuario,
                    as: 'usuarios',
                    through: { attributes: [] }
                }
            ]
        });
        const usuarios = await db.Usuario.findAll({
            where: {
                tipoUsuario: 'autor'
            }
        });
        if (!artigo) {
            return res.status(404).send('Artigo não encontrado');
        }
        res.render('artigo/artigoEdit', { artigo: artigo.get({ plain: true }), usuarios: usuarios.map(user => user.get({ plain: true })) });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro interno no servidor');
    }
},

async postEdit(req, res) {
    try {
        const { titulo, resumo, linkPDF, autores } = req.body;
        const autoresArray = Array.isArray(autores) ? autores : [autores];

        if (autoresArray.length < 1 || autoresArray.length > 5) {
            return res.status(400).send('Por favor, selecione entre 1 e 5 autores.');
        }

        await db.Artigo.update({ titulo, resumo, linkPDF }, {
            where: {
                id: req.params.id
            }
        });
        await db.AutorArtigo.destroy({
            where: {
                artigoId: req.params.id
            }
        });
        const autorArtigos = autoresArray.map(id => ({ artigoId: req.params.id, usuarioId: id }));
        await db.AutorArtigo.bulkCreate(autorArtigos);
        res.redirect('/artigoList');
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro interno no servidor');
    }
},
async delete(req, res) {
  try {
      const artigo = await db.Artigo.findByPk(req.params.id);
      if (!artigo) {
          return res.status(404).send('Artigo não encontrado');
      }

      await artigo.destroy();
      res.json({ message: 'Artigo deletado com sucesso' });
  } catch (err) {
      console.log(err);
      res.status(500).send('Erro interno no servidor');
  }
}

};
