const passport = require('passport'); // the passport npm module

module.exports = app => {
  // We are asking passport to do the necessary stuff
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }) // permissions we require
  );

  // Even though the right handlers look very similar , passport understands the code in the url,
  // so it will exchange the code for actual user profile
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout(); // logout is  a function that is attached to req object by passport, it kills the id in the cookie
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
