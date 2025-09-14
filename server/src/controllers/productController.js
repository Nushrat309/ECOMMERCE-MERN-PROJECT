const createError = require('http-errors');
const slugify =require("slugify");
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/finditem');
const Product = require('../models/productModel');
const { createProduct, getProducts, getProductBySlug, deleteProductBySlug, updateProductBySlug } = require('../services/productService');

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

const handleGetProducts = async (req,res,next) =>{
    try{
     const search = req.body.search || '';
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 4;

    const searchRegExp = new RegExp('.*' + search + '*.','i');
    const filter = {
        $or: [
            { name: {$regex: searchRegExp }},
            // { email: {$regex: searchRegExp }},
        ],
    };

     const productData = await getProducts(page, limit, filter);

     return successResponse(res,{
        statusCode:200,
        message: 'Return all the products',
        payload: {
          products: productData.products,
          pagination: {
            totalPages: productData.totalPages,
            currentPage: productData.currentPage,
            previousPage: currentPage-1,
            nextPage: currentPage+1,
            totalNumberofProducts: productData.count,
          },
         },
        });
    }catch (error){
        next(error);
    }
};

const handleGetProduct = async (req,res,next) =>{
    try{
     const {slug} = req.params;
     const product = await getProductBySlug(slug);
     return successResponse(res,{
        statusCode:200,
        message: 'Return single product',
        payload: { product }, 
        });
    }catch (error){
        next(error);
    }
};

const handledeleteProduct = async (req,res,next) =>{
    try{
     const {slug} = req.params;
     await deleteProductBySlug(slug);
     return successResponse(res,{
        statusCode:200,
        message: 'Deleted single product', 
        });
    }catch (error){
        next(error);
    }
};

const handleUpdateProduct = async(req, res, next) => {
    try {
        const {slug} = req.params;
        const updatedProduct = await updateProductBySlug(slug,req);
        return successResponse(res, {
            statusCode: 200,
            message: 'Product was updated successfully',
            payload: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { handleCreateProducts, handleGetProducts, handleGetProduct, handledeleteProduct, handleUpdateProduct };