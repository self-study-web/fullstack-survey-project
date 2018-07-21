email = 'a@a.com';
choice = 'yes' || 'no';

// find and update
// This is done entirely by the mongo database
Survey.updateOne(
  {
    id: surveyId,
    recipients: {
      $elemMatch: { email: email, responded: false }
    }
  },
  {
    $inc: { [choice]: 1 }, // [choice] is not array, key interpolation - means it can be either 'yes' or 'no'
    // increment by one
    $set: { 'recipients.$.responded': true } // $ means the one we just found out using our search
  }
);
