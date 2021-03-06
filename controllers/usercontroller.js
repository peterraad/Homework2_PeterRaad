// get, update, delete, create
const User = require('../models/user');
const dbservice = require('../database.service');

const deleteValidator = (action) => (action.deletedCount > 0 ? 200 : 404);

const GetAllUsers = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    // if this part throws an exception where it doesn't find the object specified o
    // r something then it will go to the function above and evaluate
    // whether the response should be 4 or 500
    // request.query is the search query the user types in for the request
    // '-_id -__v' this ignores a bunch of stuff except for the id
    // we do not want the await inside the response.json in this controller
    // we want it in a separate service
    response.json(await User.find(request.query).select('-_id -__v'));
  });
};
const GetSingleUser = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    const getResult = await User.findOne({ socialsecurity: request.params.socialsecurity }).select('-_id -__v');
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const CreateUser = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    await new User(request.body).save();
    response.sendStatus(201);
  });
};
const DeleteAllUsers = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await User.deleteMany(request.query)));
  });
};

const DeleteSingleUser = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await User.deleteOne({
      socialsecurity: request.params.socialsecurity,
    })));
  });
};
const UpdateUserField = async (request, response) => {
  const { socialsecurity } = request.params;
  const user = request.body;
  delete user.socialsecurity;
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    const patchResult = await User
      .findOneAndUpdate({ socialsecurity }, user, {
        new: true,
      })
      .select('-_id -__v');
    if (patchResult != null) {
      response.json(patchResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const UpdateUserEntity = async (request, response) => {
  const { socialsecurity } = request.params;
  const user = request.body;
  user.socialsecurity = socialsecurity;
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    await User.findOneAndReplace({ socialsecurity }, user, {
      upsert: true,
    });
    response.sendStatus(200);
  });
};

module.exports = {
  GetAllUsers,
  GetSingleUser,
  CreateUser,
  DeleteAllUsers,
  DeleteSingleUser,
  UpdateUserEntity,
  UpdateUserField,
};
