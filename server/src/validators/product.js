const {body} = require("express-validator");

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required.Enter your name')
    .isLength({ min: 3, max: 150})
    .withMessage('Product name should be at least 3-150 charecters long'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description name is required.Enter your name')
    .isLength({ min: 3})
    .withMessage('Description name should be at least 3 charecters long'),

  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price name is required.Enter your name')
    .isFloat({ min: 0})
    .withMessage('Description name should be a positive number'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('quantity')
    .trim()
    .notEmpty()
    .withMessage('Qantity name is required.')
    .isFloat({ min: 0})
    .withMessage('Quantity name should be a positive number'),

  body('image').optional().isString().withMessage('Product image is optional'),

];

module.exports = { 
  validateProduct
 };