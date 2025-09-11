const express = require('express');

const { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById } = require('../controllers/userController')
const uploadUserImage = require('../middlewares/uploadFile');
const {validateUserRegistration, validateUserPasswordUpdate,validateUserForgetPassword,validateUserResetPassword} = require('../validators/auth');
const { runValidation } =require('../validators/index');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const { handleUpdatePassword,handleForgetPassword,handleManageUserStatusUserById,handleResetPassword } = require("../controllers/userController");


const userRouter = express.Router();

// GET: api/users
userRouter.post('/process-register',uploadUserImage.single("image"),isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post('/activate',isLoggedOut,activateUserAccount);
userRouter.get('/',isLoggedIn,isAdmin, getUsers);
userRouter.get('/:id',isLoggedIn, getUserById);
userRouter.delete('/:id',isLoggedIn, deleteUserById);
userRouter.put('/reset-password',validateUserResetPassword,runValidation,handleResetPassword);
userRouter.put('/:id',uploadUserImage.single('image'),isLoggedIn, updateUserById);
userRouter.put('/ban-user/:id',isLoggedIn,isAdmin,handleManageUserStatusUserById);
userRouter.put('/update-passwrd/:id',validateUserPasswordUpdate,runValidation, isLoggedIn,handleUpdatePassword);
userRouter.post('/forgate-passwrd',validateUserForgetPassword,runValidation, isLoggedIn,handleForgetPassword);

module.exports = userRouter;