const express = require('express');
const UserController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/', UserController.GetAllUsers);
router.get('/:socialsecurity', UserController.GetSingleUser);
router.post('/', UserController.CreateUser);
router.delete('/', UserController.DeleteAllUsers);
router.delete('/:socialsecurity', UserController.DeleteSingleUser);
router.put('/:socialsecurity', UserController.UpdateUserEntity);
router.patch('/:socialsecurity', UserController.UpdateUserField);

module.exports = router;
