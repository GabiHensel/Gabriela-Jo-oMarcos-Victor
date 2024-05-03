const { defaults } = require("pg");

module.exports = (sequelize, Sequelize) =>{
    const Avaliacao = sequelize.define('avaliacao',{
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        nota1:{
            type: Sequelize.FLOAT,
            allowNull: false, defaultValue: 0
        },
        nota2:{
            type: Sequelize.FLOAT,
            allowNull: false, defaultValue: 0
        },
        notaFinal:{
            type: Sequelize.FLOAT,
            allowNull: false, defaultValue: 0
        }
    });
    return Avaliacao;
}