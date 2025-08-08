const createError = require('http-errors');
const User = require("../models/userModel");

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

        res.status(200).json({
            message: "Users were returned",
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers };