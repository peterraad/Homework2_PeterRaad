const User = require('./models/user');
const Product = require('./models/product');

exports.getUsers = async function (query, page, limit, request) {
  try {
    return await User.find(request.query).select('-_id -__v');
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Users');
  }
};
