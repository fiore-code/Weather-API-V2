const { response } = require('express');
const JWT = require('jsonwebtoken');
const request = require('request');
const { baseUrl, apiKey } = require('../configuration/index');
const User = require('../model/user');
const { JwtSecret, issuer } = require('../configuration/JWTConf');
const logger = require('../logger/logger');

signToken = userData => {
    return JWT.sign({
        iss: issuer,
        sub: userData,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 365)
    }, JwtSecret)
};

module.exports = {
    Home: (req, res, next) => {
        res.json({ "resource": "resourse" });
    },

    register: async (req, res, next) => {
        logger('INFO', 'Registering User and sending back ApiKey', 'register', null);
        const username = req.body.username;
        const token = signToken(username);
        let isRegistered = false;
        //check if the user already exists
        const response = await User.findOne({ where: { username: username } })
        if (!response) {
            isRegistered = true;
            User.sync().then(function () {
                return User.create({
                    username: username,
                    apiKey: token
                });
            }).catch(err => {
                console.log(err);
            });

        }
        if (isRegistered) {
            logger('INFO', ` User registered`, 'register', username);
            res.status(200).json({ "ApiKey": token });
        } else {
            logger('WARN', `User already exists`, 'register', username);
            res.status(200).json({ "ApiKey": "Sorry User Already Exists" });
        }
    },
    getApiKey: async (req, res, next) => {
        logger('INFO', 'calling to get Api Key', 'getApiKey', null);
        const username = req.body.username;
        const user = await User.findOne({ where: { username: username } })
        //console.log(user);
        if (!user) {
            logger('WARN', `User doesn't exist`, 'getApiKey', username);
            res.status(200).json({ "Info": "User doesn't exist" });
        }
        else {
            logger('INFO', `sent api key back`, 'getApiKey', username);
            const apiKeyValue = user.dataValues.apiKey;
            res.status(200).json({ "ApiKey": apiKeyValue });
        }
    },

    CurrentWeather: (req, res, next) => {
        logger('INFO', 'calling to get weather', 'CurrentWeather', null);
        const path = 'current.json';
        const place = req.body.place;
        const requestUrl = `${baseUrl}/${path}?Key=${apiKey}&q=${place}`;
        request.get(requestUrl,
            (err, ressponse, body) => {
                console.error('error ' + err);
                console.log('status code ' + response.statusCode);
                console.log('body ' + body);
                res.status(200).json(body);
            });
    }
}