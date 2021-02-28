const express = require('express');
const ProductController = require('../controllers/productcontroller');

const router = express.Router();

router.get('/', ProductController.GetAllProducts);
router.get('/:sku', ProductController.GetSingleProduct);
router.post('/', ProductController.CreateProduct);
router.delete('/', ProductController.DeleteAllProducts);
router.delete('/:sku', ProductController.DeleteSingleProduct);
router.put('/:sku', ProductController.UpdateProductEntity);
router.patch('/:sku', ProductController.UpdateProductField);

module.exports = router;
