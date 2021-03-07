const User = require('../models/user');

const GetAllUsersService = async (query) => {
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
const DeleteSingleUserService = async (socialsecurity) => User.deleteOne({ socialsecurity });
const UpdateUserFieldService = async (socialsecurity, user) => User.findOneAndUpdate(
  { socialsecurity }, user,
  {
    new: true,
  },
).select('-_id -__v');

const UpdateUserEntityService = async (socialsecurity, user) => User.findOneAndReplace(
  { socialsecurity }, user, {
    upsert: true,
  },
);
module.exports = {
  GetAllUsersService,
  GetSingleUserService,
  CreateSingleUserService,
  DeleteAllUsersService,
  DeleteSingleUserService,
  UpdateUserFieldService,
  UpdateUserEntityService,
};
