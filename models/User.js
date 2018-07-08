const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema } = mongoose;

// We need to define all attributes.With mongoose, we loose mongo's ability to add dynamic fields,
// but we can add fields anytime here
const userSchema = new Schema({ googleId: String });

// creates a collection, if it does not exists
mongoose.model('users', userSchema);
