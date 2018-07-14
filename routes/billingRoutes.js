const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

/* Express will not by default parse the request body, we use body parser middleware */
module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    try {
      const charge = await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '5$ for five email credits',
        source: req.body.id
      });
      // we get current user as req.user from passsport
      req.user.credits += 5;
      const user = await req.user.save();
      res.send(user);
    } catch (e) {
      res.status(500).send({ error: 'Unexpected error' });
    }
  });
};
