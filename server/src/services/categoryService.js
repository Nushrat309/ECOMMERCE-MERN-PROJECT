const slugify = require('slugify');;
const category = require("../models/categoryModel");

const createCategory = async () =>{

    const newCategory = await category.create({
        name: name,
        slug: slugify(name),
        });
    return newCategory;
};

const getCategories = async (name) =>{

    return await category.find({}).select('name slug').lean();
};

const getCategory = async (slug) =>{

    return await category.find({slug}).select('name slug').lean();
};

module.exports = { createCategory,getCategories,getCategory };