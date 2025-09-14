const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require("../models/userModel");
const { findwithId } = require("../services/finditem");
const { successResponse } = require("./responseController");
const { deleteImage } = require('../helper/deleteImagee');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require('../secret');
const emailWithNodeMailer = require('../helper/email');
const { runValidation } = require('../validators');
const { options } = require('../routers/userRouter');
const { handleUserAction, updateUserPasswordById, forgetPasswordByEmail, resetPassword } = require('../services/userService');
const { isAdmin } = require('../middlewares/auth');
const checkUserExists = require('../helper/checkUserExist');
const sendemail = require('../helper/sendEmail');
const cloudinary = require('../config/cloudinary');


const getUsers = async(req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ],
        };

        const projection = { password: 0 };

        const users = await User.find(filter, projection)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(filter);

        if (users.length === 0) {
            throw createError(404, "No users found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Users were returned successfully',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });

    } catch (error) {
        next(error);
    }
};


const getUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findwithId(User,id, options);
        return successResponse(res, {
            statusCode: 200,
            message: 'User was returned successfully',
            payload: { user },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findwithId(User, id, options);

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        })

        return successResponse(res, {
            statusCode: 200,
            message: 'User was deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const processRegister = async (req,res,next) =>{
    try{
        const {name,email,password,phone,address} = req.body;
        
        const image = req.file?.path;
        if(image && image.size > 1024 * 1024 * 2){
            throw createError(400, 'File too large.It must be less than 2 MB');
        }
        

        const imageBufferString = image.buffer.toString('base64');

        const userExists = await checkUserExists(email);
        if(userExists){
            throw createError(409,'User with this email already exist.Please sign in');
        }
    
    const tokenPayload = {name, email, password, phone, address}; 

    if(image){
        tokenPayload.image = image;
    }
    const token = createJSONWebToken(
        tokenPayload,
        jwtActivationKey,
        '10m'
    );

    //prepare email
    const emailData = {
        email,
        subject: 'Account Activation Email',
        html:`
        <h2> Hellow ${name} ! </h2>
        <p> Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
        `,
    };
    sendemail(emailData);
    
    return successResponse(res,{
        statusCode:200,
        message: `Please go to your ${email} for completing your registration process`,
        payload: { token },
        });
    }catch (error){
        next(error);
    }
};

const activateUserAccount = async (req,res,next) =>{
    try{
        const token = req.query.token;
        if(!token) throw createError(404,'token not found');
        
        const decode = jwt.verify(token, jwtActivationKey);
        if(!decode) throw createError(401,'Unable to verify user');

        const userExists = await User.exists({email:decode.email});
        if(userExists){
            throw createError(409,'User with this email already exist.Please sign in');
        }

        const image = decode.image;
        if(image){
            const response = await cloudinary.uploader.upload(image,{
                folder: 'ecommerceMern',
            });

            decode.image = response.secure_url;
        }

        await User.create(decode);
       
        return successResponse(res,{
            statusCode:201,
            message: "user was registered successfully",
        });

    } catch(error){
        if (error.name == 'TokenExpiredError'){
            return next(createError(401, 'Token has expired'));
        } else if (error.name == 'JsonWebTokenError'){
            return next(createError(401, 'Invalid Token'));
        } else {
            return next(error);
        }
    }
};

const updateUserById = async(req, res, next) => {
    try {
        const userId = req.params.id;
        const options = { password: 0 };
        await findwithId(User, userId, options);

        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates ={};

        for (let key in req.body){
            if(['name', 'password', 'phone', 'address'].includes(key)){
                updates[key]=req.body[key];
            }
            else if (['email'].includes(key)){
                throw createError(400, 'Email can not be updated');
            }
        }

        const image = req.files;
        if(image){
          if(image.size > 1024 * 1024 * 2){
            throw createError(400, 'File too large.It must be less than 2 MB');
          }
          updates.image = image;
          user.image !== 'defailt.png' && deleteImage(user.image);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

        if(!updatedUser){
            throw createError(404,'User with this ID does not exist');
        }
       
        return successResponse(res, {
            statusCode: 200,
            message: 'User was updated successfully',
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const handleManageUserStatusUserById = async(req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;
        
        const successMessage = await handleUserAction(action, userId);
       
       return successResponse(res, {
        statusCode: 200,
        message: successMessage,
       });
    } catch (error) {
        next(error);
    }
};

const handleGetUsers = async (req, res, next) => {
  try{
       const searchRegExp = new RegExp('.*' + search + '*.','i');
    const filter = {
        isAdmin: { $ne: true },
        $or: [
            { name: {$regex: searchRegExp }},
            { email: {$regex: searchRegExp }},
            { phone: {$regex: searchRegExp }},

        ],
    };
    const options = { password: 0};

    const users = await User.find(filter,options)
      .limit(limit)
      .skip((page-1)* limit);

    const count = await User.find(filter).countDocument();

    if(!users || users.length == 0) throw createHttpError(404,'No users found');

    return{
        users,
        pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        }
    }
    } catch (error){
       throw error;
    }
};

const handleGetUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserById(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: 'user was returned successfully',
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const handledeleteUserById = async (req,res,next) => {
    try{
        const id = req.params.id;
        const options = { password: 0};
        await deleteUserById(id, options);

       return successResponse(res,{
        statusCode: 200,
        message: 'user was deleted successfully',
       });
    }catch (error){
        next(error);
    }
}

const handleUpdateUserById = async (req,res,next) => {
   try {
    const userId = req.params.id;
    const updatedUser = await updateUserById(userId, req);
    return successResponse(res,{
        statusCode: 200,
        message: 'User was updated sucessfully',
        payload: updatedUser,
    })
  } catch (error) {
    throw error;
  }
};

const handleUpdatePassword = async (req,res,next) => {
  try{
    const {email,oldPassword,newPassword,c}= req.body;
    const userId = req.params.id;

    const updatedUser = await updateUserPasswordById(userId,email,oldPassword,newPassword,confirmedPassword);

   return successResponse(res,{
     statusCode:200,
     message: 'user was updated sucessfully',
     payload: { updatedUser},
   });
       
    } catch (error) {
        throw(error);
    }
};

const handleForgetPassword = async (req,res,next) => {
  try{
    const { email } = req.body;
    
    const token = await forgetPasswordByEmail(email);
    return successResponse(res,{
        statusCode:200,
        message: `Please go to your ${email} for reseting the password`,
        payload: token,
        });
    }catch(error){
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
   await resetPassword(token,password);

    return successResponse(res, {
      statusCode: 200,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};



module.exports = { 
    getUsers, 
    getUserById, 
    deleteUserById,
    processRegister, 
    activateUserAccount,
    updateUserById,
    handleManageUserStatusUserById,
    handleGetUsers,
    handleGetUserById,
    handledeleteUserById,
    handleUpdateUserById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword
};