const express = require('express');
const UserController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/users', UserController.GetAllUser);
router.get('/users/:socialsecurity', UserController.GetSingleUser);
router.post('/users', UserController.CreateUser);
router.delete('/users', UserController.DeleteAllUsers);
router.delete('/users/:socialsecurity', UserController.DeleteSingleUser);
router.put('/users/:socialsecurity', UserController.UpdateUserEntity);
router.patch('/users/:socialsecurity', UserController.UpdateUserField);

module.exports = router;
