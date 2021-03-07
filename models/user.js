const Mongoose = require('mongoose');

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
      'Please enter a valid phone number'],
  },
}, {
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
