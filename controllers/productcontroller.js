// get, update, delete, create
const Product = require('../models/product');
const dbservice = require('../database.service');

const deleteValidator = (action) => (action.deletedCount > 0 ? 200 : 404);

const GetAllProducts = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    // if this part throws an exception where it doesn't find the object specified o
    // r something then it will go to the funcion above and evaluate
    // whether the response should be 4 or 500
    // request.query is the search query the product types in for the request
    // '-_id -__v' this ignores a bunch of stuff except for the id
    // we do not want the await inside the response.json in this controller
    // we want it in a separate service
    response.json(await Product.find(request.query).select('-_id -__v'));
  });
};
const GetSingleProduct = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    const getResult = await Product.findOne({ sku: request.params.sku }).select('-_id -__v');
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const CreateProduct = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    await new Product(request.body).save();
    response.sendStatus(201);
  });
};
const DeleteAllProducts = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await Product.deleteMany(request.query)));
  });
};
const DeleteSingleProduct = async (request, response) => {
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(deleteValidator(await Product.deleteOne({
      sku: request.params.sku,
    }))); // repeated
  });
};
const UpdateProductField = async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  delete product.sku;
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    const patchResult = await Product
      .findOneAndUpdate({ sku }, product, {
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
const UpdateProductEntity = async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  product.sku = sku;
  await dbservice.doActionThatMightFailValidation(request, response, async () => {
    await Product.findOneAndReplace({ sku }, product, {
      upsert: true,
    });
    response.sendStatus(200);
  });
};

module.exports = {
  GetAllProducts,
  GetSingleProduct,
  CreateProduct,
  DeleteAllProducts,
  DeleteSingleProduct,
  UpdateProductEntity,
  UpdateProductField,
};
