const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes) {
    const Prisustvo = sequelize.define("Prisustvo", {
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER,
        index: Sequelize.STRING
    });
    return Predmet;
};