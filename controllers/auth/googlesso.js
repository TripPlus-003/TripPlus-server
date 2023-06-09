const mongoose = require('mongoose');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../../models/usersModel');

const googlePassport = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        let user;
        user = await User.findOne({
          email: profile._json.email
        });
        if (!user) {
          user = await User.create({
            email: profile._json.email,
            name: profile._json.name,
            password: profile.id, //如果是 Google SSO 暫時以 google 帳號之 id 為 password
            isGoogleSSO: 1,
            photot: profile._json.picture
          });
        }
        return callback(null, user);
      } catch (err) {
        console.log(err);
        return callback(err);
      }
    }
  )
);

module.exports = googlePassport;
