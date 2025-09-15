const multer = require('multer');
const {UPLOAD_USER_IMG_DIRECTORY,UPLOAD_PRODUCT_IMG_DIRECTORY, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config');

const userStorage = multer.diskStorage({
  //destination: function (req, file, cb){
    //cb(null, UPLOAD_USER_IMG_DIRECTORY);
  //},
  filename: function (req, file, cb){
    cb(null,Date.now() + '-' + file.originalname);
  },
});

const productStorage = multer.diskStorage({
  //destination: function (req, file, cb){
    //cb(null, UPLOAD_PRODUCT_IMG_DIRECTORY);
  //},
  filename: function (req, file, cb){
    cb(null,Date.now() + '-' + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  if(!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error('File type is not allowed'), false)
  }
  cb(null, true);
}

const uploadUserImage = multer({ storage: userStorage,
     limit: { fileSize: MAX_FILE_SIZE },
     fileFilter: fileFilter,
 });

 const uploadProductImage = multer({ storage: productStorage,
     limit: { fileSize: MAX_FILE_SIZE },
     fileFilter: fileFilter,
 });

module.exports = {uploadUserImage, uploadProductImage};