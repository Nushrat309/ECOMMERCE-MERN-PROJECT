const express = require('express');

const runValidation =require('../validators');
const{ isLoggedIn,isLoggedOut,isAdmin } = require('../middlewares/auth');
const { handleCreateCategory, handleCreateCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory } = require('../controllers/categoryController');
const categoryRouter = express.Router();

categoryRouter.post('/',validateCategory,runValidation,isLoggedIn,isAdmin,handleCreateCategory);
categoryRouter.get('/',handleCreateCategories);
categoryRouter.get('/:slug', handleGetCategory);
categoryRouter.put('/slug',validateCategory,runValidation,isLoggedIn,isAdmin, handleUpdateCategory);
categoryRouter.delete('/:slug',isLoggedIn,isAdmin, handleDeleteCategory);


module.exports = categoryRouter;