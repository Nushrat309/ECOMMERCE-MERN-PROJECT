const express = require('express');

const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById } = require('../controllers/userController')
const uploadUserImage = require('../middlewares/uploadFile');
const {validateUserRegistration} = require('../validators/auth');
const { runValidation } =require('../validators/index');

const userRouter = express.Router();

// GET: api/users
userRouter.post('/process-register',uploadUserImage.single("image"), validateUserRegistration, runValidation, processRegister);
userRouter.post('/verify',activateUserAccount);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);
userRouter.put('/:id',uploadUserImage.single('image'), updateUserById);

module.exports = userRouter;