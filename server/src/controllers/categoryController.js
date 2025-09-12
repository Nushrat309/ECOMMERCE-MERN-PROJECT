const slugify = require('slugify');

const { successResponse } = require("./responseController");
const category = require("../models/categoryModel");
const { createCategory, getCategories } = require('../services/categoryService');

const handleCreateCategory = async (req,res,next) =>{
    try{
        const {name} = req.body;

        await createCategory(name);
        
        return successResponse(res,{
         statusCode:200,
         message: 'Category was created successfully',
         });
       }catch (error){
        next(error);
    }
};

const handleCreateCategories = async (req,res,next) =>{
    try{
        const categories = await getCategories();
        return successResponse(res,{
         statusCode:200,
         message: 'Categories fetched successfully',
         payload: categories,
         });
       }catch (error){
        next(error);
    }
};

const handleGetCategory = async (req,res,next) =>{
    try{
        const {slug} = req.params;
        const categories = await getCategory(slug);
        return successResponse(res,{
         statusCode:200,
         message: 'Categories fetched successfully',
         payload: categories,
         });
       }catch (error){
        next(error);
    }
};

module.exports = { handleCreateCategory, handleCreateCategories,handleGetCategory };