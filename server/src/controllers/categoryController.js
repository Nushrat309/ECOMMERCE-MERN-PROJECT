const slugify = require('slugify');
const createError = require('http-errors');

const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const { createCategory, getCategories, updateCategory } = require('../services/categoryService');

const handleCreateCategory = async (req,res,next) =>{
    try{
        const {name} = req.body;

        await createCategory(name);
        
        return successResponse(res,{
         statusCode:201,
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
        const category = await getCategory(slug);

        if(!category){
            throw createError(404, 'No category found with thus slug');
        }

        return successResponse(res,{
         statusCode:200,
         message: 'Categories fetched successfully',
         payload: category,
         });
       }catch (error){
        next(error);
    }
};

const handleUpdateCategory = async (req,res,next) =>{
    try{
        const {name} = req.body;
        const {slug} = req.params;

        const updatedCategory = await updateCategory(name, slug);
        if(!updatedCategory){
            throw createError(404, 'No category found with this slug');
        }
        
        return successResponse(res,{
         statusCode:200,
         message: 'Category updated successfully',
         payload: updatedCategory,
         });
       }catch (error){
        next(error);
    }
};

const handleDeleteCategory = async (req,res,next) =>{
    try{
        const {slug} = req.params;

        const result = await deleteCategory(slug);
        if(!result){
            throw createError(404, 'No category found');
        }
        
        return successResponse(res,{
         statusCode:200,
         message: 'Category deleted successfully',
         payload: updatedCategory,
         });
       }catch (error){
        next(error);
    }
};

module.exports = { 
    handleCreateCategory,
    handleCreateCategories,
    handleGetCategory,
    handleUpdateCategory,
    handleDeleteCategory
 };