const router = require('express').Router();
const passport = require('passport');
const LoggedIn = require('../utils/middleware');

router.get('/microsoft',
    passport.authenticate('microsoft', {
        // Optionally define any authentication parameters here
        // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

        prompt: 'select_account',
    }),
    (req, res) => { res.redirect(`http://localhost:3000/`) }
);
router.get('/loggedin', (req, res) => {
    if (req.user) {
        res.send({ loggedIn: true });
    } else {
        res.send({ loggedIn: false });
    }
});
router.get('/user', LoggedIn, (req, res) => {
    res.send({ user: req.user });
});

router.get('/logout', LoggedIn, function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        process.env.DEV ? res.redirect('http://localhost:3000') :
            res.redirect('/');
    });
});

module.exports = router;