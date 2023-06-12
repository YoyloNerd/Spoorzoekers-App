const LoggedIn = require('../utils/middleware');
const router = require('express').Router();

router.use('/auth', require('./auth'));

router.use('/teacher', LoggedIn, require('./Teacher'));
router.use('/game', require('./Game'));

module.exports = router;