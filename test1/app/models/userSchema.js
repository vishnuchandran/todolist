var mongoose = require('mongoose');
var Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator');
var timeStamps = require('mongoose-timestamp');
var registerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


registerSchema.plugin(uniqueValidator);
registerSchema.plugin(timeStamps);
module.exports = mongoose.model('User', registerSchema);
