const User = require('../models/user');

const getAllUsersService = async (query) => {
  try {
    return await User.find(query).select('-_id -__v');
  } catch (e) {
    throw Error('Error while Paginating Users');
  }
};

const GetSingleUserService = async (query) => {
  try {
    return await User.findOne({ socialsecurity: query }).select('-_id -__v');
  } catch (e) {
    throw Error('Error while Paginating Users');
  }
};

const CreateSingleUserService = async (body) => {
  await new User(body).save();
};

const DeleteAllUsersService = async (query) => User.deleteMany(query);

const DeleteSingleUserService = async (socialsecuriity) => User.deleteOne({ socialsecuriity });
module.exports = {
  getAllUsersService,
  GetSingleUserService,
  CreateSingleUserService,
  DeleteAllUsersService,
  DeleteSingleUserService,
};
