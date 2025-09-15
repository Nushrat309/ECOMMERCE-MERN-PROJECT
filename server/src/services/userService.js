const createError = require("http-error");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {createJSONWebToken} = require('../helper/jsonwebtoken');
const { jwtResetPasswordKey } = require('../secret');


const findUsers = async (search,limit,page) =>{
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

    if(!users || users.length == 0) throw createHttpError(404,'no users found');

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

const findUserById = async (Id, options = {}) => {
  try {
    const user = await User.findById(Id, options);
    if (!user) throw createError(404, 'user not found');
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, 'Invalid Id');
    }
    throw error;
  }
};


const deleteUserById = async (id, options = {}) => {
  try {
    const existingUser = await User.findOne({
      _id: id,
    });

    if (existingUser && existingUser.image) {
      const publicId = await publicIdWithoutExtensinFromUrl(
        existingUser.image
      );
      await deleteFileFromCloudinary('ecommerceMern/users', publicId, 'User');
    }

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, 'Invalid Id');
    }
    throw error;
  }
};




const updateUserById = async (userId, req) => {
  try { 
        const options = { password: 0};
        const user = await findUserById(userId,options);

        if(!user) {
          throw createError(404, 'User not found');
        }

        const updateOptions = { new: true,runValidators: true,context: 'query'};
        let updates = {};
        const allowedFields = ['name', 'password', 'phone', 'address'];
        for(const key in req.body){
            if(allowedFields.includes(key)){
                updates[key] = req.body[key];
            } else if (key == 'email'){
                throw createError(400,'Email can not be updated');
            }
        }

        const image = req.file?.path;
        if(image){
            if(image.size > 1024 * 1024 * 2){
                throw new Error('File too large.It must be less than 2 MB');
            }
            const response = await cloudinary_js_config.uploader.upload
            (image,{
              folder: 'ecommerceMern/users',
            });
            updates.image = response.secure_url;
        }
        const updatedUser = await user.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');

        if(!updatedUser){
            throw createError(404,'User with this ID does not exist');
        }

        if (user.image) {
            const publicId = await publicIdWithoutExtensinFromUrl(users.image);
            await deleteFileFromCloudinary(
                'ecommerceMern/users',
                publicId,
                'User'
            );
        }
        return updatedUser;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw(error);
    }
};


const updateUserPasswordById = async (userId, email, oldPassword, newPassword, confirmedPassword) => {
  try { 
        
        const user = await User.findOne({email: email});

        if(!user){
            throw createError(404, 'user is not found with this email');
        }

        if(newPassword != confirmedPassword){
            throw createError(
                400,'New password and confirmed password did not match'
            );
        }

    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isPasswordMatch){
      throw createError(400, ' old passsword d is not correct');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { password: newPassword },
        {new:true}
    ).select('-password');

    if(!updatedUser){
        throw createError(400,'User was not updated successfully');
    }
    return updatedUser;
       
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw(error);
    }
};

const forgetPasswordByEmail = async (email) => {
  try { 
    const userData = await user.findOne({email: email});
    if(!userData){
        throw createError(404,'Email is incorrect or you have not verify your email address.Please register yourself first');
    }

    const token = createJSONWebToken(
        { email },
        jwtActivationKey,
        '10m'
    );

    //prepare email
    const emailData = {
        email,
        subject: 'Reset password Email',
        html:`
        <h2> Hellow ${userData.name} ! </h2>
        <p> Please click here to <a href="${clientURL}/api/users/reset-password/${token}" target="_blank"> reset your password </a> </p>
        `
    };

    // send email with nodemailer
    sendemail(emailData);

    return token;
  
    } catch (error) {
        throw(error);
    }
};

const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, 'Invalid or expired token');
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select('-password');

    if (!updatedUser) {
      throw createError(400, 'Password reset failed');
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};


const handleUserAction = async (userId, action) => {
    try{
      let update;
let successMessage;
if (action == 'ban') {
  update = { isBanned: true };
  successMessage = "User was banned successfully";
} else if (action == 'unban') {
  update = { isBanned: false };
  successMessage = "User was unbanned successfully";
} else {
  throw createError(400, 'Invalid action. Use "ban" or "unban"');
}

const updateOptions = { new: true, runValidators: true, context: 'query' };

const updatedUser = await User.findByIdAndUpdate(userId, update, updateOptions).select("-password");

    if(!updatedUser){
    throw createError(400,'User was not banned successfully');
    }
    return successMessage;
    } catch (error){}
    if( error instanceof mongoose.Error.CastError){
        throw createError(400,'Invalid ID')
    }
        {
      throw error;
    }
};

module.exports = {
    findUsers, 
    findUserById, 
    deleteUserById, 
    updateUserById,
    updateUserPasswordById, 
    forgetPasswordByEmail,
    resetPassword,
    handleUserAction };

 