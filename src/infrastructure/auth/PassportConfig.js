const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('../../config/env');

if (env.google.clientId && env.google.clientSecret) {
  passport.use(new GoogleStrategy({
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl
    },
    function(accessToken, refreshToken, profile, cb) {
      // Pass the profile straight so the controller can handle finding/creating the user.
      return cb(null, profile);
    }
  ));
} else {
  console.warn('[Passport] Google OAuth config missing. Google login will not work.');
}

module.exports = passport;
