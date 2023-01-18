const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Nastavnik = sequelize.define("nastavnik", {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    });
    return Nastavnik;
};