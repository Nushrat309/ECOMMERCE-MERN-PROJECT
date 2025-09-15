const cloudinary = require("../config/cloudinary");

const publicIdWithoutExtensinFromUrl = async(imageUrl) => {
    const pathSegments =imageUrl.split('/');

    const lastSegment = pathSegments[pathSegments.length - 1];

    const valueWithoutExtension = lastSegment.replace('.jpg', '');

    return valueWithoutExtension;
};

const deleteFileFromCloudinary = async(foldername,publicId,modelName) => {
    try{
      const { result } = await cloudinary.uploader.destroy(
        `${foldername}/${publicId}`
      );

      if (result !== 'ok') {
        throw new Error(
          `${modelName} image was not deleted successfully from cloudinary. Please try again`
        );
      }
    } catch (error){
        throw error;
    }
};

module.exports = { publicIdWithoutExtensinFromUrl,deleteFileFromCloudinary };