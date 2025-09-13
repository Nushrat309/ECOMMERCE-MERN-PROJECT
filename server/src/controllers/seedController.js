const data = require('../data');
const User = require("../models/userModel");

const seedUser = async(req, res, next) => {
    try {
        // Deleting all existing users
        await User.deleteMany({});

        // Inserting new users
        const users = await User.insertMany(data.users);

        // Successfully responding
        return res.status(201).json(users);
    } catch (error) {
        next(error);
    }
};

const seedProducts = async(req, res, next) => {
    try {
        // Deleting all existing users
        await Product.deleteMany({});

        // Inserting new users
        const products = await Product.insertMany(data.products);

        // Successfully responding
        return res.status(201).json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = { seedUser, seedProducts };