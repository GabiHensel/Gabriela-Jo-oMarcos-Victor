module.exports = (sequelize, Sequelize) => {
    const AutorArtigo = sequelize.define('autorartigo', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      }
    });
    return AutorArtigo;
  }