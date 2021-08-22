var Sequelize = require('sequelize');
var { databaseType, username, password, host, port, databaseName } = require('../configuration/database');

const sequelize = new Sequelize(`${databaseType}://${username}:${password}@${host}:${port}/${databaseName}`);
var User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        field: 'username' 
    },
    apiKey: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true 
});
module.exports = User;