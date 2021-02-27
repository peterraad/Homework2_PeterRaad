const express = require('express');
const UserController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/users', UserController.GetAllUser);
router.get('/users/:sku', UserController.GetSingleUser);
router.post('/users', UserController.CreateUser);
router.delete('/users', UserController.DeleteAllUsers);
router.delete('/users/:sku', UserController.DeleteSingleUser);
router.put('/users/:sku', UserController.UpdateUserEntity);
router.patch('/users/:sku', UserController.UpdateUserField);

module.exports = router;
