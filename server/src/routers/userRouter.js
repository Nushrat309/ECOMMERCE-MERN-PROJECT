const express = require('express');

const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById } = require('../controllers/userController')
const uploadUserImage = require('../middlewares/uploadFile');
const {validateUserRegistration} = require('../validators/auth');
const { runValidation } =require('../validators/index');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');

const userRouter = express.Router();

// GET: api/users
userRouter.post('/process-register',uploadUserImage.single("image"),isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post('/activate',isLoggedOut,activateUserAccount);
userRouter.get('/',isLoggedIn, getUsers);
userRouter.get('/:id',isLoggedIn, getUserById);
userRouter.delete('/:id',isLoggedIn, deleteUserById);
userRouter.put('/:id',uploadUserImage.single('image'),isLoggedIn, updateUserById);

module.exports = userRouter;