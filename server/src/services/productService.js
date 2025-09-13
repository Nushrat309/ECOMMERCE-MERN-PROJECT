const slugify = require('slugify');
const createError = require('http-errors');
const { options } = require('../routers/categoryRouter');
const Product = require('../models/productModel');

const createProduct = async (productData) => {
     const { name,description,price,category,quantity,shipping,imageBufferString } = productData;

    const productExists = await Product.exists(email);
        if(productExists){
            throw createError(409,'Product with this name already exist');
        }
    
        const product = await Product.create({
          name: name,
          slug:slugify(name),
          description: description,
          price: price,
          quantity: quantity,
          shipping: shipping,
          image: imageBufferString,
          category: category
        });

        return product;
};

module.exports = { createProduct };