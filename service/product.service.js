const Product = require('../models/product');

const getAllProductsService = async (query) => {
  try {
    return await Product.find(query).select('-_id -__v');
  } catch (e) {
    throw Error('Error while Paginating Products');
  }
};

const GetSingleProductService = async (query) => {
  try {
    return await Product.findOne({ sku: query }).select('-_id -__v');
  } catch (e) {
    throw Error('Error while Paginating Products');
  }
};

const CreateSingleProductService = async (body) => {
  await new Product(body).save();
};

const DeleteAllProductsService = async (query) => Product.deleteMany(query);

const DeleteSingleProductService = async (sku) => Product.deleteOne({ sku });

const UpdateProductFieldService = async (sku, product) => Product.findOneAndUpdate(
  { sku }, product,
  {
    new: true,
  },
).select('-_id -__v');

const UpdateProductEntityService = async (sku, product) => Product.findOneAndReplace(
  { sku }, product, {
    upsert: true,
  },
);
module.exports = {
  getAllProductsService,
  GetSingleProductService,
  CreateSingleProductService,
  DeleteAllProductsService,
  DeleteSingleProductService,
  UpdateProductFieldService,
  UpdateProductEntityService,
};
