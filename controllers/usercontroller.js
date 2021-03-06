// get, update, delete, create
const UserService = require('../service/user.service');

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

const deleteValidator = (action) => (action.deletedCount > 0 ? 200 : 404);

const GetAllUsers = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.json(await UserService.getAllUsersService(request.query));
  });
};
const GetSingleUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const getResult = await UserService.GetSingleUserService(request.params.socialsecurity);
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const CreateUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    await UserService.CreateSingleUserService(request.body);
    response.sendStatus(201);
  });
};
const DeleteAllUsers = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await UserService.DeleteAllUsersService(request.query)));
  });
};

const DeleteSingleUser = async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await UserService.DeleteSingleUserService(
      request.params.socialsecurity,
    )));
  });
};

const UpdateUserField = async (request, response) => {
  const { socialsecurity } = request.params;
  const user = request.body;
  delete user.socialsecurity;
  await doActionThatMightFailValidation(request, response, async () => {
    const patchResult = await UserService.UpdateUserFieldService(socialsecurity, user);
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
    await UserService.UpdateUserEntityService(socialsecurity, user);
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
  deleteValidator,
};
