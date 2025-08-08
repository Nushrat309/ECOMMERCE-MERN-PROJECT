const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt'); // fixed typo: 'bycrypt' ➝ 'bcrypt'

const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
        name: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
            minlength: [3, 'The length of user name must be at least 3 characters'],
            maxlength: [31, 'The length of user name must be at most 31 characters'],
        },

        email: {
            type: String,
            required: [true, 'User email is required'],
            trim: true,
            unique: true, // fixed typo: 'uniqe' ➝ 'unique'
            lowercase: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Please enter a valid email',
            },
        },

        password: {
            type: String,
            required: [true, 'User password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)), // fixed function wrapping
        },

        image: {
            type: String,
            default: defaultImagePath,
        },

        address: {
            type: String,
            required: [true, 'User address is required'],
        },

        phone: {
            type: String,
            required: [true, 'User phone is required'],
        },

        isAdmin: {
            type: Boolean, // fixed: was "type Boolean"
            default: false,
        },

        isBanned: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true } // moved to second parameter, not inside schema fields
);

// Model creation
const User = model('User', userSchema); // 'User' instead of 'Users' is conventional
module.exports = User;