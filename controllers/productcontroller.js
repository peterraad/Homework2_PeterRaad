// get, update, delete, create
const ProductService = require('../service/product.service');

const DeleteValidator = (action) => (action.deletedCount > 0 ? 200 : 404);

const DoActionThatMightFailValidation = async (request, response, action) => {
  try {
    await action();
  } catch (e) {
    response.sendStatus(
      e.code === 11000
        || e.stack.includes('ValidationError')
        || (e.reason !== undefined && e.reason.code === 'ERR_ASSERTION')
        ? 400 : 500,
    );
  }
};
const GetAllProducts = async (request, response) => {
  await DoActionThatMightFailValidation(request, response, async () => {
    response.json(await ProductService.GetAllProductsService(request.query));
  });
};
const GetSingleProduct = async (request, response) => {
  await DoActionThatMightFailValidation(request, response, async () => {
    const getResult = await ProductService.GetSingleProductService(request.params.sku);
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
};
const CreateProduct = async (request, response) => {
  await DoActionThatMightFailValidation(request, response, async () => {
    await ProductService.CreateSingleProductService(request.body);
    response.sendStatus(201);
  });
};
const DeleteAllProducts = async (request, response) => {
  await DoActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(DeleteValidator(await ProductService.DeleteAllProductsService(
      request.query,
    )));
  });
};

const DeleteSingleProduct = async (request, response) => {
  await DoActionThatMightFailValidation(request, response, async () => {
    response.sendStatus(DeleteValidator(await ProductService.DeleteSingleProductService(
      request.params.sku,
    )));
  });
};
const UpdateProductField = async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  delete product.sku;
  await DoActionThatMightFailValidation(request, response, async () => {
    const patchResult = await ProductService.UpdateProductFieldService(sku, product);
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
  await DoActionThatMightFailValidation(request, response, async () => {
    await ProductService.UpdateProductEntityService(sku, product);
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
