const router = require('express-promise-router')();
const { Home, CurrentWeather, register, getApiKey } = require('../controller/weather')
const passportConf = require('../passport');
const passport = require('passport');

router.get('/home', Home);
router.post('/register', register);
router.post('/gettoken', getApiKey);
router.post('/currentweather', passport.authenticate('jwt', { session: false }), CurrentWeather);

module.exports = router;