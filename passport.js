const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JwtSecret } = require('./configuration/JWTConf');
const User = require('./model/user');
const logger = require('./logger/logger');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JwtSecret
}, async (payload, done) => {
    try {
        const user = await User.findOne({ where: { username: payload.sub } });
        if (!user) {
            logger('WARN', 'User not authenticated', 'Passport Authenticator', payload.sub);
            return done(null, false);
        }
        logger('INFO', 'User authenticated', 'Passport Authenticator', payload.sub);
        done(null, user);
    }
    catch (error) {
        logger('ERROR', `${error}`, 'Passport not Authenticated', payload.sub);
        return done(null, false);
    }
}))
