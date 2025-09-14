const slugify = require('slugify');
const createError = require('http-errors');
const { options } = require('../routers/categoryRouter');
const Product = require('../models/productModel');

const createProduct = async (productData,image) => {
        
    if(image && image.size > 1024 * 1024 * 2){
        throw createError(400, 'File too large.It must be less than 2 MB');
        }

    if(image) {
        productData.image = image;
    }

    const productExists = await Product.exists({name:productData.name});
        if(productExists){
            throw createError(409,'Product with this name already exist');
        }
    
    const product = await Product.create({...productData,slug:slugify(productData.name)});

    return product;
};

module.exports = { createProduct };