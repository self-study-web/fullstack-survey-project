const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url'); /* default library */
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for your feedback!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    console.log('tp11');
    const p = new Path('/api/surveys/:surveyId/:choice');
    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        /* we cannnot do destructuring as match can be null if it doesnt match*/
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact() /* removes undefined entries */
      /* cant have same email on the same survey */
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 }, // [choice] is not array, key interpolation - means it can be either 'yes' or 'no'
            // increment by one
            $set: { 'recipients.$.responded': true }, // $ means the one we just found out using our search
            lastResponded: new Date()
          }
        ).exec(); /* WE DONT NEED ANY ASYNC HANDLERS AS WE NEED NOT REPLY TO SENDGRID */
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      /* We need not create the fields which has defaults */
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send({ err });
    }
  });
};

/*
app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    const events = _.map(req.body, ({ email, url }) => {
      const match = p.test(new URL(url).pathname);
      // we cannnot do destructuring as match can be null if it doesnt match
if (match) {
  return {
    email,
    surveyId: match.surveyId,
    choice: match.choice
  };
}
    });
const compactEvents = _.compact(events); // removes undefined entries 
// cant have same email on the same survey 
const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
console.log('uniqueEvents', uniqueEvents);
res.send({});
  });

*/
