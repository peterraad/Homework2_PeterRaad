// get, update, delete, create
const User = require('../models/user');

const doActionThatMightFailValidation = async (request, response, action) => {
  try {
    await action();
  } catch (e) {
    response.sendStatus(
      // if the code is 11000 or the stack is saying validationerror
      // or reason is undefined or reason code
      // is ERR_ASSERTION then send back response code 400 otherwise 500
      e.code === 11000
            || e.stack.includes('ValidationError')
            || (e.reason !== undefined && e.reason.code === 'ERR_ASSERTION')
        ? 400 : 500,
    );
  }
};
const GetAllUsers = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    // if this part throws an exception where it doesn't find the object specified o
    // r something then it will go to the funcion above and evaluate
    // whether the response should be 4 or 500
    // request.query is the search query the user types in for the request
    // '-_id -__v' this ignores a bunch of stuff except for the id
    // we do not want the await inside the response.json in this controller
    // we want it in a separate service
    response.json(await User.find(request.query).select('-_id -__v'));
  });
};
const GetSingleUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const getResult = await User.findOne({ socialsecurity: request.params.socialsecurity }).select('-_id -__v');
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const CreateUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    await new User(request.body).save();
    response.sendStatus(201);
  });
};
const DeleteAllUsers = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((await User.deleteMany(request.query)).deletedCount > 0 ? 200 : 404); // this 200 or 404 is repeated
    // on 56 so we need to pull this in a common function and have both controllers use this
  });
};
const DeleteSingleUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((await User.deleteOne({
      socialsecurity: request.params.socialsecurity,
    })).deletedCount > 0 ? 200 : 404);
  });
};
const UpdateUserField = async (request, response) => {
  const { socialsecurity } = request.params;
  const user = request.body;
  delete user.socialsecurity;
  await doActionThatMightFailValidation(request, response, async () => {
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
  await doActionThatMightFailValidation(request, response, async () => {
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
