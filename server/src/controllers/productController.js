const createError = require('http-errors');
const slugify =require("slugify");
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/finditem');
const Product = require('../models/productModel');
const { createProduct } = require('../services/productService');

const handleCreateProducts = async (req,res,next) =>{
    try{
     const image = req.file?.path;

     const product = await createProduct(req.body,image);

     return successResponse(res,{
        statusCode:200,
        message: 'product was created successfully',
        payload: product,
        });
    }catch (error){
        next(error);
    }
};

module.exports = { handleCreateProducts };