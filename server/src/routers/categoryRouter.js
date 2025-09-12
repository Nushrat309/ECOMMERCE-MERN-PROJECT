const express = require('express');

const runValidation =require('../validators');
const{ isLoggedIn,isLoggedOut,isAdmin } = require('../middlewares/auth');
const { handleCreateCategory, handleCreateCategories, handleGetCategory  } = require('../controllers/categoryController');
const categoryRouter = express.Router();

categoryRouter.post('/',validateCategory,runValidation,isLoggedIn,isAdmin,handleCreateCategory);

categoryRouter.get('/',handleCreateCategories);
categoryRouter.get('/:slug', handleGetCategory);


module.exports = categoryRouter;