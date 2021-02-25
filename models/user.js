const Mongoose = require('mongoose');

// require('bob-mongoose-currency').loadType(Mongoose);

// put validation fields in the schema for the social security number of having hyphens
// module.exports - tells node that what this file exports is the thing on the right hand
// side of the equal sign
module.exports = Mongoose.model('User', new Mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, min: 0 },
  socialsecurity: { type: String, required: true, unique: true },
}, {
  // getters are using the schema to transform the schema properly
  // virtuals is metadata we do not need
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
