const express = require('express');
const multer  = require('multer');
const isAdmin = require('../middleware/adminMiddleware');
const protect = require('../middleware/authMiddleware')
const {uploadProductImage} = require('../controllers/uploadController')

const upload = multer();
const uploadRouter = express.Router();

uploadRouter.post('/', protect, isAdmin, upload.single('file'), uploadProductImage)

module.exports = uploadRouter