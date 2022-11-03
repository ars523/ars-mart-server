const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
//@des POST upload product image
//@route /api/upload
//@access private (only admin)
const uploadProductImage = asyncHandler(
    async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                  resolve(result);
                  console.log('resolve')
                } else {
                  reject(error);
                  console.log('error')
                }
              });
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
          };
          const result = await streamUpload(req);
        res.status(201).json(result)
    }
)

module.exports = {
    uploadProductImage
}