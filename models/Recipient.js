const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipentSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

/* Rather than registering the schema with mongoose,
   we are going to export the schema.
   We import this in survey.js and associate it with survey model*/
module.exports = recipentSchema;
