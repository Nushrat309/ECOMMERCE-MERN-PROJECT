const express = require('express');

const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById } = require('../controllers/userController')
const {uploadUserImage} = require('../middlewares/uploadFile');
const {validateUserRegistration, validateUserPasswordUpdate,validateUserForgetPassword,validateUserResetPassword} = require('../validators/auth');
const { runValidation } =require('../validators/index');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const { handleUpdatePassword,handleForgetPassword,handleManageUserStatusUserById,handleResetPassword } = require("../controllers/userController");

const userRouter = express.Router();

// GET: api/users
userRouter.post('/process-register',uploadUserImage.single("image"),isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post('/activate',isLoggedOut,activateUserAccount);
userRouter.get('/',isLoggedIn,isAdmin, getUsers);
userRouter.get('/:id([0-9a-fA-F]{24})',isLoggedIn, getUserById);
userRouter.delete('/:id([0-9a-fA-F]{24})',isLoggedIn, deleteUserById);
userRouter.put('/reset-password',validateUserResetPassword,runValidation,handleResetPassword);
userRouter.put('/:id([0-9a-fA-F]{24})',uploadUserImage.single('image'),isLoggedIn, updateUserById);
userRouter.put('/ban-user/:id([0-9a-fA-F]{24})',isLoggedIn,isAdmin,handleManageUserStatusUserById);
userRouter.put('/update-passwrd/:id([0-9a-fA-F]{24})',validateUserPasswordUpdate,runValidation, isLoggedIn,handleUpdatePassword);
userRouter.post('/forgate-passwrd',validateUserForgetPassword,runValidation, isLoggedIn,handleForgetPassword);


module.exports = userRouter;