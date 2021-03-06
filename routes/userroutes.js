const express = require('express');
const BodyParser = require('body-parser');
const UserController = require('../controllers/usercontroller');

const router = express.Router();
router.use(BodyParser.json());
router.get('/', UserController.GetAllUsers);
router.get('/:socialsecurity', UserController.GetSingleUser);
router.post('/', UserController.CreateUser);
router.delete('/', UserController.DeleteAllUsers);
router.delete('/:socialsecurity', UserController.DeleteSingleUser);
router.put('/:socialsecurity', UserController.UpdateUserEntity);
router.patch('/:socialsecurity', UserController.UpdateUserField);

module.exports = router;
