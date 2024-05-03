const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_db', 'postgres', 'gabi123', {
  host: 'localhost',
  dialect: 'postgres'
});


var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Artigo = require('../models/artigo.js')(sequelize, Sequelize);
db.Usuario = require('../models/usuario.js')(sequelize, Sequelize);
db.Avaliacao = require('../models/avaliacao.js')(sequelize, Sequelize);
db.AutorArtigo = require('../models/autorartigo.js')(sequelize, Sequelize);
db.Artigo.hasMany(db.Avaliacao);
db.Avaliacao.belongsTo(db.Usuario);
db.Artigo.belongsToMany(db.Usuario, {through: db.AutorArtigo});
module.exports = db;

sequelize.sync()
    .then(async () => {
      console.log("Banco de dados sincronizado com sucesso.");

      await db.Usuario.create({
        nome: 'admin',
        login: 'admin',
        senha: '123',
        tipoUsuario: 'administrador'
      });

      console.log("Usuário criado com sucesso.");
    })
    .catch(err => console.log('Erro ao sincronizar o banco de dados:', err));
