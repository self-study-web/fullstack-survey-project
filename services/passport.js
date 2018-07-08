const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); // one argument means we are reading, two argument means we are writing
// Its better not to require mongoose models, as in testing environments multiple loading can cause issues

passport.serializeUser((user, done) => {
  done(null, user.id); // Here user.id is the mongo document id, not google ID.To identify the user stored in db
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // accessToken is something we use if we want to access users contact list etc.
      // refreshToken - can be used to refresh the accessToken
      User.findOne({ googleId: profile.id }).then(existingUser => {
        // Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience.
        // If you need a fully-fledged promise, use the .exec() function.
        if (existingUser) {
          // we have a record with the given profile Id
          done(null, existingUser); // First argument is an error object , second user record.
          // We call done to let passport know tha we have completed creating user (saving to the db) , and passport can proceed with the authentication flow
        } else {
          // we dont have a user record with a profile id, create a new one
          new User({ googleId: profile.id }).save().then(user => {
            done(null, user);
          });
        }
      });
    }
  )
);
