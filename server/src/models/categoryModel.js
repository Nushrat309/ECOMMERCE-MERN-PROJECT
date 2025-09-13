const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs'); 

const { defaultImagePath } = require("../secret");

const categorySchema = new Schema({
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            minlength: [3, 'The length of categoryr name must be at least 3 characters'],
        },

        slug: {
            type: String,
            required: [true, 'Category slug is required'],
            lowercase: true,
            unique: true,
        },

    }, 
    { timestamps: true }
);

const Category = model('category', categorySchema);
module.exports = Category;