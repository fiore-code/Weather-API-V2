const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/logger');
const { port } = require('./configuration/server');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Origin,X-Requested-Width,Control-Type,Accept");
    next();
});

app.use('/', require('./routes/weather'));

//app listening

app.listen(port, () => {
    logger('INFO', `Node JS server started at port ${port}`, 'Server started', null);
});