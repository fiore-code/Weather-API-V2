const fs = require('fs');
const { path } = require('../configuration/logger');

function logger(logLevel, details, functionName, username) {
    fs.appendFile(path, `--${logLevel} :CREATED AT:${new Date().toISOString()} :FUNCTION NAME:${functionName} :USERNAME:${username} :DESCRIPTION: ${details} \n`, (err) => {
        if (err) {
            console.error(err);
        }
    });
}
module.exports = logger;