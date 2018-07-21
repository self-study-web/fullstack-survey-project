const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // ask express to enable cookies
const passport = require('passport'); // ask passport to use them
const bodyParser = require('body-parser');
const keys = require('./config/keys');
// We need to require passport to include it in the project.
// This is not returning/exporting anything
require('./models/User'); // will ensure when the app boots up, it will load the User model class and will create the collection
require('./models/Survey');
require('./services/passport'); // The order of the require statements matter here, first User has to be created

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey] // key to encrypt cookie, we can give multiple ones, it will randomly pick one
  })
);
app.use(passport.initialize()); // using a middleware (small functions which can modify incoming requests coming to app before they reach route handler)
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve the production assets like
  // our main.js file or main.css file!
  app.use(express.static('client/build'));

  // Express will serve up the index.html file,
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
