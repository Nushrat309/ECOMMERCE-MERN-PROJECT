const {body} = require("express-validator");
//regitration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.Enter your name')
    .isLength({ min: 3, max: 31})
    .withMessage('Name should be at least 3-31 charecters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.Enter your email address')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.Enter your password')
    .isLength({ min: 6})
    .withMessage('Password should be at least 6 charecters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required.Enter your address')
    .isLength({ min: 3})
    .withMessage('Address should be at least 3 charecters long'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required.Enter your phone number'),
    
  body('image').optional().isString().withMessage('User image is optional'),
];

const validateUserLogin = [

   body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.Enter your email address')
    .isEmail()
    .withMessage('Invalid email address'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.Enter your password')
    .isLength({ min: 6})
    .withMessage('Password should be at least 6 charecters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

];

const validateUserPasswordUpdate = [
  body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old password is required.Enter your old password')
    .isLength({ min: 6})
    .withMessage('Old password should be at least 6 charecters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required.Enter your new password')
    .isLength({ min: 6})
    .withMessage('New password should be at least 6 charecters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),

  body('confirmedPassword').custom((value,{ req }) =>{
    if(value != req.body.newPassword) {
      throw new Error('Password did not match');
    }
    return true;
  }),

];

const validateUserForgetPassword = [

   body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.Enter your email address')
    .isEmail()
    .withMessage('Invalid email address'),

];

const validateUserResetPassword = [

   body('token')
    .trim()
    .notEmpty()
    .withMessage('Invalid email address'),

   body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.Enter your password')
    .isLength({ min: 6})
    .withMessage('Password should be at least 6 charecters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];



//sign in validation

module.exports = { 
  validateUserRegistration, 
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
 };