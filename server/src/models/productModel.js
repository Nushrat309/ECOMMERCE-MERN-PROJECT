const { Schema, model } = require('mongoose');
const { defaultImagePath } = require('../secret');

const productSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Product name is required'],
            minlength: [3, 'The length of product name must be at least 3 characters'],
            maxlength: [150, 'The length of product name must be at least 150 characters'],
        },

        slug: {
            type: String,
            required: [true, 'Product slug is required'],
            lowercase: true,
            unique: true,
        },

        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            minlength: [3, 'The length of description name must be at least 3 characters'],
        },

        price: {
            type: Number,
            required: [true, 'Product price is required'],
            trim: true,
            validate: {
               validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid price! Price must be greater than 0`,
          },
        },

        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            trim: true,
            validate: {
               validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid quantity! Quantity must be greater than 0`,
          },
        },

        sold: {
            type: Number,
            required: [true, 'Sold quantity is required'],
            trim: true,
            default: 0,
            validate: {
               validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid sold! Sold quantity must be greater than 0`,
          },
        },

        shipping: {
            type: Number,
            default: 0
        },

        image: {
            type:Buffer,
            contenType: String,
            default: defaultImagePath,
        },

        category:{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }

    }, 
    { timestamps: true }
);

const Product = model('Product', productSchema);
module.exports = Product;