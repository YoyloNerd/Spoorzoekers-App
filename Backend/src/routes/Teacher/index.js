const router = require('express').Router();

router.use('/scavengerhunt', require('./ScavengerHunt'));
router.use('/question', require('./Question'));

module.exports = router;