const express = require('express');

const uploadUserImage = require('../middlewares/uploadFile');

const runValidation = require('..validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const {handleCreateProducts} =require('../controllers/productController');
const { validateProduct } = require('../validators/product');


const productRouter = express.Router();

// GET: api/users
productRouter.post('/',uploadUserImage.single("image"),validateProduct, runValidation,isLoggedIn,isAdmin, handleCreateProducts);

module.exports = productRouter;