const createError = require('http-error');
const fs = require('fs').promises;

const User = require("../models/userModel");
const { findwithId } = require("../services/finditem");
const { successResponse } = require("./responseController");
const { deleteImage } = require('../helper/deleteImage');

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
}
const deleteUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findwithId(User,id, options);

        const userImagePath = user.image;

        deleteImage(userImagePath);


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
}

module.exports = { getUsers, getUserById, deleteUserById };