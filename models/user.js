const Mongoose = require('mongoose');

// require('bob-mongoose-currency').loadType(Mongoose);

// put validation fields in the schema for the social security number of having hyphens
// module.exports - tells node that what this file exports is the thing on the right hand
// side of the equal sign
module.exports = Mongoose.model('User', new Mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, min: 0 },
  socialsecurity: {
    type: String,
    required: true,
    unique: true,
    match: [/^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/, 'Please enter a valid social security number'],
  },
  address: { type: String },
  phone: {
    type: String,
    match: [/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
      'Please eneter a valid phone number'],
  },
}, {
  // getters are using the schema to transform the schema properly
  // virtuals is metadata we do not need
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
