const MicrosoftStrategy = require('passport-microsoft').Strategy;
const passport = require('passport');
const User = require('../schemas/Teacher/User');
const uuidv4 = require('uuid').v4;

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser(async (userIn, done) => {
    try {
        const user = await User.findOne({ uuid: userIn.uuid });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        console.log(err)
        return done(err, null);

    }
});

passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: process.env.OAUTH_MICROSOFT_ID,
    clientSecret: process.env.OAUTH_MICROSOFT_SECRET,
    callbackURL: process.env.MICROSOFT_REDIRECT_URL,
    scope: ['user.read'],

    // Microsoft specific options

    // [Optional] The tenant for the application. Defaults to 'common'. 
    // Used to construct the authorizationURL and tokenURL
    tenant: 'common',

    // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

    // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let findUser = await User.findOne({ microsoftID: profile.id })
            if (findUser) {
                return done(null, findUser);
            } else {
                const uuid = uuidv4();
                const newUser = await User.create({
                    microsoftID: profile.id,
                    name: profile.name.givenName,
                    familyName: profile.name.familyName,
                    email: profile.emails[0].value,
                    uuid
                })
                return done(null, newUser)
            }
        } catch (err) {
            console.log(err);
            return done(err, null)
        }
    }
));