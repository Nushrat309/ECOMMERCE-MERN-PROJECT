const createError = require("http-error");
const mongoose = require('mongoose');

const { isAdmin } = require("../middlewares/auth");
const { successResponse } = require("../controllers/responseController");
const { handleGetUsers } = require("../controllers/userController");
const { options } = require("../routers/userRouter");
const { deleteImage } = require("../helper/deleteImagee");


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


const deleteUserById = async (Id, options = {}) => {
  try {
    const user = await User.findOneAndDelete({
      _id: Id,
      isAdmin: false,
    });

    if (user && user.image) {
      await deleteImage(user.image);
    }
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
            updates.image = image;
            user.image != 'default.jpeg' && deleteImage(user.image);
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');

        if(!updatedUser){
            throw createError(404,'User with this ID does not exist');
        }
        return updatedUser;
    } catch (error) {
        if(error instanceof mongoose.Error.CastError){
            throw createError(400,'Invalid Id');
        }
        throw(error);
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

module.exports = {findUsers, findUserById, deleteUserById, updateUserById, handleUserAction };