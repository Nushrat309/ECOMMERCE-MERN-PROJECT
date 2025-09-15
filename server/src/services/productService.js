const slugify = require('slugify');
const createError = require('http-errors');
const createHttpError = require('http-errors');

const Product = require('../models/productModel');
const { publicIdWithoutExtensinFromUrl, deleteFileFromCloudinary } = require('../helper/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');

const createProduct = async (productData) => {
        
    if(image && image.size > 1024 * 1024 * 2){
        throw createError(400, 'File too large.It must be less than 2 MB');
        }

    if(image) {
        const response = await cloudinary.uploader.upload(image,{
            folder: 'ecommerceMern/products',
        });
        decode.image = response.secre_url;
    }

    const productExists = await Product.exists({name:productData.name});
        if(productExists){
            throw createError(409,'Product with this name already exist');
        }
    
    const product = await Product.create({...productData,slug:slugify(productData.name)});

    return product;
};

const getProducts = async ( page = 1, limit = 4,filter={}) => {
     const products = await Product.find(filter)
     .populate('category').skip((page-1) * limit)
     .limit(limit)
     .sort({ createdAt: -1});

     if(!products) throw createError(404, 'No products found');

     const count = await Product.find(filter).countDocuments();

     return { products, count, totalPages: Math.ceil(count / limit), currentPage: page,};
};

const getProductBySlug = async ( slug ) => {
     
    const product = await Product.findOne({slug}).populate('category');

     if(!product) throw createError(404, 'No product found');

     return product;
};

const deleteProductBySlug = async ( slug ) => {
    try{
     const existingProduct = await Product.findOneAndDelete({slug});

     if(!existingProduct) throw createError(404, 'No product found with this slug');

      if(existingProduct.image) {
        await publicIdWithoutExtensinFromUrl(existingProduct.image);
       deleteFileFromCloudinary('ecommerceMern/product',publicIdWithoutExtensinFromUrl,'Product');
      }

     await Product.findOneAndDelete({ slug });

    }catch (error){
        throw error;
    }
};

const updateProductBySlug = async ( slug, req ) => {

  try{ 
    const product = await Product.findOne({slug: slug});

    if(!product){
        throw createHttpError(404, 'Product not found');
    }

    const updateOptions = { new: true, runValidators: true, context: 'query' };
    let updates ={};

     const allowFields = ['name','description','price','sold','quantity','shipping'];

        for(const key in req.body){
          if (allowFields.includes(key)){
            if (key == 'name'){
                updates.slug = slugify(req.body[key]);
            }
          }
            updates[key] = req.body[key];
            }
     const image = req.file?.path;
        if(image){
            if(image.size > 1024 * 1024 * 2){
                throw new Error('File too large.It must be less than 2 MB');
            }
            updates.image = image;
            product.image != 'default.jpeg' && deleteImage(product.image);
        }

        const updatedProduct = await User.findOneAndUpdate({slug}, updates, updateOptions);

        if(!updatedProduct){
            throw createError(404,'Updating product was not possible');
        }
        if (product.image) {
            const publicId = await publicIdWithoutExtensinFromUrl(product.image);
            await deleteFileFromCloudinary(
                'ecommerceMern/products',
                publicId,
                'Product'
            );
        }
        return updatedProduct;
  } catch (error){

  }
};

module.exports = { createProduct, getProducts, getProductBySlug, deleteProductBySlug, updateProductBySlug };