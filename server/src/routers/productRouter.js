const express = require('express');

const {uploadUserImage,uploadProductImage} = require('../middlewares/uploadFile');

const runValidation = require('..validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const {handleCreateProducts,handleGetProducts, handleGetProduct, handledeleteProduct, handleUpdateProduct} =require('../controllers/productController');
const { validateProduct } = require('../validators/product');


const productRouter = express.Router();

// GET: api/users
productRouter.post('/',uploadUserImage.single("image"),validateProduct, runValidation,isLoggedIn,isAdmin, handleCreateProducts);
productRouter.post('/',uploadProductImage.single("image"),validateProduct, runValidation,isLoggedIn,isAdmin, handleCreateProducts);
productRouter.get('/',handleGetProducts);
productRouter.get('/:slug',handleGetProduct);
productRouter.delete('/:slug',isLoggedIn, isAdmin, handledeleteProduct);
productRouter.put('/:slug',upload.single('image'), handleUpdateProduct);


module.exports = productRouter;